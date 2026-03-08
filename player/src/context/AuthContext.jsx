import React, { createContext, useState, useEffect, useLayoutEffect, useContext } from 'react';
import { api } from '../services/api'; 

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- TEMPORARY DEV FIX: Initialize from localStorage ---
  // We will revert this to 'useState()' (empty) once the backend /api/me is ready.
  const [token, setToken] = useState(localStorage.getItem('token') || undefined); 

  useEffect(() => {
    const fetchSession = async () => {
      try {
        // --- TEMPORARY: Skip the backend check for now ---
        // const response = await api.get('/api/me'); 
        // setToken(response.data.accessToken);
        
        // Just load user data from storage if we have a token
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('userData');
        
        if (storedToken && storedUser) {
           setUser(JSON.parse(storedUser));
           setToken(storedToken); // Restore token to state
        }
        
      } catch (error) {
        setToken(null);
        localStorage.clear(); 
      } finally {
        setLoading(false);
      }
    };
    
    fetchSession();
  }, []);

  // Request Interceptor (Keeps your token in headers)
  useLayoutEffect(() => {
    const requestInterceptor = api.interceptors.request.use((config) => {
      // Pass the token if we have it
      if (!config._retry && token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return () => api.interceptors.request.eject(requestInterceptor);
  }, [token]);

  // Response Interceptor (Handles 401/403)
  useLayoutEffect(() => {
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 403 && error.response?.data?.message === "unauthorized") {
           // ... (Keep your refresh logic here) ...
        }
        return Promise.reject(error);
      }
    );

    return () => api.interceptors.response.eject(responseInterceptor);
  }, []);

  // --- LOGIN: Save to LocalStorage (Temporary) ---
  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken); 
    
    // DEV MODE ONLY: Save token to storage so it survives refresh
    localStorage.setItem('token', authToken); 
    
    localStorage.setItem('userData', JSON.stringify(userData));
    if (userData.id) localStorage.setItem('playerId', userData.id);
  };

  // --- LOGOUT: Clear everything ---
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.clear(); 
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
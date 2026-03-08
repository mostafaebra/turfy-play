// src/context/AdminAuthContext.jsx
import React, { createContext, useState, useEffect, useLayoutEffect, useContext } from 'react';
import { adminApi } from '../services/adminApi';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Token lives strictly in memory for maximum security against XSS
  const [token, setToken] = useState();

  // 1. Initial Load: Check backend for active session
  useEffect(() => {
    const fetchSession = async () => {
      try {
        // TEMPORARY DEV BYPASS: If your backend hasn't built /api/admin/me yet, 
        // you can temporarily read from localStorage just to keep working.
        // Once backend is ready, uncomment the api.get line and remove the localStorage fallback.
        
        /* const response = await adminApi.get('/GetAdminSessionEndpoint'); 
        setToken(response.data.accessToken);
        */

        const storedToken = localStorage.getItem('adminToken_DEV_ONLY');
        const storedAdmin = localStorage.getItem('adminData');
        
        if (storedToken && storedAdmin) {
           setAdminUser(JSON.parse(storedAdmin));
           setToken(storedToken); 
        }
        
      } catch (error) {
        setToken(null);
        localStorage.removeItem('adminData'); 
      } finally {
        setLoading(false);
      }
    };
    
    fetchSession();
  }, []);

  // 2. Request Interceptor: Injects token into headers
  useLayoutEffect(() => {
    const requestInterceptor = adminApi.interceptors.request.use((config) => {
      if (!config._retry && token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return () => adminApi.interceptors.request.eject(requestInterceptor);
  }, [token]);

  // 3. Response Interceptor: Catches 401/403 and silently refreshes
  useLayoutEffect(() => {
    const responseInterceptor = adminApi.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        // If token expired, backend should return 401 or 403
        if (error.response?.status === 401 || (error.response?.status === 403 && error.response?.data?.message === "unauthorized")) {
          try {
            // Hit backend to get a new token via HTTP-only cookie
            const response = await adminApi.get('/RefreshTokenEndpoint'); 
            setToken(response.data.accessToken);
            
            originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
            originalRequest._retry = true;
            
            return adminApi(originalRequest);
          } catch (refreshError) {
            // Refresh token is dead; force logout
            logout(); 
          }
        }
        return Promise.reject(error);
      }
    );

    return () => adminApi.interceptors.response.eject(responseInterceptor);
  }, []);

  // 4. Login Function
  const login = (userData, authToken) => {
    setAdminUser(userData);
    setToken(authToken); 
    
    // Non-sensitive data stored in localStorage for fast UI rendering
    localStorage.setItem('adminData', JSON.stringify(userData));
    
    // DEV MODE ONLY: Remove this once your backend supports HTTP-only refresh cookies
    localStorage.setItem('adminToken_DEV_ONLY', authToken); 
  };

  // 5. Logout Function
  const logout = () => {
    setAdminUser(null);
    setToken(null);
    localStorage.removeItem('adminData');
    localStorage.removeItem('adminToken_DEV_ONLY');
    // Call backend to destroy secure cookie
    // adminAuthApi.logout(); 
  };

  return (
    <AdminAuthContext.Provider value={{ adminUser, token, login, logout, loading }}>
      {!loading && children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
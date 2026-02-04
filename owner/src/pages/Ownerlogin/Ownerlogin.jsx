import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom"; 
import axios from "axios"; 

export default function OwnerloginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(""); 
  const [loading, setLoading] = useState(false); 

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); 
    setLoading(true);

    try {
      // 1. FIX: Send standard JSON object (Axios does this by default)
      // Do NOT use new FormData() here.
      const payload = {
        emailOrPhone: email, 
        password: password,  
        discriminator: 1 // Send as number (1 = Owner)
      };

      const response = await axios.post(
        "http://turfyplaydev.runasp.net/Turfy/loginuserendpoint/handle", 
        payload
        // 2. FIX: Remove the 'Content-Type' header manually. 
        // Axios automatically sets 'application/json' for objects.
      );

      console.log("Login Response:", response.data);

      if (response.data && response.data.isSuccess) {
        // Success! Save token
        const token = response.data.data; 
        localStorage.setItem("authToken", token);
        
        // Redirect
        navigate("/create-field"); 
      } else {
        setError(response.data.message || "Login failed. Please check your credentials.");
      }
      
    } catch (err) {
      console.error("Login Error:", err);
      // Handle 415, 400, 500 errors gracefully
      if (err.response?.status === 415) {
        setError("System Error: Server expected JSON but got something else.");
      } else {
        setError(err.response?.data?.message || "Unable to connect to server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col items-stretch rounded-xl bg-white p-6 shadow-lg sm:p-8">
      <div className="flex flex-col gap-2">
        <p className="text-2xl font-bold text-[#1E293B]">
          Partner Portal Login
        </p>
        <p className="text-base text-slate-500">
          Log in to access your dashboard, bookings, and financials.
        </p>
      </div>

      <form onSubmit={handleLogin} className="mt-8 flex flex-col gap-6">
        
        {/* Email */}
        <label className="flex flex-col">
          <p className="text-sm font-medium text-slate-700 pb-2">
            Business Email / Mobile Number
          </p>
          <input
            type="text"
            placeholder="Enter your email or mobile number"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 rounded-lg border border-[#dee0e3] px-4 text-base 
                       focus:ring-2 focus:ring-primary/20 focus:border-primary"
            required
          />
        </label>

        {/* Password */}
        <label className="flex flex-col">
          <p className="text-sm font-medium text-slate-700 pb-2">Password</p>
          <div className="flex relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 flex-1 rounded-lg border border-[#dee0e3] px-4 pr-12 text-base 
                         focus:ring-2 focus:ring-primary/20 focus:border-primary"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>
        </label>

        {/* Remember + Forgot */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/50"
            />
            <label htmlFor="remember-me" className="text-sm text-slate-600">
              Remember Me
            </label>
          </div>
          <a className="text-sm font-semibold text-primary hover:underline cursor-pointer">
            Forgot Password?
          </a>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className={`h-12 rounded-lg bg-[#111827] text-white font-semibold 
                     hover:bg-[#0f172a] shadow-sm 
                     focus:ring-2 focus:ring-[#111827]/50 focus:ring-offset-2
                     transition-all ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          {loading ? "Logging in..." : "Log In to Dashboard"}
        </button>
      </form>

      {/* Separator */}
      <div className="mt-6 flex flex-col items-center gap-4">
        <div className="w-full border-t border-slate-200"></div>
        <p className="text-sm text-slate-600">
          Don't have a partner account yet?{" "}
          <Link 
            to="/signup"
            className="font-semibold text-primary hover:underline cursor-pointer"
          >
            List Your Field for Free
          </Link>
        </p>
      </div>
    </div>
  );
}
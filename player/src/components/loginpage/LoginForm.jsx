import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; 
import { useAuth } from "../../context/AuthContext";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { login } = useAuth(); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://turfytesting.runasp.net/Turfy/LoginUserEndpoint/Handle",
        {
          "emailOrPhone": email,
          "password": password,
          "discriminator": 2
        },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Login success:", response.data);
      login(response.data); 
      navigate("/");

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 font-display">
      
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-slate-700">Email or Phone Number</span>
        <input
          type="text"
          placeholder="Enter your email or phone number"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-12 rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
          required
        />
      </label>

      {/* PASSWORD FIELD WITH ERROR UNDERNEATH */}
      <div className="flex flex-col gap-1">
        <label className="flex flex-col gap-1 relative">
          <span className="text-sm font-medium text-slate-700">Password</span>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                  setPassword(e.target.value);
                  setError(""); // Clear error on type
              }}
              className={`h-12 w-full rounded-lg border bg-slate-50 px-4 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 
                ${error ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-emerald-500'}`}
              required
            />
            <button
              type="button"
              className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
        </label>
        
        {/* Error Message is now HERE (Under the password input) */}
        {error && (
            <p className="text-xs text-red-500 mt-1 ml-1 font-medium">{error}</p>
        )}
      </div>

      <Link to="/forgot-password" className="text-xs text-emerald-500 text-right hover:underline -mt-2 cursor-pointer">
            Forgot password?
      </Link>

      <button
        type="submit"
        disabled={loading}
        className="h-12 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition disabled:opacity-60"
      >
        {loading ? "Signing In..." : "Sign In"}
      </button>

      <div className="flex items-center gap-3 my-3">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-xs text-slate-400">or sign in with</span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      <button type="button" className="h-12 rounded-lg border border-[#dee0e3] bg-white flex items-center justify-center gap-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition">
        <FcGoogle size={20} /> Continue with Google
      </button>

      <button type="button" className="h-12 rounded-lg bg-[#1877F2] flex items-center justify-center gap-3 text-sm font-medium text-white hover:bg-[#166FE5] transition">
        <FaFacebookF size={16} /> Continue with Facebook
      </button>
    </form>
  );
}
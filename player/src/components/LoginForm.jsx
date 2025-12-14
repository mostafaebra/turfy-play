import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import axios from "axios";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    console.log({
  emailOrPhone: email,
  password,
  discriminator: 2
    })

    try {
      const response = await axios.post(
        "http://turfytesting.runasp.net/Turfy/LoginUserEndpoint/Handle",
        {
          "emailOrPhone": email,
          "password": password,
          "discriminator": 2 // player
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Login success:", response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 font-display">
      
      {/* Email / Phone */}
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-slate-700">
          Email or Phone Number
        </span>
        <input
          type="text"
          placeholder="Enter your email or phone number"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-12 rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm
                     focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          required
        />
      </label>

      {/* Password */}
      <label className="flex flex-col gap-1 relative">
        <span className="text-sm font-medium text-slate-700">
          Password
        </span>

        <input
          type={showPass ? "text" : "password"}
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-12 rounded-lg border border-slate-200 bg-slate-50 px-4 pr-11 text-sm
                     focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          required
        />

        {/* Eye icon */}
        <button
          type="button"
          className="absolute right-4 top-9 text-slate-400 hover:text-slate-600"
          onClick={() => setShowPass(!showPass)}
        >
          {showPass ? <FiEyeOff size={18} /> : <FiEye size={18} />}
        </button>
      </label>

      {/* Forgot password */}
      <a className="text-xs text-secondary text-right hover:underline -mt-2 cursor-pointer">
        Forgot password?
      </a>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-500 text-center">{error}</p>
      )}

      {/* Sign In */}
      <button
        type="submit"
        disabled={loading}
        className="h-12 rounded-lg bg-[#10B981] text-white text-sm font-semibold
                   hover:bg-primary/90 transition disabled:opacity-60"
      >
        {loading ? "Signing In..." : "Sign In"}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 my-3">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-xs text-slate-400">
          or sign in with
        </span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      {/* Google */}
     <button
  type="button"
  className="h-12 rounded-lg border border-[#dee0e3] bg-white
             flex items-center justify-center gap-3
             text-sm font-medium text-slate-700
             hover:bg-slate-50 transition"
>
  <FcGoogle size={20} />
  Continue with Google

      </button>

      {/* Facebook */}
     <button
  type="button"
  className="h-12 rounded-lg bg-[#1877F2]
             flex items-center justify-center gap-3
             text-sm font-medium text-white
             hover:bg-[#166FE5] transition"
>
  <FaFacebookF size={16} />
  Continue with Facebook
      </button>
    </form>
  )
}
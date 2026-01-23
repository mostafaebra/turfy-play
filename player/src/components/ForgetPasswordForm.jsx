import React, { useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";  


export default function ForgetPasswordForm() {
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      // POST request للـ backend
      const response = await axios.post(
        "http://turfywafaa.runasp.net/Turfy/RequestPasswordResetEndpoint/ResetPassword",
        {
          Email: identifier ,
          Discriminator : 3
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
       localStorage.setItem("resetEmail", identifier);
       navigate("/verify-code", { state: { email: identifier } });
      setMessage(response.data?.message || "A reset link or OTP has been sent.");
    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-display">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-dark mb-3">Forgot Your Password?</h1>
        <p className="text-sm text-[#64748B] max-w-xs mx-auto">
          No problem. Enter your registered email or phone number below, and we'll send you instructions to reset it.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-bold text-light">Email Address or Phone Number</span>
          <input
            type="text"
            placeholder="Enter your email or phone"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="h-12 px-4 rounded border border-border-color placeholder:text-gray-400 focus:ring-2 focus:ring-primary/40 focus:outline-none"
            required
          />
        </label>

        {message && (
          <p
            className={`text-sm text-center ${
              message.includes("Please") ? "text-red-500" : "text-primary"
            }`}
          >
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="h-12 rounded bg-primary text-white text-base font-semibold hover:bg-primary/90 transition"
        >
          {loading ? "Sending..." : "Send Reset Link / OTP"}
        </button>

        <Link
          to="/login"
          className="flex items-center justify-center gap-2 text-sm text-secondary hover:text-secondary/80 transition"
        >
          <FiArrowLeft size={16} />
          Back to Login
        </Link>
      </form>
    </div>
  );
}
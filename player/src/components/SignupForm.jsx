import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; 

const SIGNUP_URL = "http://turfytesting.runasp.net/Turfy/RegisterPlayerEndpoint/NewRegisterPlayer"; 

export default function SignupForm() {
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState(""); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [passwordStrength, setPasswordStrength] = useState(0); 
  const calculateStrength = (pass) => {
    if (pass.length < 6) return 0;
    if (pass.length < 10) return 1;
    return 2;
  };

  const handlePasswordChange = (e) => {
    const newPass = e.target.value;
    setPassword(newPass);
    setPasswordStrength(calculateStrength(newPass));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Password and Confirm Password do not match.");
      return;
    }
    
    if (!agreed) {
        setError("You must agree to the Terms of Service and Privacy Policy.");
        return;
    }

    setLoading(true);

    const signupData = {
      fullName,
      password,
      confirmPassword: confirmPassword,
      phoneNumber: `20${mobileNumber}`,
      email: email || null,
    };

    try {
      const response = await axios.post(SIGNUP_URL, signupData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

       if (response.data.isSuccess) {
        navigate("/login");
        console.log("Signup success:", response.data);
        setSuccess("Account created successfully! Redirecting...");
       } else {
        setError(response.data.message || "فشلت العملية، تأكد من صحة البيانات.");
      }
      
     } catch (err) {
      console.error("Signup failed:", err.response || err);
      setError(
        err.response?.data?.message || "Registration failed, please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-display">
      
      {/* Full Name */}
      <label className="flex flex-col gap-1">
        <span className="text-sm font-normal text-dark">Full Name</span>
        <input
          type="text"
          placeholder="Enter your full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="h-12 px-4 rounded border border-border-color placeholder:text-gray-400 focus:ring-2 focus:ring-primary/40 focus:outline-none"
          required
        />
      </label>

      {/* Mobile Number */}
      <label className="flex flex-col gap-1">
        <span className="text-sm font-normal text-dark">Mobile Number *</span>
        <div className="flex h-12 rounded border border-border-color focus-within:ring-2 focus-within:ring-primary/40">
          <span className="flex items-center bg-gray-50 border-r border-border-color px-3 text-text-dark font-medium rounded-l">
            +20
          </span>
          <input
            type="tel"
            placeholder="100 123 4567"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value.replace(/[^0-9]/g, ''))}
            className="flex-1 px-4 rounded-r focus:outline-none"
            required
          />
        </div>
      </label>

      {/* Email Address */}
      <label className="flex flex-col gap-1">
        <span className="text-sm font-normal text-dark">Email Address (Optional)</span>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-12 px-4 rounded border border-border-color placeholder:text-gray-400 focus:ring-2 focus:ring-primary/40 focus:outline-none"
        />
      </label>

      {/* Password */}
      <div className="flex flex-col gap-1 relative">
        <span className="text-sm font-normal text-dark">Password</span>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={handlePasswordChange}
            className="h-12 px-4 pr-10 w-full rounded border border-border-color placeholder:text-gray-400 focus:ring-2 focus:ring-primary/40 focus:outline-none"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        
        <div className="flex justify-between items-center mt-1">
            <div className="flex w-2/3">
                <div className="h-1 rounded-full w-1/3" style={{ 
                    backgroundColor: passwordStrength === 0 ? '#FEE2E2' : passwordStrength === 1 ? '#EF4444' : passwordStrength === 2 ? '#FBBF24' : '#10B981', 
                    transition: 'width 0.3s, background-color 0.3s' 
                }} />
            </div>
            <span className={`text-xs ${passwordStrength === 0 ? 'text-red-500' : passwordStrength === 1 ? 'text-yellow-500' : 'text-primary'}`}>
                {passwordStrength === 0 ? 'Weak' : passwordStrength === 1 ? 'Medium' : 'Strong'}
            </span>
        </div>
      </div>

      {/* Confirm Password */}
      <div className="flex flex-col gap-1">
        <span className="text-sm font-normal text-dark">Confirm Password</span>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="h-12 px-4 pr-10 w-full rounded border border-border-color placeholder:text-gray-400 focus:ring-2 focus:ring-primary/40 focus:outline-none"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      {/* Terms and Privacy Checkbox */}
      <div className="flex items-start my-2">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="h-4 w-4 text-primary rounded border-border-color focus:ring-primary mt-1"
          id="terms-agree"
          required
        />
        <label htmlFor="terms-agree" className="ml-2 text-sm text-text-light">
          I agree to the 
          <a href="#" className="text-secondary hover:underline ml-1">Terms of Service</a> 
          <span className="mx-1">and</span> 
          <a href="#" className="text-secondary hover:underline">Privacy Policy.</a>
        </label>
      </div>
      
      {error && (
        <p className="text-sm text-red-500 text-center font-medium mt-1">{error}</p>
      )}
      {success && (
        <p className="text-sm text-primary text-center font-medium mt-1">{success}</p>
      )}

      <button
        type="submit"
        disabled={loading || !agreed}
        className="h-12 rounded bg-primary text-white text-base font-bold hover:bg-primary/90 transition " 
      >
        {loading ? "Processing..." : "Verify & Create Account"}
      </button>
      
    </form>
  );
}
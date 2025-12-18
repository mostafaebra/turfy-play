import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export default function VerificationForm({}) {
  const [code, setCode] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(59);
  const inputRefs = useRef([]);
  const location = useLocation();
  const navigate = useNavigate();
  const Email = location.state?.email || 
  localStorage.getItem("resetEmail");
  

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    } else if (timer === 0) clearInterval(interval);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    const newCode = [...code];
    newCode[index] = element.value;
    setCode(newCode);
    if (element.value !== "" && index < 5) inputRefs.current[index + 1].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && code[index] === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async (e) => {
  e.preventDefault();
  const verificationCode = code.join("");
  if (verificationCode.length !== 6) {
    alert("Please enter the full 6-digit code.");
    return;
  }

  setLoading(true);
  try {
    if (!Email) {
      alert("Email is missing. Please go back and try again.");
      return;
    }
    
    const response = await axios.post(
      "http://turfywafaa.runasp.net/Turfy/VerifyResetCodeEndpoint/ResetPassword",
      {
        Email: Email,
        code: verificationCode,
      },
      { headers: { "Content-Type": "application/json" } }
    );
       console.log("Full API response:", response.data);
    // ===== التعديل البسيط هنا =====
    const receivedToken = response.data.data;
    if (typeof receivedToken === "object" && receivedToken !== null) {
      localStorage.setItem("resetToken", receivedToken.token || JSON.stringify(receivedToken));
    } else {
      localStorage.setItem("resetToken", receivedToken);
    }
    console.log("Stored token:", localStorage.getItem("resetToken"));
    // ============================

    if (response.data) {
      navigate('/set-new-password');
      alert("Code verified! Token received.");
    } else {
      alert("Verification failed. Please try again.");
    }
  } catch (error) {
    console.error(error);
    alert(error.response?.data?.message || "An error occurred.");
  } finally {
    setLoading(false);
  }
};

  const handleResend = () => {
    if (timer === 0) {
      setTimer(59);
      console.log("Resending code...");
      // هنا يمكنك استدعاء API لإعادة إرسال الكود إذا أردت
    }
  };

  return (
    <div className="font-display">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-dark mb-3">Enter Verification Code</h1>
        <p className="text-sm text-light max-w-xs mx-auto">
          We've sent a 6-digit code to your phone number ending in •••• 1234.
        </p>
      </div>

      <form onSubmit={handleVerify} className="flex flex-col gap-6">
        <div className="flex justify-center gap-3 mb-4">
          {code.map((data, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={data}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={el => inputRefs.current[index] = el}
              className="w-12 h-14 text-2xl text-center border border-border-color rounded-lg focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition"
              required
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={loading || code.join("").length !== 6}
          className="h-12 rounded bg-primary text-white text-base font-semibold hover:bg-primary/90 transition"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>

        <div className="text-center text-sm text-text-light mt-1">
          Didn't receive the code?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={timer > 0}
            className={`font-medium transition ${timer > 0 ? 'text-secondary cursor-default' : 'text-secondary hover:text-secondary/80'}`}
          >
            Resend ({timer > 0 ? `0:${timer < 10 ? '0' : ''}${timer}` : 'Active'})
          </button>
        </div>
      </form>
    </div>
  );
}

import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";  
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function NewPasswordForm() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0); 

  const navigate = useNavigate();

  const calculateStrength = (pass) => {
    if (pass.length < 6) return 0;
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^a-zA-Z0-9\s]/.test(pass)) score++;
    if (score >= 3) return 2;
    if (score >= 1) return 1;
    return 0;
  };

  const handlePasswordChange = (e) => {
    const newPass = e.target.value;
    setNewPassword(newPass);
    setPasswordStrength(calculateStrength(newPass));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmNewPassword) {
      setError("كلمتا المرور غير متطابقتين.");
      return;
    }

    const resetTokenRaw = localStorage.getItem("resetToken");
    const email = localStorage.getItem("resetEmail");

    if (!resetTokenRaw || !email) {
      setError("حدث خطأ، يرجى إعادة المحاولة.");
      return;
    }

    // ===== التأكد من أن token string =====
    let resetToken = resetTokenRaw;
    try {
      const parsed = JSON.parse(resetTokenRaw);
      if (typeof parsed === "object" && parsed !== null) {
        resetToken = parsed.token || JSON.stringify(parsed);
      }
    } catch (e) {
      resetToken = resetTokenRaw;
    }
    // =====================================

    const payload = {
      Email: email,
      NewPassword: newPassword,
      ConfirmPassword: confirmNewPassword,
      ResetToken: resetToken ,
      Discriminator : 3 ,
    };

    try {
      setLoading(true);
      console.log("Sending Payload:", payload);

      const response = await axios.post(
        "http://turfywafaa.runasp.net/Turfy/ResetPasswordEndpoint/ResetPassword",
        payload
      );

      if (response.data.isSuccess) {
        alert("تم تغيير كلمة المرور بنجاح!");
        localStorage.removeItem("resetEmail");
        localStorage.removeItem("resetToken");
        navigate("/reset-success");
      } else {
        setError(response.data.message || "فشلت العملية، تأكد من صحة البيانات.");
      }
    } catch (err) {
      console.error("Error Detail:", err.response?.data);
      setError(err.response?.data?.message || "حدث خطأ في الاتصال بالسيرفر.");
    } finally {
      setLoading(false);
      
    }
  };

  const getStrengthBarClass = () => {
    if (passwordStrength === 2) return "bg-primary w-full";
    if (passwordStrength === 1) return "bg-yellow-500 w-2/3";
    return "bg-red-500 w-1/3";
  };

  const getStrengthText = () => {
    if (passwordStrength === 2) return <span className="text-xs text-primary">Strong</span>;
    if (passwordStrength === 1) return <span className="text-xs text-yellow-500">Medium</span>;
    return <span className="text-xs text-red-500">Weak</span>;
  };

  return (
    <div className="font-display">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold font-[sans-serif] text-dark mb-3">
          Set New Password
        </h1>
        <p className="text-sm font-normal text-text-light max-w-xs mx-auto">
          Your new password must be at least 8 characters long and include a number and a symbol.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <label className="flex flex-col gap-1 relative">
          <span className="text-sm font-medium text-light">New Password</span>
          <input
            type={showPass ? "text" : "password"}
            placeholder="Enter your new password"
            value={newPassword}
            onChange={handlePasswordChange}
            className="h-12 px-4 pr-10 rounded border border-border-color placeholder:text-gray-400 focus:ring-2 focus:ring-primary/40 focus:outline-none"
            required
          />
          <button
            type="button"
            className="absolute right-3 top-9 text-gray-400 p-1" 
            onClick={() => setShowPass(!showPass)}
          >
            {showPass ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
          <div className="flex justify-between items-center mt-1">
            <div className="h-1 rounded-full bg-gray-200 w-full">
              <div className={`h-1 rounded-full transition-all duration-300 ${getStrengthBarClass()}`} />
            </div>
            {getStrengthText()}
          </div>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-light">Confirm New Password</span>
          <input
            type="password"
            placeholder="Confirm your new password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            className="h-12 px-4 rounded border border-border-color placeholder:text-gray-400 focus:ring-2 focus:ring-primary/40 focus:outline-none"
            required
          />
        </label>

        {error && (
          <p className="text-sm text-red-500 text-center font-medium mt-1">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="h-12 rounded bg-primary text-white text-base font-semibold hover:bg-primary/90 transition mt-4" 
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        <a 
          href="#" 
          className="text-center text-sm text-secondary hover:text-secondary/80 transition"
        >
          Back to LogIn
        </a>
      </form>
    </div>
  );
}

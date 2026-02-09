import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function OwnerloginForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://turfywafaa.runasp.net/Turfy/LoginUserEndpoint/Handle",
        {
          "emailOrPhone": email,   // P Capital
          "password": password,
          "discriminator": 2       // Owner = 2
        }
      );

      console.log("Login Success Data:", response.data);

      // 👇 1. استخراج التوكن الصحيح (المسار: data.data.token)
      const token = response.data.data?.token;

      // 👇 2. التخزين والتوجيه
      if (token) {
        localStorage.setItem("token", token);
        console.log("✅ Token Saved!");
        navigate("/schedule");
      } else {
        console.error("Login succeeded but no token found in:", response.data);
        alert("System Error: Token is missing.");
      }

    } catch (error) {
      console.error("Login failed:", error);
      alert("Invalid Email or Password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col items-stretch rounded-xl bg-white p-6 shadow-lg sm:p-8">
      <div className="flex flex-col gap-2">
        <p className="text-2xl font-bold text-[#1E293B]">Partner Portal Login</p>
        <p className="text-base text-slate-500">Log in to access your dashboard.</p>
      </div>

      <form onSubmit={handleLogin} className="mt-8 flex flex-col gap-6">
        <label className="flex flex-col">
          <p className="text-sm font-medium text-slate-700 pb-2">Email / Mobile</p>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 rounded-lg border border-[#dee0e3] px-4"
            placeholder="Enter email"
          />
        </label>

        <label className="flex flex-col">
          <p className="text-sm font-medium text-slate-700 pb-2">Password</p>
          <div className="flex relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 flex-1 rounded-lg border border-[#dee0e3] px-4 pr-12"
              placeholder="Enter password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="h-12 rounded-lg bg-[#111827] text-white font-semibold hover:bg-[#0f172a] disabled:opacity-70"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>
    </div>
  );
}
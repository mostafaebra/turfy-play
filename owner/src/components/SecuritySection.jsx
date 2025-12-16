import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function SecuritySection({
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
}) {
  const [showPass1, setShowPass1] = useState(false);
  const [showPass2, setShowPass2] = useState(false);

  return (
    <div>
      <h3 className="text-lg font-bold text-dark-navy-blue pb-3">Security</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

        {/* Password */}
        <label className="flex flex-col relative">
          <p className="text-sm text-dark-navy-blue pb-2">Password</p>

          <input
            type={showPass1 ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 px-4 pr-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/50"
          />

          <button
            type="button"
            className="absolute right-3 top-10 text-gray-500"
            onClick={() => setShowPass1(!showPass1)}
          >
            {showPass1 ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </button>
        </label>

        {/* Confirm Password */}
        <label className="flex flex-col relative">
          <p className="text-sm text-dark-navy-blue pb-2">Confirm Password</p>

          <input
            type={showPass2 ? "text" : "password"}
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="h-12 px-4 pr-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/50"
          />

          <button
            type="button"
            className="absolute right-3 top-10 text-gray-500"
            onClick={() => setShowPass2(!showPass2)}
          >
            {showPass2 ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </button>
        </label>

      </div>
    </div>
  );
}
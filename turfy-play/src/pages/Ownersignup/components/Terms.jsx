import React from "react";

export default function Terms() {
  return (
    <div className="flex items-start gap-3">
      <input
        type="checkbox"
        className="h-5 w-5 rounded border-gray-300 text-primary"
      />
      <p className="text-sm text-secondary-text">
        I agree to the{" "}
        <a className="font-medium text-[#22C55E] underline">Partner Terms of Services</a> and{" "}
        <a className="font-medium text-[#22C55E] underline">Privacy Policy</a>.
      </p>
    </div>
  );
}
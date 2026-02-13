import React from "react";

export default function SecuritySection() {
  return (
    <div className="flex flex-col gap-4">
      
      <div className="relative">
        <input
          type="password"
          // value="password"
          placeholder="password"
          readOnly
          className="w-full h-12 px-4 pr-36 rounded-lg border border-gray-200 bg-gray-50
                     text-sm text-gray-800 focus:outline-none"
        />

        <button
          type="button"
          className="absolute right-4 top-1/2 -translate-y-1/2
                     text-blue-500 text-sm font-medium hover:underline"
        >
          Change Password
        </button>
      </div>

    </div>
  );
}

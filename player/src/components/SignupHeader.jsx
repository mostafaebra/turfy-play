import React from "react";

export default function SignupHeader() {
  return (
    <div className="flex flex-col items-center justify-center mb-8 font-display text-center">
      {/* */}
      <div className="flex items-center gap-2 mb-2">
        {/* */}
        <span className="text-xl font-bold text-text-black"> ⚽ Turfy Play</span>
      </div>
      
      {/*    */}
      <h1 className="text-3xl font-extrabold text-text-black mb-2">
        Join the Game!
      </h1>
      
      {/*   */}
      <p className="text-sm font-normal text-light max-w-xs">
        Create an account to book fields and join competitions.
      </p>
  </div>
  );
}
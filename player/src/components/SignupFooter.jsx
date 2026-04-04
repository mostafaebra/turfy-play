import React from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import { Link } from "react-router-dom";
export default function SignupFooter() {
  return (
    <div className="flex flex-col gap-3 font-display mt-4">
      {/* Already have an account? */}
      <p className="text-sm text-center text-light">
        Already have an account?{" "}
        <Link to="/login"
             className="text-secondary font-medium hover:underline"
             >
          Log In
        </Link>
      </p>

      {/* Divider */}
      <div className="flex items-center gap-3 my-2">
        <div className="flex-1 h-px bg-border-color" />
        <span className="text-xs text-light font-normal">Or sign up with</span>
        <div className="flex-1 h-px bg-border-color" />
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
    </div>
  );
}
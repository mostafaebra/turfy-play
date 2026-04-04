import React from "react";
import { Link } from "react-router-dom";
 

export default function LoginFooter() {
  return ( 
    <p className="text-sm text-center text-text-light mt-6 font-display">
      New to Turfy Play?{" "}
      {/* */}
      <Link to="/signup">
      <span className="text-secondary font-medium hover:underline cursor-pointer">
        Create an account
      </span>
      </Link>
    </p>
  );
}
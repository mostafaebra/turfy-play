import { useState } from "react";
import { ownerSignup } from "../../services/api";
import Header from "./components/Header";
import PersonalDetails from "./components/PersonalDetails";
import SecuritySection from "./components/SecuritySection";
import UploadIDSection from "./components/UploadIDSection";
import Terms from "./components/Terms";
 

export default function OwnerSignUp() {
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");

  const [frontCardImage, setFrontCardImage] = useState(null);
  const [backCardImage, setBackCardImage] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const signupData = {
      fullName,
      password,
      confirmPassword,
      phoneNumber,
      email,
      frontCardImage,
      backCardImage,
    };

    try {
      const res = await ownerSignup(signupData);
      console.log("SIGNUP SUCCESS:", res);

      alert("Account created!");
    } catch (err) {
      setError(err.message || "Registration failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
         <Header />

      <h1 className="text-3xl text-center font-black text-dark-navy-blue mb-3">
         List Your Fields for Free.
      </h1>
      <p className="text-[#64748B] mb-6 text-center">
        Join hundreds of Field owners maximizing revenue with Turfy Play.
        Zero commissions, guaranteed bosokings.
      </p>

        {/* form*/}
    <form onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md flex flex-col gap-6">
        

        <PersonalDetails
  fullName={fullName}
  setFullName={setFullName}
  phoneNumber={phoneNumber}
  setPhoneNumber={setPhoneNumber}
  email={email}
  setEmail={setEmail}
/>

<SecuritySection
  password={password}
  setPassword={setPassword}
  confirmPassword={confirmPassword}
  setConfirmPassword={setConfirmPassword}
/>

<UploadIDSection
  frontCardImage={frontCardImage}
  setFrontCardImage={setFrontCardImage}
  backCardImage={backCardImage}
  setBackCardImage={setBackCardImage}
/>


<Terms />

 {/* Submit Button */}
      <button type="submit" className="h-12 bg-black text-white rounded-lg hover:bg-gray-800">
        {loading ? "Loading..." : "Create Partner Account"}
      </button>

      {/* Error */}
      {error && <p className="text-red-500">{error}</p>}
    </form>
  </div>
  );
}
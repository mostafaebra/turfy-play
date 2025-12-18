import React from "react";
import SuccessMessage from "../../components/SuccessMessage"; 

export default function ResetSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-light-gray px-4 font-display relative">
         
         {/*   */}
         <div 
           
           className="absolute top-0 left-0 w-full max-w-md p-5"
         >
           <div className="flex justify-start"> {/* للتأكد من المحاذاة اليسرى */}
               <span className="text-xl font-semibold font-[sans-serif] text-dark"> ⚽ Turfy Play</span>
           </div>
         </div>
         
         {/*  */}
         {/*   */}
         <div className="w-full max-w-md bg-white rounded-xl  p-8">
           <SuccessMessage/>
         </div>
       </div>
  );
}
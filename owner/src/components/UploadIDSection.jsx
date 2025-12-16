import React from "react";
import { FiUploadCloud } from "react-icons/fi";      

export default function UploadSection({
  frontCardImage,
  setFrontCardImage,
  backCardImage,
  setBackCardImage,
}) {
    
     
    const CardUploadBox = ({ title, setImage, currentImage }) => (
        <label className="flex flex-col">
            <p className="text-sm font-semibold text-gray-800 pb-2">{title}</p>
            
            {/* Box Design -  */}
            <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-center p-4 cursor-pointer hover:border-blue-500 transition duration-300">
                
                {/*     */}
                <FiUploadCloud className="text-blue-500 w-8 h-8 mb-2" /> 
                
                {/*    */}
                <p className="text-sm font-medium text-gray-700">
                    Click to upload or drag and drop
                </p>
                
                {/*       */}
                <p className="text-xs text-gray-500 mt-1">
                    JPG, PNG, PDF (MAX. 5MB)
                </p>
                
                {/*   */}
                {currentImage && (
                    <p className="text-xs text-green-600 mt-1 truncate max-w-full">
                        {currentImage.name}
                    </p>
                )}

                {/*   */}
                <input
                    type="file"
                    accept="image/jpeg,image/png,application/pdf"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="sr-only"      
                />
            </div>
        </label>
    );

    return (
        <div className="pt-6">
            <h3 className="text-xl font-semibold text-gray-800 pb-2">
                Verify Your Identity
            </h3>
            <p className="text-sm text-gray-600 pb-6">
                Please upload clear photos of your National ID. This is required for payout processing.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* National ID (Front) */}
                <CardUploadBox
                    title="National ID (Front)"
                    setImage={setFrontCardImage}
                    currentImage={frontCardImage}
                />

                {/* National ID (Back) */}
                <CardUploadBox
                    title="National ID (Back)"
                    setImage={setBackCardImage}
                    currentImage={backCardImage}
                />
                
            </div>
        </div>
    );
}
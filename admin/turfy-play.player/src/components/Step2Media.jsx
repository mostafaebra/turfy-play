import React, { useRef } from "react";

import {
  FiCamera,
  FiTrash2,
  FiHelpCircle,
  FiFileText,
  FiCheckCircle,
  FiUploadCloud,
} from "react-icons/fi";

const Step2Media = ({ formData, setFormData, errors , setErrors }) => {
  // hidden input to upload images 
  const fileInputRef = useRef(null);
  const handleBoxClick = () => {
    fileInputRef.current.click();
  };

  // function handle uploade image
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      //console.log(files);
      const newImages = files.map((file) => ({
        file: file,
        preview: URL.createObjectURL(file),
      }));

      // update data
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }));

      //remve error when a user upload image
      if (errors.images) {
        setErrors(prev => ({ ...prev, images: null }));
      }
    }
  };

  // hidden input file contract
  const contractInputRef = useRef(null);
  const handleContractUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      setFormData((prev) => ({ ...prev, contract: file }));
    }


    //remve error when a user upload contract
    if (errors.contract) {
        setErrors(prev => ({ ...prev, contract: null }));
    }
  };

  // remove file if he want upload another file
  const removeContract = () => {
    setFormData((prev) => ({ ...prev, contract: null }));

    if (contractInputRef.current) contractInputRef.current.value = "";
  };

  return (
    <div className="space-y-6">
      {/* step number */}
      <div className="border-b border-border-color pb-4 mb-6">
        <h2 className="text-text-dark font-medium md:font-bold text-xl">
          Step 2: Media & Verification
        </h2>
      </div>

      {/* upload Images */}
      <div>
        <div>
          <h2 className="text-text-dark font-medium md:font-bold text-xl">
            Field Photos (Multiple)
          </h2>
          <p className="text-text-light mb-3 text-xs md:text-xl">
            Upload high-quality images of your field. Players love to see where
            they'll be playing!
          </p>
        </div>

        <input
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageUpload}
        />

        <div
          onClick={handleBoxClick}
          className={`
              border-2 border-dashed w-full h-32 md:h-64 rounded-xl
              flex flex-col justify-center items-center cursor-pointer transition
              ${errors.images 
                  ? "border-red-500 bg-red-50" // لو فيه غلط: أحمر
                  : "border-gray-300 hover:bg-gray-100 hover:border-primary" // العادي: رمادي
              }`}
        >
          <FiCamera className={`text-lg mb-2 size-10 md:size-16 ${errors.images ? "text-red-400" : "text-gray-400"}`} />
          
          <p className={`font-normal md:font-medium ${errors.images ? "text-red-600" : "text-text-dark"}`}>
              {errors.images ? errors.images : "Drag & Drop Images Here"}
          </p>

          {!errors.images && (
              <p className="text-sm text-text-dark">
                  or <span className="text-primary text-sm">Click to Upload</span>
              </p>
          )}
          
        </div>
        {errors.images && (
          <p className="text-xs text-red-500 mt-2 font-medium">
              * {errors.images}
          </p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {/* IF No Images */}
          {formData.images.length === 0 && (
            <>
              <div className="aspect-square rounded-xl bg-gray-50 border-2 border-dashed border-gray-200"></div>
              <div className="aspect-square rounded-xl bg-gray-50 border-2 border-dashed border-gray-200"></div>
              <div className="aspect-square rounded-xl bg-gray-50 border-2 border-dashed border-gray-200"></div>
            </>
          )}

          {/* Show Images */}
          {formData.images.map((img, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-xl overflow-hidden border border-border-color shadow-sm group"
            >
              <img
                src={img.preview}
                alt="preview"
                className="w-full h-full object-cover"
              />

              {/* delet photo rfom array */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  const updatedImages = formData.images.filter(
                    (_, i) => i !== index
                  );
                  setFormData({ ...formData, images: updatedImages });
                }}
                className="absolute top-2 right-2 z-10
                            p-2 rounded-full shadow-md bg-white text-red-500
                           hover:bg-red-500 hover:text-white
                           transition-all duration-200 ease-in-out
                           opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
              >
                <FiTrash2 size={16} />
              </button>
              {/* cover for the first photo */}
              {index === 0 && (
                <span className="absolute bottom-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-lg font-medium">
                  Cover
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* upload Ownership Proof / Contract */}
      <div className="mt-8 border-t border-gray-100 pt-8">
        <div>
          <div className="flext justify-between">
            <h2 className="text-text-dark font-medium md:font-bold text-xl">
              Ownership Proof / Contract
            </h2>
            {/* <button className="hover:text-emerald-400 transition-colors duration-200">
                      <FiHelpCircle size={14} />
            </button> */}
          </div>
          <p className="text-text-light mb-3 text-xs md:text-xl">
            Please upload a clear copy of your field's rental contract or
            ownership deed. This is required for verification purposes only and
            will not be shown to the public.
          </p>

          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            ref={contractInputRef}
            onChange={handleContractUpload}
          />

          {/* if no file upload */}
          {!formData.contract && (
            <div
              onClick={() => contractInputRef.current.click()}
              className={`
                    border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition
                    ${errors.contract 
                        ? "border-red-500 bg-red-50" 
                        : "border-gray-300 hover:bg-gray-50 hover:border-primary"
                    }`}             
            >

              <FiUploadCloud className={`text-2xl ${errors.contract ? "text-red-500" : "text-gray-400"}`} />
              <span className={`font-medium text-sm ${errors.contract ? "text-red-600" : "text-primary"}`}>
                {errors.contract ? errors.contract : "Upload Contract"}
              </span>

              <p className="text-xs text-text-light">
                Supported: PDF, JPG, PNG (Max 5MB)
              </p>
            </div>
          )}

          {/* files Uploaded */}
          {formData.contract && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg p-4 gap-3">
              <div className="flex items-center gap-3 w-full">
                <div className="bg-white p-2 rounded-full shadow-sm shrink-0">
                  <FiCheckCircle className="text-emerald-500 text-xl" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-emerald-800 font-medium text-sm truncate">
                    {formData.contract.name}
                  </p>
                  <p className="text-emerald-600 text-xs">Upload successful</p>
                </div>
              </div>

              {/* delete file */}
              <button
                type="button"
                onClick={removeContract}
                className="text-red-500 text-sm font-medium hover:underline hover:text-red-600 self-end sm:self-auto"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Step2Media;

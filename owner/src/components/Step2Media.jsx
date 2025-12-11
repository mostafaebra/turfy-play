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
  // const handleContractUpload = (e) => {
  //   const file = e.target.files[0];

  //   if (file) {
  //     setFormData((prev) => ({ ...prev, contract: file }));
  //   }


  //   //remve error when a user upload contract
  //   if (errors.contract) {
  //       setErrors(prev => ({ ...prev, contract: null }));
  //   }
  // };

  // remove file if he want upload another file
  // const removeContract = () => {
  //   setFormData((prev) => ({ ...prev, contract: null }));

  //   if (contractInputRef.current) contractInputRef.current.value = "";
  // };

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

      {/*  Contract Section (Multiple Images) */}
      <div className="pt-6 border-t border-gray-100">
        <h3 className="text-text-dark font-bold text-lg mb-1 flex items-center gap-2">
            Ownership Proof
            <span className="text-gray-400 text-xs font-normal border border-gray-200 px-1.5 py-0.5 rounded-full">Images Only</span>
        </h3>
        <p className="text-text-light text-sm mb-4">Upload contract or ownership deed pages.</p>

        {/* upload only images */}
        <input 
            type="file" 
            multiple 
            accept="image/*" 
            className="hidden"
            ref={contractInputRef} 
            onChange={(e) => {
                const files = Array.from(e.target.files);
                if (files.length > 0) {
                    setFormData(prev => ({ 
                        ...prev, 
                        contract: [...prev.contract, ...files] 
                    }));
                    
                    if (errors.contract) setErrors(prev => ({ ...prev, contract: null }));
                }
            }}
        />

        {/* upload button */}
        <div 
            onClick={() => contractInputRef.current.click()}
            className={`
                border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition mb-4
                ${errors.contract 
                    ? "border-red-500 bg-red-50" 
                    : "border-gray-300 hover:bg-gray-50 hover:border-primary"
                }
            `}
        >
            <div className="flex items-center gap-2 text-text-light group-hover:text-primary">
                <FiUploadCloud className={`text-xl ${errors.contract ? "text-red-500" : ""}`} />
                <span className={`font-medium text-sm ${errors.contract ? "text-red-600" : ""}`}>
                    {errors.contract ? errors.contract : "Click to upload Contract Images"}
                </span>
            </div>
        </div>

        {/* Show files */}
        {formData.contract.length > 0 && (
            <div className="flex flex-col gap-2">
                {formData.contract.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                        
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="bg-white p-1.5 rounded-full shadow-sm shrink-0">
                                <FiCheckCircle className="text-emerald-500 text-lg" />
                            </div>
                            <span className="text-emerald-900 text-sm font-medium truncate">
                                {file.name}
                            </span>
                        </div>

                        {/* delete button */}
                        <button 
                            type="button"
                            onClick={() => {
                                
                                const newContracts = formData.contract.filter((_, i) => i !== index);
                                setFormData(prev => ({ ...prev, contract: newContracts }));
                            }}
                            className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition"
                        >
                            <FiTrash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>
        )}

      </div>
    </div>
  );
};
export default Step2Media;

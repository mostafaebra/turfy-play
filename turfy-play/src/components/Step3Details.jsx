import React from "react";

import { FiSun, FiDisc, FiMonitor, FiWifi, FiUnlock, FiCoffee } from "react-icons/fi"; // أيقونات مقترحة
import { MdOutlineShower, MdDirectionsCar } from "react-icons/md";

const amenitiesList = [
    { id: "lighting", label: "Professional Lighting", icon: <FiSun size={20} /> },
    { id: "showers",  label: "Showers",               icon: <MdOutlineShower size={20} /> },
    { id: "parking",  label: "Secure Parking",        icon: <MdDirectionsCar size={20} /> },
    { id: "balls",    label: "Ball Rental",           icon: <FiDisc size={20} /> },
    { id: "wifi",     label: "Free WiFi",             icon: <FiWifi size={20} /> },
    { id: "seating",  label: "Spectator Seating",     icon: <FiMonitor size={20} /> }, // أو أي أيقونة مناسبة
    { id: "lockers",  label: "Lockers / Changing",    icon: <FiUnlock size={20} /> },
    { id: "cafe",     label: "Cafeteria",             icon: <FiCoffee size={20} /> },
  ];



const Step3Details = ({ formData, setFormData, handleChange }) => {

    const toggleAmenity = (id) => {
        setFormData((prev) => {
        const currentAmenities = prev.amenities || []; 
        
        
        if (currentAmenities.includes(id)) {
            return { ...prev, amenities: currentAmenities.filter((item) => item !== id) };
        } else {
            return { ...prev, amenities: [...currentAmenities, id] };
        }
        });
    };

  // List of options for the dropdown
  const surfaceTypes = [
    "Natural Grass",
    "Artificial Turf (3G/4G)",
    "Clay Court",
    "Hard Court",
    "Acrylic",
    "Sand",
  ];

  return (
    <div className="space-y-8">

      {/* --- 1. Main Header --- */}
      <div className="border-b border-border-color pb-4 mb-6">
        <h2 className="text-text-dark font-bold text-xl">
          Step 3: Specs & Amenities
        </h2>
      </div>

      {/* --- 2. Field Condition Section --- */}
      <div>
        {/* Section Title */}
        <h3 className="text-text-dark font-bold text-lg mb-4">
           Field Condition & Dimensions
        </h3>

        {/* Grid Container: 1 column on mobile, 2 columns on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* A. Surface Type Dropdown */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-dark">
              Surface Type
            </label>

            <div className="relative">
              {/* The Select Element */}
              <select
                name="surfaceType"
                value={formData.surfaceType}
                onChange={handleChange}
                className="w-full p-3 border border-border-color rounded-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-dark-navy bg-white appearance-none cursor-pointer"
              >
                {surfaceTypes.map((type, index) => (
                  <option key={index} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              {/* Custom Arrow Icon (Decoration) */}
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Field Size Input */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-dark">
              Field Size / Format <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              name="fieldSize"
              value={formData.fieldSize}
              onChange={handleChange}
              placeholder="e.g., 5-a-side, 7-a-side, 40x20m"
              className="w-full p-3 border border-border-color rounded-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-dark-navy placeholder:text-gray-400"
            />
          </div>

        </div>
       
      <div className="border-t border-gray-100 my-6"></div>

      // Amenities 
      <div>
        <h3 className="text-text-dark font-bold text-lg mb-4">
            Amenities
        </h3>
        <p className="text-text-light text-sm mb-4">Select all available facilities and services at your venue.</p>

        {/* Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {amenitiesList.map((item) => {
                

                const isSelected = formData.amenities?.includes(item.id);

                return (
                    <div 
                        key={item.id}
                        onClick={() => toggleAmenity(item.id)}
                        className={`
                            cursor-pointer flex flex-col items-center justify-center gap-3 p-4 rounded-xl border transition-all duration-200 text-center h-32
                            ${isSelected 
                                ? "border-primary bg-primary/5 text-primary shadow-sm" 
                                : "border-border-color text-text-light hover:border-primary/50 hover:bg-gray-50" 
                            }
                        `}
                    >
                        <div className={`p-2 rounded-full ${isSelected ? "bg-white" : "bg-gray-100"}`}>
                            {item.icon}
                        </div>
                        <span className="font-medium text-sm">{item.label}</span>
                    </div>
                );
            })}
        </div>
      </div>


      </div>
    </div>
  );
};

export default Step3Details;
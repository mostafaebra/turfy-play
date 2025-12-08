import React from "react";

import { IoIosFootball, IoIosTennisball } from "react-icons/io";
import { MdSportsTennis } from "react-icons/md";
import { FiLink } from "react-icons/fi";
import { MdLocationOn } from "react-icons/md";

const Step1Info = ({
  formData,
  setFormData,
  handleChange,
  handleManualChange,
  errors,
}) => {
  const sports = [
    { id: "football", name: "Football", icon: <IoIosFootball size={30} /> },
    { id: "padel", name: "Padel", icon: <MdSportsTennis size={30} /> },
    { id: "tennis", name: "Tennis", icon: <IoIosTennisball size={30} /> },
  ];

  // handle Location by GPS
  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        // update x , y
        setFormData((prev) => ({
          ...prev,
          coords: { x: lng, y: lat },
          mapLink: `https://maps.google.com/?q=${lat},${lng}`,
        }));
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-border-color pb-4 mb-6">
        <h2 className="text-xl font-bold text-dark-navy">
          Step 1: Basic Information & Location
        </h2>
      </div>

      <div>
        <p className="text-text-light mb-1">Field Name</p>
        <input
          type="text"
          name="fieldName"
          value={formData.fieldName}
          onChange={handleChange}
          placeholder="e.g., Sunrise Football Court"
          className={`w-full p-3 border rounded-lg outline-none transition-all
                    ${
                      errors.fieldName
                        ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                        : "border-border-color focus:border-primary focus:ring-1 focus:ring-primary"
                    }`}
        />
        {/* if the user not write in field name */}
        {errors.fieldName && (
          <span className="text-xs text-red-500 font-medium">
            {errors.fieldName}
          </span>
        )}
      </div>

      {/* select sport by map method */}
      <div className="flex flex-col gap-2">
        <label
          className={`text-sm font-medium ${
            errors.sport ? "text-red-500" : "text-text-dark"
          }`}
        >
          Sport Type
        </label>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sports.map((sport) => (
            <div
              key={sport.id}
              onClick={() => handleManualChange("sport", sport.id)}
              className={`cursor-pointer flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 transition-all duration-200
                            ${
                              formData.sport === sport.id
                                ? "border-primary bg-primary/5 text-primary"
                                : "border-border-color text-text-light hover:border-primary/50"
                            }`}
            >
              {sport.icon}
              <span className="font-bold">{sport.name}</span>
            </div>
          ))}
        </div>
        {errors.sport && (
          <span className="text-xs text-red-500 font-medium">
            {errors.sport}
          </span>
        )}
      </div>

      {/* <div className="flex flex-col gap-2">
                <label className="text-text-light mb-1">Sport Type</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div onClick={() => {
                        setFormData(prev => ({ ...prev, sport: "football" }))
                    }}
                     className="cursor-pointer flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 transition-all border-primary bg-primary/10 text-primary">
                        <IoIosFootball size={30} />
                        <span className="font-bold">Football</span>
                    </div>
                    <div onClick={() => {
                        setFormData(prev => ({ ...prev, sport: "padel" }))
                    }}
                        className="cursor-pointer flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 transition-all border-border-color text-text-light hover:border-primary/50">
                        <MdSportsTennis size={30} />
                        <span className="font-bold">Padel</span>
                    </div>
                    <div onClick={() => {
                        setFormData(prev => ({ ...prev, sport: "tennis" }))
                    }}
                     className="cursor-pointer flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 transition-all border-border-color text-text-light hover:border-primary/50">
                        <IoIosTennisball size={30} />
                        <span className="font-bold">Tennis</span>
                    </div>
                </div>
            </div> */}

      <div>
        <p className="text-text-light mb-1">Address</p>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="ُEnter the full Address in the field"
          className={`w-full p-3 border rounded-lg outline-none transition-all
                    ${
                      errors.fieldName
                        ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                        : "border-border-color focus:border-primary focus:ring-1 focus:ring-primary"
                    }`}
        />
        {/* if the user not write in field name */}
        {errors.address && (
          <span className="text-xs text-red-500 font-medium">
            {errors.address}
          </span>
        )}
      </div>

      <div className="mt-8"></div>

      {/* --- (Google Maps Link) --- */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-text-dark">
          Field Location <span className="text-red-500">*</span>
        </label>

        <div className="relative group">
          <div
            onClick={handleDetectLocation}
            className="absolute inset-y-0 left-0 pl-2 flex items-center z-10 cursor-pointer"
            title="Click to detect location"
          >
            <div
              className={`
                p-2 rounded-lg transition-all duration-200 flex items-center justify-center
                ${
                  formData.coords.x
                    ? "bg-primary text-white shadow-md" // لو نجح: خلفية خضراء وأيقونة بيضاء
                    : "bg-gray-100 text-gray-500 group-hover:bg-primary group-hover:text-white" // العادي: رمادي ولما تقف عليه يخضر
                }`}
            >
              <MdLocationOn size={18} />
            </div>
          </div>

          {/* display only */}
          <input
            type="text"
            readOnly
            onClick={handleDetectLocation}
            value={formData.coords.x ? "Location Detected Successfully" : ""}
            placeholder="Tap to detect GPS location"
            className={`w-full p-3 pl-14 border rounded-lg outline-none cursor-pointer font-medium text-sm transition-all
                ${
                  formData.coords.x
                    ? "bg-green-50 text-green-700 border-green-500"
                    : "bg-white text-dark-navy border-border-color focus:border-primary group-hover:border-primary"
                }
                ${errors.mapLink ? "border-red-500 bg-red-50 text-red-700" : ""}
            `}
          />
        </div>

        {errors.mapLink && (
          <span className="text-xs text-red-500 font-medium">
            Location is required. Tap the icon to detect.
          </span>
        )}
      </div>
    </div>
  );
};
export default Step1Info;

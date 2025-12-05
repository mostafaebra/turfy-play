import React, { useState } from "react";

import { IoIosFootball, IoIosTennisball } from "react-icons/io";
import { MdSportsTennis } from "react-icons/md";
import { FiLink } from "react-icons/fi";
import { MdLocationOn } from "react-icons/md";

const Step1Info = ({ formData, handleChange, setFormData }) => {
  const sports = [
    { id: "football", name: "Football", icon: <IoIosFootball size={30} /> },
    { id: "padel", name: "Padel", icon: <MdSportsTennis size={30} /> },
    { id: "tennis", name: "Tennis", icon: <IoIosTennisball size={30} /> },
  ];

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
          className="w-full p-3 border border-border-color rounded-lg outline-none transition-all
                     focus:border-primary focus:ring-1 focus:ring-primary
                     placeholder:text-gray-400 text-dark-navy"
        />
      </div>

      {/* select sport by map method */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-text-dark">Sport Type</label>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sports.map((sport) => (
            <div
              key={sport.id}
              onClick={() => setFormData({ ...formData, sport: sport.id })}
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
          className="w-full p-3 border border-border-color rounded-lg outline-none transition-all
                      focus:border-primary focus:ring-1 focus:ring-primary
                      placeholder:text-gray-400 text-dark-navy"
        />
      </div>

      <div className="mt-8"></div>

      {/* --- (Google Maps Link) --- */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-text-dark">
          Google Maps Location
        </label>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiLink className="text-gray-400 text-lg" />
          </div>

          <input
            type="url"
            name="mapLink"
            value={formData.mapLink}
            onChange={handleChange}
            placeholder="Paste field location link here (e.g. https://maps.app.goo.gl/...)"
            className="w-full pl-10 p-3 border border-border-color rounded-lg outline-none 
                       focus:border-primary focus:ring-1 focus:ring-primary transition-all 
                       text-dark-navy placeholder:text-gray-400"
          />
        </div>

        <p className="text-xs text-text-light flex items-center gap-1">
          <MdLocationOn className="text-primary" />
          Go to Google Maps, copy the location link, and paste it here.
        </p>
      </div>
    </div>
  );
};
export default Step1Info;

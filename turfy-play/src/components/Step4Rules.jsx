import React from "react";

const Step4Rules = ({ formData, setFormData, handleChange }) => {
    return (
        <div className="space-y-8">
            {/* --- 1. Main Header --- */}
            <div className="border-b border-border-color pb-4 mb-6">
                <h2 className="text-text-dark font-bold text-xl">
                    Step 4: Pricing & Schedule
                </h2>
            </div>

            <div>
                <div>
                    <h2 className="text-text-dark font-medium md:font-bold text-xl">
                        Hourly Pricing
                    </h2>
                    <p className="text-text-light mb-3 text-xs md:text-xl">
                        Set the standard rate for one hour of field rental.
                    </p>

                    {/* Hour Pricing */}
                    <div className="flex flex-col gap-2 pt-3">
                        <label className="text-xl font-medium text-text-dark">
                            Base Rate Per Hour
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                name="pricePerHour"
                                value={formData.pricePerHour}
                                onChange={handleChange}
                                placeholder="250"
                                className="w-full p-3 pr-12 border border-border-color rounded-lg outline-none focus:border-primary
                 focus:ring-1 focus:ring-primary transition-all text-dark-navy placeholder:text-gray-400"
                            />

                            <span className="absolute right-4 top-3.5 text-text-light font-medium text-sm">
                                EGP
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-100 my-6"></div>

            <div>
                <h2 className="text-text-dark font-medium md:font-bold text-xl mb-2">
                    Operating Hours
                </h2>
                <p className="text-text-light mb-3 text-xs md:text-xl">
                    Define when your field is available for booking.
                </p>

                <div className="flex items-center gap-3 mb-6">
                    <button
                        type="button"
                        onClick={() =>
                            setFormData({ ...formData, open24: !formData.open24 })
                        }
                        className={`w-12 h-6 rounded-full p-1 transition-all duration-300 flex items-center
                        ${formData.open24 ? "bg-primary" : "bg-gray-300"}`}
                    >
                        <div
                            className={` w-4 h-4 bg-white rounded-full shadow-md transform transition-transform 
                            duration-300 ${formData.open24 ? "translate-x-6" : "translate-x-0"
                                }`}
                        />
                    </button>
                    <span className="text-text-dark font-medium text-xl">
                        Open 24 Hours?
                    </span>
                </div>

                {/* Opening Time */}
                <div
                    className={`grid grid-cols-2 gap-4 transition-all duration-300 
                        ${formData.open24
                            ? "opacity-50 pointer-events-none"
                            : "opacity-100"
                        }`}
                >
                    <div className="flex flex-col gap-2">
                        <label className="text-xl font-medium text-text-dark">
                            Open From
                        </label>
                        <input
                            type="time"
                            name="openTime"
                            value={formData.openTime}
                            onChange={handleChange}
                            disabled={formData.open24}
                            className="w-full p-3 border border-border-color rounded-lg outline-none focus:border-primary transition-all text-dark-navy cursor-pointer disabled:bg-gray-100"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xl font-medium text-text-dark">
                            Open Until
                        </label>
                        <input
                            type="time"
                            name="closeTime"
                            value={formData.closeTime}
                            onChange={handleChange}
                            disabled={formData.open24}
                            className="w-full p-3 border border-border-color rounded-lg outline-none focus:border-primary transition-all text-dark-navy cursor-pointer disabled:bg-gray-100"
                        />
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-100 my-6"></div>

            {/* Booking Policy */}
            <div>
                <h3 className="text-text-dark font-bold text-lg mb-4">Booking Policy</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-text-dark">Advance Booking Window</label>
                        <div className="relative">
                            <select
                                name="bookingWindow"
                                value={formData.bookingWindow}
                                onChange={handleChange}
                                className="w-full p-3 border border-border-color rounded-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-dark-navy bg-white appearance-none cursor-pointer"
                            >
                                <option value="">Select window...</option>
                                <option value="7_days">Up to 7 days in advance</option>
                                <option value="14_days">Up to 14 days in advance</option>
                                <option value="30_days">Up to 30 days in advance</option>
                            </select>
                            {/* السهم المخصص */}
                            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                            </div>
                        </div>
                    </div>

                    {/*  Cancellation Policy */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-text-dark">Cancellation Policy</label>
                        <div className="relative">
                            <select
                                name="cancelPolicy"
                                value={formData.cancelPolicy}
                                onChange={handleChange}
                                className="w-full p-3 border border-border-color rounded-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-dark-navy bg-white appearance-none cursor-pointer"
                            >
                                <option value="">Select policy...</option>
                                <option value="free_24h">Free refund if cancelled 24h prior</option>
                                <option value="free_48h">Free refund if cancelled 48h prior</option>
                                <option value="non_refundable">Non-refundable</option>
                            </select>
                            {/* Arrow */}
                            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};
export default Step4Rules;

import React from "react";

const IssueCategorySelector = ({ selectedCategory, onSelect, error }) => {
  const categories = [
    "Field Condition",
    "Staff Behavior",
    "Safety Concern",
    "Booking Issue",
    "Other",
  ];

  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-gray-900 mb-4">
        Issue Category <span className="text-red-500">*</span>
        {error && (
          <span className="text-red-500 text-sm font-normal ml-2 animate-pulse">
            Please select a category
          </span>
        )}
      </h3>
      <div
        className={`flex flex-wrap gap-3 p-2 rounded-2xl transition-colors ${
          error ? "bg-red-50 border border-red-200" : ""
        }`}
      >
        {categories.map((item) => (
          <button
            key={item}
            onClick={() => onSelect(item)}
            className={`
              px-6 py-3 rounded-xl text-sm font-medium transition-all border
              ${
                selectedCategory === item
                  ? "bg-green-50 border-green-500 text-green-700 shadow-sm"
                  : error
                  ? "bg-white border-red-300 text-red-500 hover:bg-red-50"
                  : "bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
              }
            `}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

export default IssueCategorySelector;
import React from 'react';

const VenueSkeleton = () => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden flex flex-col h-full animate-pulse">
      {/* Image Placeholder */}
      <div className="h-48 bg-gray-200 w-full relative">
        <div className="absolute top-3 right-3 h-6 w-16 bg-gray-300 rounded-md"></div>
      </div>
      
      {/* Content Placeholder */}
      <div className="p-4 flex flex-col flex-grow space-y-3">
        <div className="flex justify-between items-start">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-5 bg-gray-200 rounded w-12"></div>
        </div>
        
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        
        <div className="mt-auto pt-3 border-t border-gray-50 flex justify-between items-center">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="h-9 bg-gray-300 rounded w-20"></div>
        </div>
      </div>
    </div>
  );
};

export default VenueSkeleton;
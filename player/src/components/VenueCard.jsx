import React from 'react';
import { Star, MapPin } from 'lucide-react';

const VenueCard = ({ venue }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group">
      {/* Image Area */}
      <div className="relative h-32 md:h-48 overflow-hidden rounded-t-2xl">
        <img 
            src={venue.image} 
            alt={venue.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Rating Badge - Top Left Corner */}
        <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-md text-xs md:text-sm font-bold text-slate-700 shadow-sm border border-gray-100/50">
            <Star size={12} className="md:w-[14px] md:h-[14px] text-yellow-400 fill-yellow-400" /> 
            <span className="text-xs md:text-sm">{venue.rating}</span>
        </div>
        {/* Sport Type Badge - Top Right Corner */}
        {venue.sportType && (
          <span className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] md:text-xs font-bold text-emerald-600 shadow-sm border border-emerald-100/50">
              {venue.sportType}
          </span>
        )}
      </div>
      
      {/* Card Body */}
      <div className="p-3 md:p-4 flex flex-col flex-grow">
        <div className="mb-1">
            <h3 className="font-bold text-sm md:text-lg text-slate-800 leading-tight">{venue.name}</h3>
        </div>
        
        <p className="text-gray-500 text-xs md:text-sm mb-3 md:mb-4 flex items-center gap-1">
            <MapPin size={12} className="md:w-[14px] md:h-[14px]" />
            {venue.location || 'none'}
            {venue.distance && venue.distance !== null && ` • ${venue.distance} mi`}
        </p>
        
        {/* Footer */}
        <div className="mt-auto flex justify-between items-center pt-2 md:pt-3 border-t border-gray-50">
            <span className="text-slate-900 font-extrabold text-sm md:text-lg">
                ${venue.price} 
                <span className="text-gray-400 font-normal text-[9px] md:text-xs ml-1">/hr</span>
            </span>
            <button className="bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg text-xs md:text-base font-bold transition-all shadow-emerald-200 shadow-md">
                Book
            </button>
        </div>
      </div>
    </div>
  );
};

export default VenueCard;
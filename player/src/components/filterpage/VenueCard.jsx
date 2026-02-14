import React from 'react';
import { Star, MapPin, Navigation } from 'lucide-react';
import { Link } from 'react-router-dom';

const VenueCard = ({ venue, viewMode }) => {
  const hasDistance = venue.distance && venue.distance !== 'null' && venue.distance !== null;
  const isList = viewMode === 'List';

  return (
    <div className={`
        bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex group h-full
        ${isList ? 'flex-col md:flex-row' : 'flex-col'} 
    `}>
      
      {/* --- Image Area --- */}
      <div className={`
          relative overflow-hidden shrink-0
          ${isList ? 'h-48 md:h-auto md:w-1/3 md:rounded-l-2xl md:rounded-tr-none' : 'h-32 md:h-48 w-full rounded-t-2xl'}
      `}>
        <img 
            src={venue.image} 
            alt={venue.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Rating Badge */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-md text-xs md:text-sm font-bold text-slate-700 shadow-sm border border-gray-100/50">
            <Star size={12} className="md:w-[14px] md:h-[14px] text-yellow-400 fill-yellow-400" /> 
            <span className="text-xs md:text-sm">{venue.rating}</span>
        </div>
        
        {/* --- FIX: Z-INDEX added to Sport Type Badge --- */}
        {venue.sportType && (
          <span className="absolute top-3 right-3 z-10 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] md:text-xs font-bold text-emerald-600 shadow-sm border border-emerald-100/50">
              {venue.sportType}
          </span>
        )}
      </div>
      
      {/* --- Card Body --- */}
      <div className={`
          p-3 md:p-4 flex flex-col flex-grow
          ${isList ? 'justify-between' : ''}
      `}>
        <div className="mb-1">
            <h3 className="font-bold text-sm md:text-lg text-slate-800 leading-tight">{venue.name}</h3>
        </div>
        
        {/* Location */}
        <p className="text-gray-500 text-xs md:text-sm mb-2 flex items-center gap-1">
            <MapPin size={12} className="md:w-[14px] md:h-[14px] shrink-0" />
            <span className="truncate">{venue.location || 'Unknown Location'}</span>
        </p>

        {/* Distance */}
        {hasDistance ? (
           <div className="mb-3 flex items-center gap-1.5">
              <div className="p-1 rounded-full bg-blue-50 text-blue-500">
                <Navigation size={10} className="md:w-3 md:h-3" />
              </div>
              <span className="text-xs font-semibold text-blue-600">
                {venue.distance} km away
              </span>
           </div>
        ) : (
           !isList && <div className="mb-3 h-5"></div> 
        )}
        
        {/* Footer */}
        <div className={`
            flex justify-between items-center pt-3 border-t border-gray-50
            ${isList ? 'mt-0' : 'mt-auto'}
        `}>
            <span className="text-slate-900 font-extrabold text-sm md:text-lg">
                ${venue.price} 
                <span className="text-gray-400 font-normal text-[9px] md:text-xs ml-1">/hr</span>
            </span>
            <Link to={`/booking/${venue.id}`} className="bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg text-xs md:text-base font-bold transition-all shadow-emerald-200 shadow-md">
                Book
            </Link>
        </div>
      </div>
    </div>
  );
};

export default VenueCard;
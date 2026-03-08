import React from 'react';
import { MapPin, Star, ShieldCheck, X } from 'lucide-react';

const VenuePreviewCard = ({ venue, onRemove }) => {
  if (!venue) return null;

  const handleRemove = () => {
    if (onRemove && venue.id) {
      onRemove(venue.id);
    }
  };

  return (
    <div className="relative bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col md:flex-row shadow-sm hover:shadow-md transition-shadow">
        {/* Remove Button - X in top right corner */}
        {onRemove && (
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transition-all scale-110 opacity-100 pointer-events-auto"
            aria-label="Remove field"
          >
            <X size={16} />
          </button>
        )}
        
        {/* Image */}
        <div 
            className="max-w-full md:w-1/3 h-40 md:h-auto bg-cover bg-center" 
            style={{ backgroundImage: `url(${venue.image})` }}
        ></div>
        
        {/* Details */}
        <div className="p-4 flex flex-col flex-1">
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-bold text-lg text-slate-900">{venue.name}</h4>
                    <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                        <MapPin size={14} />
                        {venue.location}
                    </p>
                </div>
                {venue.verified && (
                    <div className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                        <ShieldCheck size={12} /> Verified
                    </div>
                )}
            </div>
            
            <div className="mt-auto pt-4 flex gap-4 border-t border-slate-100">
                <div className="flex flex-col">
                    <span className="text-xs text-slate-400 uppercase font-bold">Rating</span>
                    <span className="font-bold text-slate-700 flex items-center gap-1">
                        {venue.rating} <Star size={12} className="text-yellow-400 fill-yellow-400"/>
                    </span>
                </div>
                <div className="flex flex-col">
                    <span className="text-xs text-slate-400 uppercase font-bold">Surface</span>
                    <span className="font-bold text-slate-700">{venue.surface}</span>
                </div>
            </div>
        </div>
    </div>
  );
};

export default VenuePreviewCard;
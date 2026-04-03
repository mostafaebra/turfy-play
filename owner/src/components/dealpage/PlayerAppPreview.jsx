// src/components/dealpage/PlayerAppPreview.jsx
import React from 'react';

const PlayerAppPreview = ({ data }) => {
  if (!data) return null;

  return (
    <div className="space-y-6 font-display">
      <h3 className="text-sm font-bold uppercase text-text-light tracking-widest px-2 text-center md:text-left">
        Player App Preview
      </h3>
      
      {/* Mobile Card Mockup */}
      <div className="bg-white rounded-[2.5rem] p-4 border-8 border-border-color shadow-2xl relative overflow-hidden aspect-[9/16] max-w-[320px] mx-auto">
        
        {/* Phone Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-border-color rounded-b-2xl z-20"></div>
        
        <div className="mt-8 overflow-y-auto h-full scrollbar-hide">
          <div className="relative rounded-2xl overflow-hidden mb-4 aspect-video bg-dark-navy">
            {/* Fallback image if data.imageUrl isn't provided */}
            <img 
              src={data.imageUrl || "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80&w=400"} 
              alt="Tennis court" 
              className="w-full h-full object-cover opacity-80" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
              <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded w-fit mb-2">HOT DEAL</span>
              <h4 className="text-white font-black text-xl leading-tight">{data.title}</h4>
            </div>
          </div>

          <div className="space-y-4 px-2">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-black text-text-dark">
                {data.discountRate} <span className="text-xs uppercase font-bold text-text-light">Off</span>
              </div>
              <div className="text-[10px] text-text-light text-right">
                Expires<br/>
                <span className="text-red-500 font-bold">{data.expirationShort || "Soon"}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[11px] text-text-light">
                <span className="material-symbols-outlined text-sm">schedule</span>
                {data.timeWindowShort || data.timeWindow}
              </div>
              <div className="flex items-center gap-2 text-[11px] text-text-light">
                <span className="material-symbols-outlined text-sm">location_on</span>
                {data.fields?.length || 1} Applicable Fields
              </div>
            </div>

            <p className="text-[10px] text-text-light leading-relaxed">
              {data.description || "Start your day with a match! Enjoy exclusive discounts on our premium turf courts."}
            </p>

            <button className="w-full py-3 bg-secondary text-white text-sm font-bold rounded-xl mt-4">
              Book Now
            </button>
          </div>
        </div>
      </div>
      
      <p className="text-center text-xs text-text-light px-4">
        This is exactly how players will see this deal on their Turfy Play mobile application once approved.
      </p>

      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

export default PlayerAppPreview;
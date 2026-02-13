import { FiCalendar, FiMapPin, FiUsers, FiAward } from "react-icons/fi";
import { HiOutlineTrophy } from "react-icons/hi2";

export default function CompetitionCard({ data }) {
  
  const getLevelStyle = (level) => {
    switch (level?.toLowerCase()) {
      case 'beginners': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'intermediate': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'professional': return 'bg-purple-50 text-purple-600 border-purple-100';
      default: return 'bg-emerald-50 text-[#22C55E] border-emerald-100';
    }
  };

  return (
    
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-2 h-full cursor-pointer font-display">
      
      { }
      <div className="h-40 md:h-44 bg-gray-100 relative overflow-hidden">
        <img 
          src={data.imageUrl || "https://via.placeholder.com/300x200?text=Turfy+Play"} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
          alt={data.title}
        />
        { }
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-wider z-10 shadow-sm ${data.isRegistrationOpen ? 'bg-[#22C55E] text-white' : 'bg-red-500 text-white'}`}>
          {data.isRegistrationOpen ? 'Open' : 'Closed'}
        </div>
      </div>

      { }
      <div className="p-4 md:p-5 flex flex-col flex-1 gap-3 md:gap-4">
        <h3 className="font-black text-base md:text-lg text-[#1E293B] line-clamp-1 group-hover:text-[#22C55E] transition-colors">
          {data.title}
        </h3>
        
        { }
        <div className="flex flex-col gap-2.5 text-[10px] md:text-[11px] font-bold text-gray-500">
          <div className="flex items-center gap-2.5">
             <HiOutlineTrophy size={14} className="text-[#22C55E] shrink-0" /> 
             <span className="truncate">{data.sportName}</span>
          </div>
          <div className="flex items-center gap-2.5">
             <FiCalendar size={14} className="text-[#22C55E] shrink-0" /> 
             <span>{data.dateRange}</span>
          </div>
          <div className="flex items-center gap-2.5">
             <FiMapPin size={14} className="text-[#22C55E] shrink-0" /> 
             <span className="line-clamp-1">{data.locationName}</span>
          </div>
          <div className="flex items-center gap-2.5">
             <FiUsers size={14} className="text-[#22C55E] shrink-0" /> 
             <span>{data.participantsLabel}</span>
          </div>
        </div>

        { }
        <div className="pt-1 mt-auto">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[9px] md:text-[10px] font-black uppercase tracking-wide transition-all group-hover:shadow-sm ${getLevelStyle(data.competitionTypeName)}`}>
            <FiAward size={12} className="shrink-0" />
            {data.competitionType || data.competitionTypeName || "Open Level"}
          </div>
        </div>

        { }
        <button className="w-full py-3 md:py-3.5 bg-white border-2 border-gray-50 text-[#22C55E] font-black rounded-xl mt-1 md:mt-2 group-hover:bg-[#22C55E] group-hover:text-white group-hover:border-[#22C55E] transition-all duration-300 text-xs md:text-sm shadow-sm active:scale-95">
          {data.priceLabel} — View Details
        </button>
      </div>
    </div>
  );
}
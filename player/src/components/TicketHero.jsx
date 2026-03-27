export default function TicketHero({ card, team }) {
  return (
    <div className="bg-white rounded-[2rem] border border-[#EBECEF] shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[300px]">
      {/*  image*/}
      <div className="md:w-1/3 relative">
        <img src={card.competitionImage} className="w-full h-full object-cover" alt="Tournament" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-6 left-6 text-white">
           <h4 className="text-xl font-black uppercase tracking-tighter">City League Championship</h4>
        </div>
      </div>

      {/* data */}
      <div className="md:w-2/3 p-8 flex flex-col justify-between">
        <div className="grid grid-cols-2 gap-8">
           <div className="space-y-1">
              <div className="flex items-center gap-2 text-[#22C55E]">
                <div className="w-2 h-2 bg-[#22C55E] rounded-full animate-pulse" />
                <span className="text-xs font-black uppercase tracking-widest">Registration Confirmed</span>
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase pt-4">Team</p>
              <p className="text-lg font-black text-[#1E293B]">{team.teamNickname}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase pt-2">Kick-off</p>
              <p className="text-lg font-black text-[#1E293B]">9:00 AM</p>
           </div>

           <div className="text-right md:text-left space-y-1">
              <p className="text-[10px] font-bold text-gray-400">Ticket ID: #TURFY-123456</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase pt-8">Start Date</p>
              <p className="text-lg font-black text-[#1E293B]">{card.startDate}</p>
           </div>
        </div>

        {/* Mandatory Gathering Time Section */}
        <div className="mt-8 bg-[#F1F5F9]/50 border-t border-gray-100 p-4 rounded-xl text-center">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Mandatory Gathering Time</p>
           <p className="text-3xl font-black text-[#1E293B]">8:00 AM</p>
           <p className="text-[10px] font-bold text-gray-400 italic mt-1">Please be on time for check-in and warm-up.</p>
        </div>
      </div>
    </div>
  );
}
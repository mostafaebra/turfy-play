const TimeSlotPicker = ({ slots, selectedSlot, setSelectedSlot, duration, setDuration }) => {
    return (
        <div className="border border-border-light dark:border-border-dark rounded-xl p-6 bg-white dark:bg-background-dark/50 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="text-base font-medium pb-2 block">Booking Window (48h)</label>
                    <div className="text-sm text-gray-500">Scroll to view slots across 2 days</div>
                </div>
                <div className="flex flex-col">
                    <label className="text-base font-medium pb-2">Choose Duration</label>
                    <select 
                        value={duration} 
                        onChange={(e) => setDuration(Number(e.target.value))}
                        className="form-select rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark/50 h-12"
                    >
                        <option value={1}>1 hour</option>
                        <option value={2}>1.5 hours</option>
                        <option value={3}>2 hours</option>
                            
                        <option value={5}>3 hours</option>
                    </select>
                </div>
            </div>

            <h2 className="text-lg font-bold pb-4">Select Start Time</h2>
            <div className="flex overflow-x-auto gap-3 pb-4 scrollbar-hide">
                {slots.map((slot, index) => {
                    const isSelected = selectedSlot?.time === slot.time && selectedSlot?.date === slot.date;
                    return (
                        <button
                            key={index}
                            disabled={!slot.isAvailable}
                            onClick={() => setSelectedSlot(slot)}
                            className={`min-w-[80px] h-12 rounded-lg text-sm font-semibold transition-colors flex flex-col items-center justify-center border
                                ${!slot.isAvailable ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-transparent' : 
                                  isSelected ? 'bg-primary text-white border-primary' : 'border-primary/50 text-primary hover:bg-primary/10'}`}
                        >
                            <span>{slot.time}</span>
                            <span className="text-[10px] opacity-70">{slot.date.split('-').slice(1).join('/')}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
export default TimeSlotPicker;
import React from 'react';

const formatCompetitionDates = (startDateStr, endDateStr) => {
    if (!startDateStr || !endDateStr) return 'Dates TBA';
    
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    
    const startMonth = start.toLocaleString('default', { month: 'short' });
    const endMonth = end.toLocaleString('default', { month: 'short' });
    const startDay = start.getDate().toString().padStart(2, '0');
    const endDay = end.getDate().toString().padStart(2, '0');
    const year = end.getFullYear();

    return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
};

const getStatusConfig = (status) => {
    const normalizedStatus = (status || '').toUpperCase();
    
    switch (normalizedStatus) {
        case 'REGISTRATION OPEN':
            return { wrapper: 'bg-blue-50 text-blue-600', text: 'Registration Open', icon: null, isGrayscale: false };
        case 'ONGOING':
            return { wrapper: 'bg-emerald-50 text-emerald-600', text: 'Ongoing', icon: null, isGrayscale: false };
        case 'WINNER':
            return { wrapper: 'bg-yellow-50 text-yellow-600', text: 'Winner', icon: 'workspace_premium', isGrayscale: false };
        case 'ELIMINATED':
            return { wrapper: 'bg-gray-100 text-gray-500', text: 'Eliminated', icon: null, isGrayscale: true };
        case 'COMPLETED':
             return { wrapper: 'bg-gray-100 text-gray-500', text: 'Completed', icon: null, isGrayscale: false };
        default:
            return { wrapper: 'bg-gray-100 text-gray-500', text: status, icon: null, isGrayscale: false };
    }
};

const CompetitionCard = ({ competition }) => {
    const { 
        name, 
        coverImage, 
        locationName, 
        teamName, 
        startDate, 
        endDate, 
        statusDisplay 
    } = competition;

    const statusConfig = getStatusConfig(statusDisplay);
    const dateRange = formatCompetitionDates(startDate, endDate);

    return (
        // 1. Forced bg-white, removed dark mode classes, and kept a subtle border
        <div className={`group flex flex-col md:flex-row items-stretch bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all ${statusConfig.isGrayscale ? 'opacity-80 hover:opacity-100' : ''}`}>
            
            {/* 2. Reduced Image Size: h-32 on mobile, w-40 (160px) on desktop */}
            <div 
                className={`w-full md:w-40 h-32 md:h-auto bg-center bg-no-repeat bg-cover border-b md:border-b-0 md:border-r border-gray-100 ${statusConfig.isGrayscale ? 'grayscale' : ''}`} 
                role="img" 
                aria-label={`Cover for ${name}`}
                style={{ backgroundImage: `url("${coverImage || 'https://via.placeholder.com/400x300?text=No+Image'}")` }}
            ></div>

            {/* 3. Reduced Padding: p-4 instead of p-5/6 */}
            <div className="flex flex-1 flex-col p-4">
                
                {/* Header (Status Label) */}
                <div className="flex justify-between items-start mb-1.5">
                    {/* 4. Smaller, more subtle status badges */}
                    <span className={`px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded flex items-center gap-1 ${statusConfig.wrapper}`}>
                        {statusConfig.icon && <span className="material-symbols-outlined text-[13px]">{statusConfig.icon}</span>}
                        {statusConfig.text}
                    </span>
                    <button className="material-symbols-outlined text-gray-300 hover:text-emerald-600 transition-colors rounded-full cursor-pointer text-lg">
                        more_horiz
                    </button>
                </div>

                {/* 5. Scaled down title */}
                <h3 className="text-lg font-bold text-slate-900 mb-1.5 leading-tight">{name}</h3>
                
                {/* 6. Tighter spacing (gap-1) and smaller text (text-xs) for details */}
                <div className="flex flex-col gap-1 mb-3">
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium">
                        <span className="material-symbols-outlined text-[15px]">location_on</span>
                        <span className="truncate">{locationName || 'TBA'}</span>
                    </div>
                    {teamName && (
                        <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium">
                            <span className="material-symbols-outlined text-[15px]">group</span>
                            <span className="truncate">Team: <span className="font-semibold text-slate-700">{teamName}</span></span>
                        </div>
                    )}
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium">
                        <span className="material-symbols-outlined text-[15px]">calendar_month</span>
                        <span>{dateRange}</span>
                    </div>
                </div>

                {/* 7. Slimmer footer and secondary-style button for a lighter look */}
                <div className="mt-auto pt-3 border-t border-gray-100 flex justify-end">
                    <button className="flex items-center gap-1 px-4 py-1.5 bg-gray-50 hover:bg-emerald-50 text-gray-600 hover:text-emerald-600 font-bold rounded-lg transition-colors text-sm border border-gray-200 hover:border-emerald-200">
                        <span>Details</span>
                        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    </button>
                </div>

            </div>
        </div>
    );
};

export default CompetitionCard;
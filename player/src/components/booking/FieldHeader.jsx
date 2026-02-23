const FieldHeader = ({ fieldData }) => (
    <div className="border border-border-light dark:border-border-dark rounded-xl bg-white dark:bg-background-dark/50 shadow-sm">
        <div className="w-full bg-center bg-no-repeat aspect-[21/9] bg-cover rounded-t-xl" 
             style={{backgroundImage: `url(${fieldData.imageUrl || 'https://via.placeholder.com/800x400?text=No+Image'})`}}></div>
        <div className="p-6">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-xl font-bold tracking-tight">{fieldData.name}</p>
                    <div className="flex items-center gap-2 mt-2 text-text-light/80 dark:text-text-dark/80">
                        <span className="material-symbols-outlined text-secondary">location_on</span>
                        <p className="text-sm">{fieldData.address}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-text-light/80 dark:text-text-dark/80">
                        <span className="material-symbols-outlined text-secondary">sports_soccer</span>
                        <p className="text-sm">{fieldData.sportAndSize}</p>
                    </div>
                </div>
                <div className="flex items-center gap-1 text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-full">
                    <span className="material-symbols-outlined">star</span>
                    <p className="text-sm font-bold">{fieldData.rating}</p>
                </div>
            </div>
        </div>
    </div>
);
export default FieldHeader;
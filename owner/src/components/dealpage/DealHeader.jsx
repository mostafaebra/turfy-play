import React from 'react';

const DealHeader = ({ title, submittedBy, date, onAction, isProcessing, status }) => {
  // Using your exact backend Enums for the UI
  const STATUS_PENDING = 1;
  const STATUS_REJECTED = 2;
  const STATUS_APPROVED = 3; 
  const STATUS_CANCELLED = 4;

  // Determine what badge to show based on the status
  const renderStatusBadge = () => {
    switch (status) {
      case STATUS_REJECTED:
        return (
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-red-200">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            Rejected
          </div>
        );
      case STATUS_CANCELLED:
        return (
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-gray-200">
            <span className="w-2 h-2 rounded-full bg-gray-500"></span>
            Cancelled
          </div>
        );
      case STATUS_PENDING:
      default:
        return (
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            Pending Approval
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
      <div>
        {renderStatusBadge()}
        
        <h2 className="text-4xl font-extrabold text-text-dark tracking-tight mb-2 font-display">
          {title || "Deal Title"}
        </h2>
        <p className="text-text-light flex items-center gap-2 font-display">
          <span className="material-symbols-outlined text-base">person</span>
          Submitted by <span className="text-text-dark font-semibold">{submittedBy}</span>
          <span className="mx-1">•</span>
          <span className="material-symbols-outlined text-base">calendar_today</span>
          {date}
        </p>
      </div>

      {/* Only show the action buttons if the deal is actually PENDING */}
      {status === STATUS_PENDING && (
        <div className="flex gap-3">
          <button 
            onClick={() => onAction(false)}
            disabled={isProcessing}
            className="flex items-center gap-2 px-6 py-3 border-2 border-border-color rounded-xl font-bold text-text-light hover:bg-light-gray transition-all active:scale-95 disabled:opacity-50 font-display"
          >
            <span className="material-symbols-outlined">close</span>
            Reject
          </button>
          <button 
            onClick={() => onAction(true)}
            disabled={isProcessing}
            className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl font-bold hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95 disabled:opacity-50 font-display"
          >
            <span className="material-symbols-outlined">check_circle</span>
            {isProcessing ? 'Processing...' : 'Approve'}
          </button>
        </div>
      )}
    </div>
  );
};

export default DealHeader;
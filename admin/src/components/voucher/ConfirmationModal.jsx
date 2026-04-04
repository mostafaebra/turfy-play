import React from 'react';

const ConfirmationModal = ({ 
  isOpen, onClose, onConfirm, title, message, isProcessing, 
  confirmText = "Yes, Delete", 
  processingText = "Deleting..." 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 text-center">
          
          <div className="flex items-center justify-center w-14 h-14 mx-auto bg-red-100 rounded-full mb-4">
            <span className="text-red-500 text-2xl leading-none">⚠️</span>
          </div>
          
          <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            {message}
          </p>
          
          <div className="flex gap-3 w-full">
            <button 
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm}
              disabled={isProcessing}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-500 border border-red-500 rounded-xl hover:bg-red-600 transition-colors shadow-sm shadow-red-500/30 disabled:opacity-70 flex justify-center items-center"
            >
              {isProcessing ? processingText : confirmText}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
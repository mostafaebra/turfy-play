import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

/**
 * Reusable Confirmation Modal Component
 * @param {boolean} isOpen - Controls modal visibility
 * @param {string} type - 'success' or 'error'
 * @param {string} title - Modal title
 * @param {string} message - Main message to display
 * @param {string} details - Optional additional details
 * @param {Function} onConfirm - Callback when Confirm button is clicked
 * @param {Function} onClose - Callback when Close button is clicked or backdrop is clicked
 * @param {string} confirmText - Text for confirm button (default: "Confirm")
 * @param {string} closeText - Text for close button (default: "Close")
 */
const ConfirmationModal = ({
  isOpen,
  type = 'success',
  title,
  message,
  details,
  onConfirm,
  onClose,
  confirmText = 'Confirm',
  closeText = 'Close'
}) => {
  // Close modal on Escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isSuccess = type === 'success';
  const iconColor = isSuccess ? 'text-emerald-500' : 'text-red-500';
  const bgColor = isSuccess ? 'bg-emerald-50' : 'bg-red-50';
  const borderColor = isSuccess ? 'border-emerald-200' : 'border-red-200';
  const buttonColor = isSuccess 
    ? 'bg-emerald-500 hover:bg-emerald-600' 
    : 'bg-red-500 hover:bg-red-600';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop with blur */}
      <div className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200 ${
        isOpen ? 'opacity-100' : 'opacity-0'
      }`} />
      
      {/* Modal Content */}
      <div 
        className={`relative bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 ${
          isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-10"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Icon & Title Section */}
        <div className={`${bgColor} ${borderColor} border-b px-6 py-6 rounded-t-2xl`}>
          <div className="flex items-start gap-4">
            <div className={`${iconColor} shrink-0`}>
              {isSuccess ? (
                <CheckCircle size={48} className="transition-transform duration-300 scale-100" />
              ) : (
                <XCircle size={48} className="transition-transform duration-300 scale-100" />
              )}
            </div>
            <div className="flex-1 pt-1">
              <h3 className="text-xl font-bold text-slate-900 mb-1">
                {title || (isSuccess ? 'Success!' : 'Error!')}
              </h3>
              <p className={`text-sm ${isSuccess ? 'text-emerald-700' : 'text-red-700'}`}>
                {message}
              </p>
            </div>
          </div>
        </div>

        {/* Details Section (if provided) */}
        {details && (
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
            <p className="text-sm text-slate-600 whitespace-pre-wrap">{details}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="px-6 py-4 flex flex-col sm:flex-row gap-3 sm:justify-end">
          {onConfirm && (
            <button
              onClick={onConfirm}
              className={`${buttonColor} text-white px-6 py-2.5 rounded-lg font-semibold transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2`}
            >
              {confirmText}
            </button>
          )}
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
          >
            {closeText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;


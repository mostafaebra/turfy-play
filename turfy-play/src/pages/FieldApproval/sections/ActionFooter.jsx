import React from 'react';

const ActionFooter = ({ onSave, onApprove, onReject }) => {
  return (
    <div className="mt-8 flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
      {/* SAVE BUTTON -> Calls onSave (Keep Status) */}
      <button 
        onClick={onSave}
        className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2 hover:bg-gray-50 rounded-md transition-colors"
      >
        Save Changes
      </button>
      
      {/* REJECT BUTTON -> Calls onReject (Status 2) */}
      <button 
        onClick={onReject}
        className="text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 px-4 py-2 rounded-md transition-colors"
      >
        Reject Submission
      </button>
      
      {/* APPROVE BUTTON -> Calls onApprove (Status 3) */}
      <button 
        onClick={onApprove}
        className="text-sm font-medium text-white bg-green-500 hover:bg-green-600 px-6 py-2 rounded-md shadow-sm transition-colors"
      >
        Approve & Publish
      </button>
    </div>
  );
};

export default ActionFooter;
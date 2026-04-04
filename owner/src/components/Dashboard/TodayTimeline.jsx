import React from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, Edit2 } from 'lucide-react';

const TodayTimeline = ({ timelineData }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-900">Today's Timeline</h2>
        <button 
          onClick={() => navigate('/schedule')} // 👈 هيروح لصفحة الجدول
          className="text-sm font-semibold text-green-600 hover:text-green-700 transition-colors"
        >
          View Full Schedule
        </button>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {timelineData.map((slot, index) => (
          <div key={index} className={`min-w-[280px] p-5 rounded-xl border flex flex-col justify-between ${slot.state === 1 ? 'border-gray-200 bg-gray-50/50' : 'border-dashed border-gray-300 bg-white'}`}>
            <div className="mb-4">
              <p className="text-[15px] font-bold text-gray-900 mb-1">{slot.timeLabel}</p>
              {slot.state === 1 ? (
                <p className="text-sm text-gray-500">Booked by: <span className="text-gray-700">{slot.bookedBy || 'Unknown'}</span></p>
              ) : (
                <p className="text-sm font-semibold text-green-500">Available</p>
              )}
            </div>
            
            <div className="flex justify-end">
              {slot.state === 1 && slot.needsVerification ? (
                <button 
                  onClick={() => alert(`Verifying OTP for booking: ${slot.bookingId}`)} // 👈 أكشن التحقق من الكود
                  className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 hover:bg-blue-100 transition-colors"
                >
                  <QrCode size={14} /> Verify OTP
                </button>
              ) : slot.state === 0 ? (
                <button 
                  onClick={() => navigate('/schedule')} // 👈 تعديل الموعد المتاح
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Edit2 size={16} />
                </button>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodayTimeline;
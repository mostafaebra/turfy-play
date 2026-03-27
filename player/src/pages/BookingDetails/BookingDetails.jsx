import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiRefreshCw, FiStar, FiMapPin } from "react-icons/fi"; 

import BookingHero from "../../components/BookingHero";
import EntryCode from "../../components/EntryCode";
import BookingSpecifics from "../../components/BookingSpecifics";
import PaymentSummary from "../../components/PaymentSummary";

export default function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);

  const AUTH_TOKEN = localStorage.getItem("token");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(
          `http://turfy.runasp.net/Turfy/GetBookingDetailsEndpoint/Execute?BookingId=${id}`,
          { headers: { Authorization: `Bearer ${AUTH_TOKEN}` } }
        );
        if (response.data.isSuccess) {
          setBookingData(response.data.data);
        }
      } catch (error) { console.error("API Error:", error); }
      finally { setLoading(false); }
    };
    fetchDetails();
  }, [id, AUTH_TOKEN]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black text-[#22C55E] animate-pulse">Loading...</div>;
  if (!bookingData) return <div className="min-h-screen flex items-center justify-center font-black text-gray-300 italic">Booking Details Expired</div>;

  // 🛡️ الزتونة: مقارنة صارمة بالرقم 4 فقط كـ String لضمان الدقة
  // أي رقم تاني (87, 144, 162, 171, 174, 240, 259) هيدخل في الـ ELSE
  const isConfirmed = String(bookingData.status) === "4";

  return (
    <div className="min-h-screen bg-[#F8F9FB] font-sans py-6 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-[2rem] border border-[#EBECEF] shadow-sm overflow-hidden">
        
        {/* Header ثابت */}
        <div className="px-6 py-5 flex items-center gap-4 border-b border-[#F1F2F4]">
          <button onClick={() => navigate(-1)} className="text-[#1E293B] hover:text-[#22C55E] transition-colors"><FiArrowLeft size={22} /></button>
          <h1 className="text-xl font-black text-[#1E293B]">Booking #{bookingData.bookingId}</h1>
        </div>

        <div className="p-4 md:p-8 space-y-8">
          <BookingHero imageUrl={bookingData.fieldImage} status={bookingData.status} />

          {/* 🟢 الحالة الأولى: الحجز نشط (رقم 4 فقط) */}
          {isConfirmed ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <EntryCode code={bookingData.entryOTP} />
              
              <BookingSpecifics 
                fieldName={bookingData.fieldName}
                date={bookingData.date}
                time={bookingData.time}
                duration={bookingData.durationInMinutes}
                latitude={bookingData.latitude} 
                longitude={bookingData.longitude}
              />

              <PaymentSummary 
                price={bookingData.bookingPrice}
                fees={bookingData.fees}
                discount={bookingData.couponDiscount}
                total={bookingData.totalPrice}
                method={bookingData.paymentMethod}
              />

              <div className="flex flex-col md:flex-row gap-4 pt-6 border-t border-[#F1F2F4]">
                <button 
                   onClick={() => window.open(`https://www.google.com/maps?q=${bookingData.latitude},${bookingData.longitude}`)}
                   className="flex-1 bg-[#1E293B] text-white py-4 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg"
                >
                  <FiMapPin /> Get Directions
                </button>
                <button className="flex-1 bg-white border border-[#EBECEF] text-red-500 py-4 rounded-xl font-black text-[11px] uppercase tracking-widest">
                  Cancel Booking
                </button>
              </div>
            </div>
          ) : (
            /* 🔴 الحالة الثانية: أي رقم تاني (بعد انتهاء الحجز) */
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* بوكس الملخص السريع */}
              <div className="bg-white border border-[#F1F2F4] rounded-[1.5rem] p-6 space-y-4 shadow-sm">
                <h3 className="text-lg font-black text-[#1E293B]">Booking Recap</h3>
                <div className="flex justify-between text-sm border-b border-gray-50 pb-2">
                  <span className="text-gray-400 font-bold italic">Field Name</span>
                  <span className="font-black text-[#1E293B]">{bookingData.fieldName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-bold italic">Total Paid</span>
                  <span className="font-black text-[#22C55E] tracking-tight">${bookingData.totalPrice}</span>
                </div>
              </div>

              {/* الكود يظهر كـ Expired بإجبار القيمة لـ null */}
              <EntryCode code={null} /> 

              {/* دعوة للتقييم والنجوم */}
              <div className="text-center py-8 border border-[#F1F2F4] rounded-[1.5rem] space-y-4 bg-[#F8F9FB]/30">
                <h3 className="text-xl font-black text-[#1E293B]">How was your game?</h3>
                <div className="flex justify-center gap-2 pt-2">
                  {[1,2,3,4,5].map(s => (
                    <button key={s} onClick={() => navigate(`/write-review/${id}`)}>
                      <FiStar size={30} className="text-gray-200 hover:text-amber-400 transition-colors cursor-pointer" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button onClick={() => navigate(`/write-review/${id}`)} className="bg-[#22C55E] text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#1DA853] transition-all">Write a Review</button>
                <button className="bg-white border border-[#EBECEF] text-red-400 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-50 transition-all">Report Issue</button>
                <button onClick={() => navigate(`/field-details/${bookingData.fieldId}`)} className="bg-[#1E293B] text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all">
                  <FiRefreshCw /> Book Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
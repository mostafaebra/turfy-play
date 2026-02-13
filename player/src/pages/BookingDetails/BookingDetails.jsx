import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi"; 

// Your Components
import BookingHero from "../../components/BookingHero";
import EntryCode from "../../components/EntryCode";
import BookingSpecifics from "../../components/BookingSpecifics";
import PaymentSummary from "../../components/PaymentSummary";

export default function BookingDetails() {
  const { id } = useParams();
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🚀 Component Mounted. Requested ID:", id);

    if (!id) {
      console.warn("⚠️ Warning: No ID found in URL.");
      return;
    }

    const fetchDetails = async () => {
      try {
        const token = localStorage.getItem("token");
           console.log("🔑 Retrieved Token:", token);
        const response = await axios.get(
          `http://turfy.runasp.net/Turfy/GetBookingDetailsEndpoint/Execute?BookingId=${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            },
          }
        );

        console.log("API Response:", response.data);
 
        if (response.data.isSuccess) {
          setBookingData(response.data.data);
        }
      } catch (error) {
        console.error("Fetch Error:", error.response || error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-light-gray font-display">
      <p className="text-primary font-bold text-xl animate-pulse">Loading Booking Details...</p>
    </div>
  );
  
  if (!bookingData) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-light-gray font-display">
        <p className="text-text-light mb-4 text-lg">We couldn't find the data for this booking.</p>
        <button onClick={() => window.history.back()} className="text-primary font-bold hover:underline">
            Go Back
        </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-light-gray font-display py-10 px-4">
      {/* Main Container */}
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-border-color">
        
        {/* Top Header */}
        <div className="p-6 border-b border-border-color flex items-center gap-4">
          <button onClick={() => window.history.back()} className="text-text-dark hover:text-primary transition">
            <FiArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-bold text-dark tracking-tight">Booking #{id}</h1>
        </div>

        <div className="p-6 flex flex-col gap-8">
          {/* 1. Image & Status Section */}
          <BookingHero 
            imageUrl={bookingData.fieldImage} 
            status={bookingData.status === 1 ? "Confirmed" : "Pending"} 
          />

          {/* 2. Entry Code Section */}
          <EntryCode code={bookingData.entryOTP} />

          {/* 3. Booking Specifics Section */}
<BookingSpecifics 
  fieldName={bookingData.fieldName}
  date={bookingData.date}
  time={bookingData.time}
  duration={bookingData.durationInMinutes}
  latitude={bookingData.latitude}
  longitude={bookingData.longitude}
/>


          {/* 4. Payment Summary Section */}
          <PaymentSummary 
            price={bookingData.bookingPrice}
            fees={bookingData.fees}
            discount={bookingData.couponDiscount}
            total={bookingData.totalPrice}
            method={bookingData.paymentMethod}
          />

          {/* 5. Footer Actions (As per original design) */}
          <div className="flex items-center justify-center gap-8 mt-4 pt-6 border-t border-border-color">
            <button 
              className="text-red-500 font-bold text-sm hover:underline transition-all"
              onClick={() => { if(window.confirm("Cancel this booking?")) console.log("Cancelled"); }}
            >
              Cancel Booking
            </button>
            
            <button 
              className="bg-primary text-white px-10 py-3 rounded-lg font-bold hover:bg-primary/90 transition shadow-md shadow-primary/20"
              onClick={() => window.open(`https://www.google.com/maps?q=${bookingData.latitude},${bookingData.longitude}`)}
            >
              Get Directions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
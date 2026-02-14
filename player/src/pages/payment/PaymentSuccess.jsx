import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, MapPin, Clock, Copy, Share2, Loader2, AlertCircle } from 'lucide-react';
import { bookingApi } from '../../services/bookingApi';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  
  // 1. Get Params from URL (Backend redirects here with ?status=...&id=...)
  const status = queryParams.get('status');
  const bookingId = queryParams.get('id') || location.state?.result?.bookingId;
  const failureReason = queryParams.get('reason');

  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Fetch Details on Mount
  useEffect(() => {
    // If backend says failed, redirect to failure page immediately
    if (status === 'failed') {
        navigate(`/payment/failed?message=${failureReason || "Payment declined"}&code=ERR_GATEWAY`);
        return;
    }

    const fetchConfirmation = async () => {
        if (!bookingId) {
            setError("Missing Booking ID");
            setLoading(false);
            return;
        }

        try {
            const response = await bookingApi.getBookingConfirmation(bookingId);
            if (response.isSuccess && response.data) {
                setBookingDetails(response.data);
            } else {
                setError(response.message || "Could not retrieve booking details.");
            }
        } catch (err) {
            console.error(err);
            setError("Network error while fetching confirmation.");
        } finally {
            setLoading(false);
        }
    };

    fetchConfirmation();
  }, [bookingId, status, navigate, failureReason]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-emerald-600">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <p className="font-semibold">Verifying Payment...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h1>
            <p className="text-gray-500 mb-6">{error}</p>
            <Link to="/" className="block w-full bg-slate-900 text-white font-bold py-3 rounded-xl">Return Home</Link>
        </div>
    </div>
  );

  if (!bookingDetails) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white max-w-lg w-full rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Success Header */}
        <div className="bg-emerald-600 p-8 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="relative z-10">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                    <CheckCircle className="text-white w-10 h-10" />
                </div>
                <h1 className="text-3xl font-black mb-2">Booking Confirmed!</h1>
                <p className="text-emerald-100">Your spot is secured. Get ready to play!</p>
            </div>
        </div>

        <div className="p-6 md:p-8">
            {/* OTP Section */}
            <div className="bg-gray-50 border border-dashed border-gray-300 rounded-2xl p-6 text-center mb-8">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Entry OTP Code</p>
                <div className="text-4xl font-black text-slate-900 tracking-widest font-mono select-all">
                    {bookingDetails.entryOtp}
                </div>
                <p className="text-xs text-gray-400 mt-2">Show this code at the venue reception</p>
            </div>

            {/* Details Grid */}
            <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl shrink-0"><MapPin size={20} /></div>
                    <div>
                        <p className="text-xs text-gray-400 font-bold uppercase">Venue</p>
                        <p className="font-bold text-slate-900 text-lg leading-tight">{bookingDetails.venueName}</p>
                        <p className="text-sm text-gray-500">{bookingDetails.location}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl shrink-0"><Calendar size={20} /></div>
                    <div>
                        <p className="text-xs text-gray-400 font-bold uppercase">Date & Time</p>
                        <p className="font-bold text-slate-900">{new Date(bookingDetails.date).toLocaleDateString()} • {bookingDetails.time}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl shrink-0"><Clock size={20} /></div>
                    <div>
                        <p className="text-xs text-gray-400 font-bold uppercase">Duration</p>
                        <p className="font-bold text-slate-900">{bookingDetails.duration} Minutes ({bookingDetails.sport})</p>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors">
                    <Share2 size={18} /> Share
                </button>
                <Link to="/" className="flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200">
                    Done
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
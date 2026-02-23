import React, { useState, useEffect } from 'react';
import { bookingApi } from '../../services/bookingApi';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/account/Sidebar';
import { Calendar, Loader2, AlertCircle } from 'lucide-react';

const getStatusBadge = (status) => {
    const s = status?.toLowerCase() || '';
    if (s === 'confirmed') return <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded text-xs font-bold">Confirmed</span>;
    if (s === 'pending') return <span className="bg-yellow-100 text-yellow-800 px-2.5 py-1 rounded text-xs font-bold">Pending</span>;
    if (s === 'canceled' || s === 'rejected') return <span className="bg-red-100 text-red-700 px-2.5 py-1 rounded text-xs font-bold">{status}</span>;
    if (s === 'ended') return <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded text-xs font-bold">Ended</span>;
    return <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded text-xs font-bold">{status}</span>;
};

const formatBookingDate = (isoString) => {
    if (!isoString) return "Date N/A";
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
};

const MyBookingsPage = () => {
    const [bookingTypeTab, setBookingTypeTab] = useState(1);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [nextCursor, setNextCursor] = useState(null);
    const [hasMore, setHasMore] = useState(false);

    const fetchBookings = async (isLoadMore = false) => {
        console.log("MyBookingsPage: Fetching bookings...", { bookingTypeTab, isLoadMore });
        
        setLoading(true);
        setError(null);
        try {
            const cursorToSend = isLoadMore ? nextCursor : null;
            const response = await bookingApi.getPlayerBookings(bookingTypeTab, cursorToSend);

            console.log("MyBookingsPage: API Response", response);

            if (response.isSuccess && response.data) {
                const newItems = response.data.items || [];
                if (isLoadMore) {
                    setBookings(prev => [...prev, ...newItems]);
                } else {
                    setBookings(newItems);
                }
                setNextCursor(response.data.nextCursor);
                setHasMore(response.data.hasMore);
            } else {
                setError(response.message || "Failed to load bookings.");
            }
        } catch (err) {
            console.error("MyBookingsPage: Error fetching data", err);
            // Check if it's a 401 Unauthorized
            if (err.response && err.response.status === 401) {
                setError("Please log in to view your bookings.");
            } else {
                setError("Network error. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Trigger fetch whenever the tab changes
        setBookings([]);
        setNextCursor(null);
        setHasMore(false);
        fetchBookings(false); 
    }, [bookingTypeTab]);

    return (
        <div>
            <Navbar />
            <div className="flex min-h-screen bg-light-gray font-display text-text-dark">
                <Sidebar activeTab="bookings" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)}/>

                <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="flex flex-col gap-8">
                        <div className="flex items-center gap-3">
                            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 -ml-2 text-slate-900 hover:bg-white rounded-lg transition-colors">
                                <span className="material-symbols-outlined text-2xl">menu</span>
                            </button>
                            <h1 className="text-4xl font-black text-slate-900">My Bookings</h1>
                        </div>

                        <div className="flex border-b border-gray-200">
                            <button onClick={() => setBookingTypeTab(1)} className={`flex-1 pb-4 text-center font-bold text-sm border-b-2 ${bookingTypeTab === 1 ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Upcoming</button>
                            <button onClick={() => setBookingTypeTab(2)} className={`flex-1 pb-4 text-center font-bold text-sm border-b-2 ${bookingTypeTab === 2 ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>History</button>
                        </div>

                        {error && (
                            <div className="bg-red-50 p-4 rounded-xl text-red-600 flex items-center gap-2">
                                <AlertCircle size={20} /> {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            {bookings.map((booking) => (
                                <div key={booking.bookingId} className="bg-white p-4 sm:p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                    <div className="w-full sm:w-24 h-24 bg-gray-200 rounded-lg bg-cover bg-center shrink-0" style={{ backgroundImage: `url(${booking.imageUrl || 'https://via.placeholder.com/150'})` }}></div>
                                    <div className="flex-1 w-full">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-bold text-lg text-slate-900">{booking.venueName}</h3>
                                            {getStatusBadge(booking.status)}
                                        </div>
                                        <p className="text-sm font-medium text-emerald-600 mb-2">{booking.fieldName}</p>
                                        <div className="flex flex-col gap-1 text-sm text-gray-500">
                                            <div className="flex items-center gap-2"><Calendar size={14} /> <span>{formatBookingDate(booking.fullDateTime)}</span></div>
                                            <div className="flex items-center gap-2"><div className="font-bold text-slate-900">EGP {booking.price?.toFixed(2)}</div></div>
                                        </div>
                                        {booking.entryOtp && (
                                            <div className="mt-3 bg-gray-50 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 border-dashed">
                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Entry OTP:</span>
                                                <span className="font-mono font-black text-slate-800 text-lg tracking-widest">{booking.entryOtp}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {!loading && bookings.length === 0 && !error && (
                                <div className="text-center py-12 text-gray-400">
                                    <Calendar size={48} className="mx-auto mb-4 opacity-20" />
                                    <p>No bookings found in this section.</p>
                                </div>
                            )}

                            {hasMore && (
                                <button onClick={() => fetchBookings(true)} disabled={loading} className="w-full py-3 mt-4 text-sm font-bold text-slate-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50">
                                    {loading ? 'Loading...' : 'Load More'}
                                </button>
                            )}

                            {loading && bookings.length === 0 && (
                                <div className="flex justify-center py-12 text-emerald-600"><Loader2 size={32} className="animate-spin" /></div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MyBookingsPage;
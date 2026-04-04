import React, { useState, useEffect, useCallback, useRef } from "react";
import Navbar from "../../components/Navbar";
import FilterSidebar from "../../components/filterpage/FilterSidebar";
import VenueCard from "../../components/filterpage/VenueCard";
import VenueSkeleton from "../../components/filterpage/VenueSkeleton";
import Pagination from "../../components/filterpage/Pagination";
import { X, SlidersHorizontal, List, Map, AlertCircle, RefreshCw } from "lucide-react";
import { fetchFilteredFields, getSportNameFromByte } from "../../services/fieldService";
import { Link } from "react-router-dom";

// --- HELPER: Get Today's Date formatted as YYYY-MM-DD ---
const getTodayString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const mapApiVenueToCard = (apiVenue) => {
  const rawLocation = apiVenue.location || apiVenue.Location || apiVenue.address || apiVenue.city;
  let trimmedLocation = 'Unknown Location';
  
  if (rawLocation && typeof rawLocation === 'string') {
    trimmedLocation = rawLocation.includes(',') 
      ? rawLocation.substring(rawLocation.indexOf(',') + 1).trim()
      : rawLocation.trim();
  }
  
  const rawRating = apiVenue.Rate || apiVenue.rate || apiVenue.rating || 0;
  const formattedRating = Number(rawRating).toFixed(1);
  
  const rawDistance = apiVenue.Dis ?? apiVenue.dis ?? apiVenue.distance ?? apiVenue.Distance;
  let formattedDistance = null;

  if (rawDistance !== null && rawDistance !== undefined) {
    const num = parseFloat(rawDistance);
    if (!isNaN(num)) formattedDistance = num.toFixed(1);
  }

  const typeByte = apiVenue.SportType ?? apiVenue.sportType; 
  const displaySport = getSportNameFromByte(typeByte) || 'Sports';

  return {
    id: apiVenue.FieldId || apiVenue.fieldId || apiVenue.id,
    name: apiVenue.Name || apiVenue.name || 'Unnamed Venue',
    sportType: displaySport,
    rating: formattedRating,
    location: trimmedLocation,
    distance: formattedDistance,
    price: apiVenue.Price || apiVenue.price || 0,
    image: apiVenue.ImageURL || apiVenue.image || "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&q=80&w=1000"
  };
};

const Filterpage = () => {
  const [filters, setFilters] = useState({
    sort: 'Best Match', location: '', type: '', priceMin: '', priceMax: '', rating: 'Any', lat: null, lng: null,
    search: '' 
  });
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  const [viewMode, setViewMode] = useState('Map'); 

  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState(null);
  const cursorRef = useRef({ value: null, id: null });

  const handleSearchSubmit = (term) => {
    setFilters(prev => ({ ...prev, search: term }));
    setPage(1); 
  };

  const handleFetch = useCallback(async (isLoadMore = false) => {
    setLoading(true);
    setError(null);
    try {
      const cursor = isLoadMore && cursorRef.current.value ? cursorRef.current : null;
      const data = await fetchFilteredFields(filters, cursor);
      
      if (!data) throw new Error('No data received');
      
      const items = Array.isArray(data.items) ? data.items : (data.data?.items || []);
      const mappedItems = items.map(mapApiVenueToCard);
      
      setVenues(prevVenues => isLoadMore ? [...prevVenues, ...mappedItems] : mappedItems);
      
      const newCursor = { 
        value: data.nextCursorValue || data.nextCursor || null, 
        id: data.nextCursorTieBreakerId || data.nextId || null
      };
      cursorRef.current = newCursor;
      setHasMore(data.hasMore !== undefined ? data.hasMore : (mappedItems.length >= 8));
      
      if (!isLoadMore) {
        setPage(1);
        cursorRef.current = { value: null, id: null };
      }
    } catch (err) {
      console.error('API Error:', err);
      setError('We encountered an issue while loading the venues.');
      if (!isLoadMore) setVenues([]); 
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const isFirstMount = useRef(true);
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      handleFetch(false);
      return;
    }
    handleFetch(false);
  }, [filters, handleFetch]);

  useEffect(() => {
    if (filters.location === 'Current Location' && navigator.geolocation) {
      const originalError = window.onerror;

      const tempHandler = (message, source, lineno, colno, error) => {
        if (message && (message.includes('runtime.lastError') || message.includes('message channel closed'))) {
          return true;
        }
        return originalError && originalError(message, source, lineno, colno, error);
      };

      window.onerror = tempHandler;

      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Restore original handler as soon as we have a result
          window.onerror = originalError;
          setFilters(prev => ({
            ...prev,
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }));
        },
        (error) => {
          // Restore original handler on error as well
          window.onerror = originalError;
          setFilters(prev => ({
            ...prev,
            location: '',
            lat: null,
            lng: null
          }));
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );

      // Cleanup: restore original handler if the effect re-runs or component unmounts
      return () => {
        if (window.onerror === tempHandler) {
          window.onerror = originalError;
        }
      };
    } else if (filters.location !== 'Current Location') {
      setFilters(prev => ({ ...prev, lat: null, lng: null }));
    }
  }, [filters.location]);

  const removeFilter = (key) => {
    setFilters(prev => ({
      ...prev,
      [key]: key === 'type' ? '' : key === 'rating' ? 'Any' : key === 'location' ? '' : '',
      ...(key === 'location' && { lat: null, lng: null })
    }));
  };

  const handlePageChange = (newPage) => {
    if (newPage > page && hasMore) handleFetch(true);
    setPage(newPage);
  };

  const itemsPerPage = 8;
  const currentData = venues.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(venues.length / itemsPerPage) + (hasMore ? 1 : 0);

  const gridClasses = viewMode === 'List' 
    ? 'grid-cols-1' 
    : 'grid-cols-2 md:grid-cols-2 xl:grid-cols-4';

  const todayString = getTodayString();

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Navbar onSearchSubmit={handleSearchSubmit} initialSearch={filters.search} />

      <div className="max-w-7xl mx-auto flex relative">
        <FilterSidebar 
            filters={filters} 
            setFilters={setFilters} 
            isOpen={isMobileSidebarOpen}
            onClose={() => setIsMobileSidebarOpen(false)}
        />

        <main className="flex-1 p-4 md:p-8 bg-gray-50/50 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    {filters.location ? `Venues in ${filters.location}` : "All Venues"}
                </h1>
                
                <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                    <button onClick={() => setIsMobileSidebarOpen(true)} className="lg:hidden flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg font-bold text-sm shadow-sm">
                        <SlidersHorizontal size={16} /> Filters
                    </button>

                    <div className="flex bg-gray-100/80 p-1 rounded-lg border border-gray-200">
                        <button onClick={() => setViewMode('List')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold transition-all ${viewMode === 'List' ? 'bg-white text-slate-900 shadow-sm' : 'text-gray-500 hover:text-slate-700'}`}>
                            <List size={16} /> List
                        </button>
                        <button onClick={() => setViewMode('Map')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold transition-all ${viewMode === 'Map' ? 'bg-white text-slate-900 shadow-sm' : 'text-gray-500 hover:text-slate-700'}`}>
                            <Map size={16} /> Map
                        </button>
                    </div>
                </div>
            </div>

            {/* Active Filters */}
            <div className="flex flex-wrap items-center gap-3 mb-6 pb-6 border-b border-gray-200">
                <span className="text-sm font-medium text-slate-500">Showing {venues.length} venues:</span>
                {filters.type && (
                   <button onClick={() => removeFilter('type')} className="flex h-8 items-center gap-2 rounded-lg bg-emerald-100/50 text-emerald-700 pl-3 pr-2 text-sm font-semibold border border-emerald-100">
                       <span>⚽</span> {filters.type} <X size={14} />
                   </button>
                )}
                {filters.rating !== 'Any' && filters.rating !== '' && (
                    <button onClick={() => removeFilter('rating')} className="flex h-8 items-center gap-2 rounded-lg bg-white border border-gray-200 text-slate-600 pl-3 pr-2 text-sm font-medium">
                        <span>⭐</span> {filters.rating}+ Stars <X size={14} />
                    </button>
                )}
                {(filters.priceMin || filters.priceMax) && (
                    <button onClick={() => setFilters(p => ({...p, priceMin: '', priceMax: ''}))} className="flex h-8 items-center gap-2 rounded-lg bg-white border border-gray-200 text-slate-600 pl-3 pr-2 text-sm font-medium">
                        <span>💰</span> ${filters.priceMin || 0} - ${filters.priceMax || 'Max'} <X size={14} />
                    </button>
                )}
            </div>

            {error ? (
               <div className="col-span-full flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in-95 duration-300">
                <div className="bg-red-50 p-4 rounded-full mb-4 shadow-sm"><AlertCircle size={48} className="text-red-500" /></div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Oops! Something went wrong</h3>
                <button onClick={() => handleFetch(false)} className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 text-white rounded-lg font-bold hover:bg-emerald-600 mt-4"><RefreshCw size={18} /> Try Again</button>
              </div>
            ) : (
              <div className={`grid gap-4 md:gap-6 ${gridClasses}`}>
                  {loading ? (
                      Array(8).fill(null).map((_, i) => <VenueSkeleton key={`skeleton-${i}`} />)
                  ) : (
                      currentData.length > 0 ? (
                          currentData.map((venue) => (
                             // --- CHANGED: LINK NOW POINTS DIRECTLY TO BOOKING PAGE ---
                             <Link key={venue.id} to={`/details/${venue.id}`} className="block h-full group">
                                <VenueCard venue={venue} viewMode={viewMode} />
                             </Link>
                          ))
                      ) : (
                          <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
                              <span className="text-4xl mb-4">🔍</span>
                              <h3 className="text-lg font-bold text-slate-800">No venues found</h3>
                              <p className="text-slate-500 mb-6 max-w-xs mx-auto">
                                  We couldn't find any venues matching your current filters. Try adjusting your search or filters.
                              </p>
                              <button onClick={() => setFilters({ sort: 'Best Match', location: '', type: '', priceMin: '', priceMax: '', rating: 'Any', lat: null, lng: null, search: '' })} className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-bold shadow-md">
                                  Clear all filters
                              </button>
                          </div>
                      )
                  )}
              </div>
            )}

            {!loading && !error && venues.length > 0 && totalPages > 1 && (
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
            )}
        </main>
      </div>
    </div>
  );
};

export default Filterpage;
// CORRECTED IMPORT:
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from '../../components/Navbar';
import FilterSidebar from '../../components/FilterSidebar';
import VenueCard from '../../components/VenueCard';
import VenueSkeleton from '../../components/VenueSkeleton';
import Pagination from '../../components/Pagination';
import { X, SlidersHorizontal, List, Map } from 'lucide-react';
import { fetchFilteredFields, getSportNameFromByte } from '../../services/fieldService';

// Map API response fields to VenueCard expected format
// Backend returns: FieldId, Name, Price, location, Rate, ImageURL, SportType (byte), Dis
const mapApiVenueToCard = (apiVenue) => {
  // Handle location - if backend returns null, display as "none"
  const rawLocation = apiVenue.location || apiVenue.Location || apiVenue.address || apiVenue.city;
  let trimmedLocation = 'none';
  
  if (rawLocation && rawLocation !== null && rawLocation !== 'null' && rawLocation.trim() !== '') {
    // Trim location: remove everything before the first comma
    trimmedLocation = rawLocation.includes(',') 
      ? rawLocation.substring(rawLocation.indexOf(',') + 1).trim()
      : rawLocation.trim();
  }
  
  // Format rating to 1 decimal place
  const rawRating = apiVenue.Rate || apiVenue.rate || apiVenue.rating || apiVenue.averageRating || 0;
  const formattedRating = typeof rawRating === 'number' 
    ? rawRating.toFixed(1) 
    : parseFloat(rawRating).toFixed(1) || '0.0';
  
  return {
    id: apiVenue.FieldId || apiVenue.fieldId || apiVenue.id,
    name: apiVenue.Name || apiVenue.name || 'Unnamed Venue',
    sportType: getSportNameFromByte(apiVenue.SportType) || null,
    rating: formattedRating,
    location: trimmedLocation, // Will be null if backend returns null
    distance: apiVenue.Dis !== null && apiVenue.Dis !== undefined 
      ? `${apiVenue.Dis.toFixed(1)}` 
      : (apiVenue.distance ? `${apiVenue.distance.toFixed(1)}` : null),
    price: apiVenue.Price || apiVenue.price || apiVenue.pricePerHour || apiVenue.hourlyRate || 0,
    image: apiVenue.ImageURL || apiVenue.imageURL || apiVenue.image || apiVenue.imageUrl || apiVenue.photo || "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&q=80&w=1000"
  };
};

const Filterpage = () => {
  // --- STATE ---
  const [filters, setFilters] = useState({
    sort: 'Best Match',
    location: '',
    type: '',
    priceMin: '', 
    priceMax: '',
    rating: 'Any',
    lat: null,
    lng: null
  });
  const [globalSearch, setGlobalSearch] = useState('');
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState('List');
  const [nextCursor, setNextCursor] = useState({ value: null, id: null });
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState(null);
  const cursorRef = useRef({ value: null, id: null });

  // Fetch data from API
  const handleFetch = useCallback(async (isLoadMore = false) => {
    setLoading(true);
    setError(null);
    try {
      // Use ref to get current cursor (avoids dependency issues)
      const cursor = isLoadMore && cursorRef.current.value ? cursorRef.current : null;
      
      const data = await fetchFilteredFields(filters, cursor);
      
      // Validate response structure
      if (!data) {
        throw new Error('Invalid API response: No data received');
      }
      
      // Map API response items to VenueCard format
      const items = Array.isArray(data.items) ? data.items : (data.data?.items || []);
      const mappedItems = items.map(mapApiVenueToCard);
      
      // If loading more, append. Otherwise, replace.
      setVenues(prevVenues => isLoadMore ? [...prevVenues, ...mappedItems] : mappedItems);
      
      // Save the cursor for the next request (both state and ref)
      const newCursor = { 
        value: data.nextCursorValue || data.nextCursor || null, 
        id: data.nextCursorTieBreakerId || data.nextId || null
      };
      setNextCursor(newCursor);
      cursorRef.current = newCursor;
      setHasMore(data.hasMore !== undefined ? data.hasMore : (mappedItems.length >= 8));
      
      // Reset to page 1 when filters change (not on load more)
      if (!isLoadMore) {
        setPage(1);
        // Reset cursor when filters change
        cursorRef.current = { value: null, id: null };
      }
    } catch (err) {
      console.error('Error fetching venues:', err);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to load venues. Please try again.';
      if (err.response) {
        // Server responded with error status
        errorMessage = err.response.data?.message || `Server error: ${err.response.status}`;
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = 'Network error. Please check your connection.';
      } else {
        // Something else happened
        errorMessage = err.message || 'An unexpected error occurred.';
      }
      
      setError(errorMessage);
      if (!isLoadMore) {
        setVenues([]);
      }
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Track if this is the first mount
  const isFirstMount = useRef(true);

  // Fetch data when filters change
  useEffect(() => {
    // Skip initial mount - let user set filters first, or we can enable this if needed
    if (isFirstMount.current) {
      isFirstMount.current = false;
      // Optionally fetch on mount with default filters
      handleFetch(false);
      return;
    }
    handleFetch(false);
  }, [filters, handleFetch]);

  // Handle location geolocation - only when "Current Location" is selected
  // AND "Nearest to Me" sort is selected
  useEffect(() => {
    const isNearestSort = filters.sort === 'Nearest to Me';
    
    if (filters.location === 'Current Location' && isNearestSort && navigator.geolocation) {
      // Suppress browser extension errors
      const originalError = window.onerror;
      const originalUnhandledRejection = window.onunhandledrejection;
      
      window.onerror = (message, source, lineno, colno, error) => {
        // Ignore browser extension errors
        if (message && (
          message.includes('runtime.lastError') ||
          message.includes('message channel closed') ||
          message.includes('background page') ||
          message.includes('extensionAdapter') ||
          message.includes('sendMessageToTab') ||
          message.includes('invalid arguments') ||
          message.includes('Error in event handler')
        )) {
          return true; // Suppress the error
        }
        if (originalError) {
          return originalError(message, source, lineno, colno, error);
        }
        return false;
      };

      window.onunhandledrejection = (event) => {
        // Ignore browser extension promise rejection errors
        if (event.reason && (
          event.reason.message?.includes('message channel closed') ||
          event.reason.message?.includes('runtime.lastError') ||
          event.reason.message?.includes('extensionAdapter') ||
          event.reason.message?.includes('sendMessageToTab') ||
          event.reason.message?.includes('invalid arguments') ||
          event.reason.message?.includes('Error in event handler')
        )) {
          event.preventDefault();
          return;
        }
        if (originalUnhandledRejection) {
          originalUnhandledRejection(event);
        }
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Restore original error handlers
          window.onerror = originalError;
          window.onunhandledrejection = originalUnhandledRejection;
          setFilters(prev => ({
            ...prev,
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }));
        },
        (error) => {
          // Restore original error handlers
          window.onerror = originalError;
          window.onunhandledrejection = originalUnhandledRejection;
          // Only log actual geolocation errors, not extension errors
          if (error.code !== error.PERMISSION_DENIED && error.code !== error.POSITION_UNAVAILABLE) {
            console.warn('Geolocation error:', error);
          }
          setFilters(prev => ({
            ...prev,
            location: '',
            lat: null,
            lng: null
          }));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else if (filters.location !== 'Current Location' || !isNearestSort) {
      // Clear lat/lng when location is text-based or sort is not "Nearest to Me"
      setFilters(prev => ({
        ...prev,
        lat: null,
        lng: null
      }));
    }
  }, [filters.location, filters.sort]);

  // --- LOGIC ---
  const removeFilter = (key) => {
    setFilters(prev => ({
      ...prev,
      [key]: key === 'type' ? '' : key === 'rating' ? 'Any' : key === 'location' ? '' : '',
      ...(key === 'location' && { lat: null, lng: null })
    }));
  };

  // Handle pagination - use cursor-based pagination
  const handlePageChange = (newPage) => {
    if (newPage > page && hasMore) {
      // Load more data
      handleFetch(true);
    }
    setPage(newPage);
  };

  // For display, use current page's data (API returns 8 items per page)
  const itemsPerPage = 8;
  const currentData = venues.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(venues.length / itemsPerPage) + (hasMore ? 1 : 0);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Navbar onSearchSubmit={setGlobalSearch} initialSearch={globalSearch} />

      <div className="max-w-7xl mx-auto flex relative">
        <FilterSidebar 
            filters={filters} 
            setFilters={setFilters} 
            isOpen={isMobileSidebarOpen}
            onClose={() => setIsMobileSidebarOpen(false)}
        />

        <main className="flex-1 p-4 md:p-8 bg-gray-50/50 min-h-screen">
            
            {/* --- HEADER SECTION --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    {filters.location ? `Venues in ${filters.location}` : "All Venues"}
                </h1>
                
                <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                     {/* Mobile Filter Toggle */}
                    <button 
                        onClick={() => setIsMobileSidebarOpen(true)}
                        className="lg:hidden flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg font-bold text-sm shadow-sm"
                    >
                        <SlidersHorizontal size={16} /> Filters
                    </button>

                    {/* VIEW TOGGLE BUTTONS (FUNCTIONAL) */}
                    <div className="flex bg-gray-100/80 p-1 rounded-lg border border-gray-200">
                        <button 
                            onClick={() => setViewMode('List')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold transition-all ${
                                viewMode === 'List' 
                                ? 'bg-white text-slate-900 shadow-sm' 
                                : 'text-gray-500 hover:text-slate-700'
                            }`}
                        >
                            <List size={16} /> List
                        </button>
                        <button 
                            onClick={() => setViewMode('Map')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold transition-all ${
                                viewMode === 'Map' 
                                ? 'bg-white text-slate-900 shadow-sm' 
                                : 'text-gray-500 hover:text-slate-700'
                            }`}
                        >
                            <Map size={16} /> Map
                        </button>
                    </div>
                </div>
            </div>

            {/* --- ACTIVE FILTERS --- */}
            <div className="flex flex-wrap items-center gap-3 mb-6 pb-6 border-b border-gray-200">
                <span className="text-sm font-medium text-slate-500">Showing {venues.length} venues:</span>
                
                {filters.type && (
                    <button 
                        onClick={() => removeFilter('type')}
                        className="flex h-8 items-center gap-2 rounded-lg bg-emerald-100/50 text-emerald-700 pl-3 pr-2 text-sm font-semibold hover:bg-emerald-100 transition border border-emerald-100"
                    >
                        <span>⚽</span> {filters.type} <X size={14} className="opacity-60 hover:opacity-100" />
                    </button>
                )}
                {filters.rating !== 'Any' && filters.rating !== '' && (
                    <button 
                        onClick={() => removeFilter('rating')}
                        className="flex h-8 items-center gap-2 rounded-lg bg-white border border-gray-200 text-slate-600 pl-3 pr-2 text-sm font-medium hover:bg-gray-50 transition"
                    >
                        <span>⭐</span> {filters.rating}+ Stars <X size={14} className="text-gray-400 hover:text-red-500" />
                    </button>
                )}
                {(filters.priceMin || filters.priceMax) && (
                    <button 
                        onClick={() => setFilters(p => ({...p, priceMin: '', priceMax: ''}))}
                        className="flex h-8 items-center gap-2 rounded-lg bg-white border border-gray-200 text-slate-600 pl-3 pr-2 text-sm font-medium hover:bg-gray-50 transition"
                    >
                        <span>💰</span> ${filters.priceMin || 0} - ${filters.priceMax || 'Max'} <X size={14} className="text-gray-400 hover:text-red-500" />
                    </button>
                )}
            </div>

            {/* --- VENUE GRID --- */}
            <div className={`grid gap-4 md:gap-6 
                ${viewMode === 'Map' ? 'grid-cols-2' : 'grid-cols-1'} 
                md:grid-cols-2 xl:grid-cols-4`}
            >
                {loading ? (
                    Array(8).fill(null).map((_, i) => <VenueSkeleton key={`skeleton-${i}`} />)
                ) : (
                    currentData.length > 0 ? (
                        currentData.map((venue) => <VenueCard key={venue.id} venue={venue} />)
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400">
                            <div className="mb-4 text-6xl opacity-50">🏟️</div>
                            <p className="font-medium">No venues found matching your filters.</p>
                            <button 
                                onClick={() => setFilters({ sort: 'Best Match', location: '', type: '', priceMin: '', priceMax: '', rating: 'Any', lat: null, lng: null })}
                                className="mt-4 text-emerald-500 hover:underline text-sm font-bold"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )
                )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="col-span-full flex items-center justify-center py-8">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              </div>
            )}

       
            {/* Traditional Pagination (for loaded items) */}
            {!loading && venues.length > 0 && totalPages > 1 && (
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
            )}

        </main>
      </div>
    </div>
  );
};

export default Filterpage;

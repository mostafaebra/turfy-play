import React, { useState, useEffect, useRef, useCallback } from "react";
import AccHeader2 from "../../components/AccHeader2";
import SidebarFilters from "../../components/SidebarFilters";
import CompetitionCard from "../../components/CompetitionCard";
import { getAllCompetitions } from "../../services/competitionService";

export default function Competitions() {
  const [items, setItems] = useState([]); 
  const [cursor, setCursor] = useState(null); 
  const [hasMore, setHasMore] = useState(false); 
  const [loading, setLoading] = useState(false);
  
  const [filters, setFilters] = useState({
    searchTerm: "",
    location: "",
    sportTypes: [],
    competitionTypes: [],  
    minPrice: 0,
    maxPrice: 2000,
    limit: 10,
    cursor: null
  });

  const observer = useRef();
  const lastItemRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) fetchCompetitions(false);
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const fetchCompetitions = async (isNewSearch = false) => {
    setLoading(true);
    try {
      const payload = { ...filters, cursor: isNewSearch ? null : cursor };
      const data = await getAllCompetitions(payload);
      setItems(prev => isNewSearch ? data.items : [...prev, ...data.items]);
      setCursor(data.nextCursor);
      setHasMore(data.hasMore);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCompetitions(true); }, []);

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-display">
      { }
      <AccHeader2 
        searchValue={filters.searchTerm}
        onSearchChange={(val) => setFilters({...filters, searchTerm: val})}
        onSearchSubmit={() => fetchCompetitions(true)}
      />
      
      {
      }
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 flex flex-col lg:flex-row gap-8 lg:gap-10">
        
        { 
        }
        <aside className="w-full lg:w-1/4">
          <SidebarFilters 
            filters={filters} 
            setFilters={setFilters} 
            onApply={() => fetchCompetitions(true)} 
          />
        </aside>

        { 
        }
        <main className="w-full lg:w-3/4">
          { }
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h1 className="text-2xl md:text-3xl font-black text-[#1E293B]">Events & Competitions</h1>
            <span className="text-gray-400 font-bold text-xs md:text-sm bg-white px-4 py-2 rounded-full shadow-sm">
              Showing {items.length} results
            </span>
          </div>

          {
          }
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((comp, index) => (
              <div key={comp.id} ref={items.length === index + 1 ? lastItemRef : null}>
                <CompetitionCard data={comp} />
              </div>
            ))}
          </div>

          { }
          {loading && (
            <div className="flex flex-col items-center justify-center mt-12 gap-3">
              <div className="animate-spin w-10 h-10 border-4 border-[#22C55E] border-t-transparent rounded-full"></div>
              <p className="text-[#22C55E] font-bold text-sm">Loading amazing events...</p>
            </div>
          )}

          { }
          {!hasMore && items.length > 0 && !loading && (
            <p className="text-center text-gray-400 font-bold mt-12 border-t pt-6">
              You've seen all the competitions! 🏆
            </p>
          )}
        </main>
      </div>
    </div>
  );
}
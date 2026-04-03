import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/account/Sidebar';
import CompetitionTabs from '../../components/account/CompetitionTabs';
import CompetitionCard from '../../components/account/CompetitionCard';
import { fetchMyCompetitions } from '../../services/mycompitionapi';

const MyCompetitionsPage = () => {
    // Layout & Nav State
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Data States
    const [currentTab, setCurrentTab] = useState(0); 
    const [competitions, setCompetitions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    
    // Pagination state
    const [pagination, setPagination] = useState({
        nextCursorValue: null,
        nextCursorTieBreakerId: 0,
        hasMore: false
    });

    const loadData = useCallback(async (isLoadMore = false) => {
        try {
            if (isLoadMore) {
                setIsLoadingMore(true);
            } else {
                setIsLoading(true);
                setError(null);
                setCompetitions([]);
            }

            const data = await fetchMyCompetitions({
                tab: currentTab,
                lastCursorValue: isLoadMore ? pagination.nextCursorValue : null,
                lastId: isLoadMore ? pagination.nextCursorTieBreakerId : 0,
                limit: 10
            });

            setCompetitions(prev => isLoadMore ? [...prev, ...data.items] : data.items);
            
            setPagination({
                nextCursorValue: data.nextCursorValue,
                nextCursorTieBreakerId: data.nextCursorTieBreakerId,
                hasMore: data.hasMore
            });

        } catch (err) {
            if (err.response && err.response.status === 401) {
                setError("Please log in to view your competitions.");
            } else {
                setError(err.message || "Something went wrong while fetching competitions.");
            }
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    }, [currentTab, pagination.nextCursorValue, pagination.nextCursorTieBreakerId]);

    useEffect(() => {
        loadData(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentTab]);

    return (
        <div>
            <Navbar />
            <div className="flex min-h-screen bg-light-gray font-display text-text-dark">
                {/* Ensure activeTab matches the ID you set in Sidebar.jsx */}
                <Sidebar activeTab="competitions" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)}/>

                <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    
                    {/* Page Heading & Mobile Menu Toggle */}
                    <div className="flex flex-col gap-2 mb-8">
                        <div className="flex items-center gap-3">
                            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 -ml-2 text-slate-900 hover:bg-white rounded-lg transition-colors">
                                <span className="material-symbols-outlined text-2xl">menu</span>
                            </button>
                            <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight text-slate-900">
                                My Competitions
                            </h1>
                        </div>
                        <p className="text-slate-500 md:ml-0 ml-10">
                            Track your progress and upcoming matches in all your registered tournaments.
                        </p>
                    </div>

                    {/* Tabs Filter */}
                    <CompetitionTabs currentTab={currentTab} onTabChange={setCurrentTab} />

                    {/* Status Messages */}
                    {error && (
                        <div className="p-4 mb-6 text-red-600 bg-red-100 rounded-xl border border-red-200">
                            <p className="font-semibold text-sm">Error: {error}</p>
                        </div>
                    )}

                    {/* Loading State */}
                    {isLoading && !isLoadingMore && (
                        <div className="flex justify-center items-center py-12">
                             <span className="material-symbols-outlined animate-spin text-emerald-600 text-4xl">
                                progress_activity
                             </span>
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading && competitions.length === 0 && !error && (
                        <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-xl border border-gray-200 shadow-sm">
                            <span className="material-symbols-outlined text-5xl text-gray-300 mb-2">sports_score</span>
                            <h3 className="text-lg font-bold text-slate-700">No competitions found</h3>
                            <p className="text-gray-500 text-sm mt-1">You haven't registered for any tournaments in this category yet.</p>
                        </div>
                    )}

                    {/* List and Pagination */}
                    {!isLoading && competitions.length > 0 && (
                        <div className="flex flex-col gap-6">
                            {competitions.map((comp) => (
                                <CompetitionCard key={comp.competitionId} competition={comp} />
                            ))}

                            {pagination.hasMore && (
                                <button 
                                    onClick={() => loadData(true)}
                                    disabled={isLoadingMore}
                                    className="w-full py-3 mt-4 text-sm font-bold text-slate-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                                >
                                    {isLoadingMore ? (
                                        <>
                                            <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                                            Loading...
                                        </>
                                    ) : 'Load More Tournaments'}
                                </button>
                            )}
                        </div>
                    )}

                </main>
            </div>
        </div>
    );
};

export default MyCompetitionsPage;
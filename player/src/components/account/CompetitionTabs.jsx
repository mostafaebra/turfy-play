import React from 'react';

/**
 * Renders the filter tabs for the competitions page.
 * @param {Object} props
 * @param {number} props.currentTab - The currently active tab (0, 1, or 2).
 * @param {Function} props.onTabChange - Callback fired when a tab is clicked.
 */
const CompetitionTabs = ({ currentTab, onTabChange }) => {
    const tabs = [
        { id: 0, label: 'All Tournaments' },
        { id: 1, label: 'Active' },
        { id: 2, label: 'Completed' }
    ];

    return (
        <div className="flex border-b border-gray-200 mb-6">
            {tabs.map((tab) => {
                const isActive = currentTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`flex-1 pb-4 text-center font-bold text-sm border-b-2 transition-colors ${
                            isActive
                                ? 'border-emerald-500 text-emerald-600' // Active underline style
                                : 'border-transparent text-gray-500 hover:text-gray-700' // Inactive style
                        }`}
                    >
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
};

export default CompetitionTabs;
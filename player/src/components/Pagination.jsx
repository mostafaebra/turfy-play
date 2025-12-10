import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Helper to generate the page numbers to display
  // Junior thought: This logic keeps [1, 2, 3] visible + the last page
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 4; // Show 1, 2, 3, 4 then ...
    
    // Always show first few pages
    for (let i = 1; i <= Math.min(totalPages, maxVisiblePages); i++) {
        pages.push(i);
    }
    
    // If we have way more pages, show dots and the last one
    if (totalPages > maxVisiblePages) {
        if (totalPages > maxVisiblePages + 1) {
            pages.push('...');
        }
        pages.push(totalPages);
    }
    
    return pages;
  };

  const pages = getPageNumbers();

  // Styles for the buttons
  const baseBtnStyle = "px-3 py-2 border border-gray-200 rounded-md text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed";
  const activeBtnStyle = "bg-emerald-500 text-white border-emerald-500 hover:bg-emerald-600";

  return (
    <div className="flex items-center justify-center gap-2 mt-12 flex-wrap">
      {/* First Page << */}
      <button 
        onClick={() => onPageChange(1)} 
        disabled={currentPage === 1}
        className={baseBtnStyle}
      >
        &lt;&lt;
      </button>

      {/* Previous < */}
      <button 
        onClick={() => onPageChange(currentPage - 1)} 
        disabled={currentPage === 1}
        className={baseBtnStyle}
      >
        &lt;
      </button>

      {/* Page Numbers */}
      {pages.map((p, index) => (
        <React.Fragment key={index}>
            {p === '...' ? (
                <span className="px-2 text-gray-400">...</span>
            ) : (
                <button 
                    onClick={() => onPageChange(p)}
                    className={`${baseBtnStyle} ${currentPage === p ? activeBtnStyle : 'bg-white text-gray-700'}`}
                >
                    {p}
                </button>
            )}
        </React.Fragment>
      ))}

      {/* Next > */}
      <button 
        onClick={() => onPageChange(currentPage + 1)} 
        disabled={currentPage === totalPages}
        className={baseBtnStyle}
      >
        &gt;
      </button>

      {/* Last Page >> */}
      <button 
        onClick={() => onPageChange(totalPages)} 
        disabled={currentPage === totalPages}
        className={baseBtnStyle}
      >
        &gt;&gt;
      </button>
    </div>
  );
};

export default Pagination;
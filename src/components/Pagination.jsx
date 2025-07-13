'use client';

export default function Pagination({ links, meta, onPageChange }) {
  const currentPage = meta?.current_page || 1;
  const lastPage = meta?.last_page || 1;

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(lastPage, startPage + maxVisible - 1);
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => {
            const url = links.first.replace(/page%5Bnumber%5D=\d+/, `page%5Bnumber%5D=${i}`);
            onPageChange(url);
          }}
          className={`px-3 py-1 rounded-lg mx-1 ${
            currentPage === i
              ? 'bg-orange-500 text-white font-bold'
              : 'bg-white text-gray-900 hover:bg-orange-500/70 hover:text-white hover:font-bold'
          }`}
        >
          {i}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="flex justify-center mt-8">
      <div className="flex items-center gap-1">
        {/* First Page */}
        <button
          onClick={() => onPageChange(links.first)}
          disabled={!links.prev}
          className={`px-3 py-1 rounded-lg  ${
            !links.prev
              ? 'opacity-50 cursor-not-allowed bg-gray-200 text-gray-400'
              : 'bg-white text-gray-900 hover:bg-orange-500/70 hover:text-white font-semibold'
          }`}
        >
          &lt;&lt;
        </button>

        {/* Previous Page */}
        <button
          onClick={() => onPageChange(links.prev)}
          disabled={!links.prev}
          className={`px-3 py-1 rounded-lg  ${
            !links.prev
              ? 'opacity-50 cursor-not-allowed bg-gray-200 text-gray-400'
              : 'bg-white text-gray-900 hover:bg-orange-500/70 hover:text-white font-semibold'
          }`}
        >
          &lt;
        </button>

        {/* Page Numbers */}
        {renderPageNumbers()}

        {/* Next Page */}
        <button
          onClick={() => onPageChange(links.next)}
          disabled={!links.next}
          className={`px-3 py-1 rounded-lg  ${
            !links.next
              ? 'opacity-50 cursor-not-allowed bg-gray-200 text-gray-400'
              : 'bg-white text-gray-900 hover:bg-orange-500/70 hover:text-white font-semibold'
          }`}
        >
          &gt;
        </button>

        {/* Last Page */}
        <button
          onClick={() => onPageChange(links.last)}
          disabled={currentPage === lastPage}
          className={`px-3 py-1 rounded-lg  ${
            currentPage === lastPage
              ? 'opacity-50 cursor-not-allowed bg-gray-200 text-gray-400'
              : 'bg-white text-gray-900 hover:bg-orange-500/70 hover:text-white font-semibold'
          }`}
        >
          &gt;&gt;
        </button>
      </div>
    </div>
  );

}

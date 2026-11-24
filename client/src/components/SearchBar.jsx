import { Search, X } from "lucide-react";
import { useEffect, useRef } from "react";

const SearchBar = ({
  searchRef,
  showSearch,
  searchValue,
  setSearchValue,
  setShowSearch,
  handleKeyDown,
}) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (showSearch) {
      inputRef.current?.focus();
    }
  }, [showSearch]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search products"
      aria-hidden={!showSearch}
      className={`pointer-events-auto fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20 sm:pt-28 p-4 transition-all duration-300 ${
        showSearch
          ? "opacity-100 visible"
          : "opacity-0 invisible pointer-events-none"
      }`}>
      <div
        ref={searchRef}
        className={`bg-white rounded-2xl shadow-2xl border border-gray-200/80 w-full max-w-2xl p-4 sm:p-5 transform transition-all duration-300 ${
          showSearch
            ? "scale-100 translate-y-0 opacity-100"
            : "scale-95 -translate-y-2 opacity-0"
        }`}>
        <div className="relative flex items-center">
          <Search
            className="absolute left-4 text-gray-400 pointer-events-none"
            size={20}
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            type="search"
            placeholder="Search for shirts, trousers, shoes..."
            className="w-full pl-12 pr-10 py-3.5 text-base sm:text-lg text-gray-800 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {searchValue && (
            <button
              type="button"
              onClick={() => setSearchValue("")}
              aria-label="Clear search"
              className="absolute right-3 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200/70 transition-colors">
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="flex justify-between items-center mt-3 px-1 text-xs text-gray-500">
          <span>
            Press{" "}
            <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-gray-700 font-sans">
              Enter
            </kbd>{" "}
            to search or{" "}
            <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-gray-700 font-sans">
              Esc
            </kbd>{" "}
            to close
          </span>
          <button
            type="button"
            onClick={() => setShowSearch(false)}
            className="font-medium text-gray-600 hover:text-gray-900 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;

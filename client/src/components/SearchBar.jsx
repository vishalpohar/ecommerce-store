import { Search } from "lucide-react";

const SearchBar = ({
  searchRef,
  showSearch,
  searchValue,
  setSearchValue,
  setShowSearch,
  handleKeyDown,
}) => {
  return (
    <div
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${showSearch ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
      <div
        ref={searchRef}
        className={`bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 transform transition-all duration-300 ${showSearch ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="search"
            placeholder="Search for products, brands, and more..."
            className="w-full pl-12 pr-4 py-4 text-lg text-gray-700 outline-none ring-2 focus:ring-blue-500 bg-gray-50 rounded-xl"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </div>
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-gray-500">Press Enter to search</span>
          <button
            onClick={() => setShowSearch(false)}
            aria-label="Cancel"
            className="text-sm text-gray-500 hover:text-gray-700">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;

import { Search } from "lucide-react";

const EmptySearchPage = ({ query }) => (
  <div className="min-h-[90vh] text-center py-16">
    <div className="max-w-md mx-auto">
      <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
        <Search className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No products found
      </h3>
      <p className="text-gray-600 mb-6">
        We couldn't find any products matching "{query}". Try checking the
        spelling or using different keywords.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => window.history.back()}
          aria-label="Go Back"
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 transition-colors font-medium">
          Go Back
        </button>
        <a
          href="/"
          className="px-6 py-3 text-gray-700 border border-gray-300 rounded-xl hover:border-gray-400 transition-colors font-medium">
          Browse Categories
        </a>
      </div>
    </div>
  </div>
);

export default EmptySearchPage;

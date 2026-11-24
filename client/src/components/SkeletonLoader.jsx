const SkeletonLoader = () => {
  return (
    <div
      aria-hidden="true"
      className="flex flex-col h-full bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
      {/* Image Placeholder */}
      <div className="aspect-[4/3] w-full shimmer" />

      {/* Content Placeholders */}
      <div className="flex flex-col flex-1 p-3.5 sm:p-4">
        <div className="space-y-2.5 flex-1">
          <div className="h-3 w-1/3 shimmer rounded-md" />
          <div className="h-4 w-5/6 shimmer rounded-md" />
          <div className="h-4 w-2/3 shimmer rounded-md" />
          <div className="h-3 w-1/4 shimmer rounded-md pt-1" />
        </div>

        {/* Price & Action Row */}
        <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100">
          <div className="h-5 w-20 shimmer rounded-md" />
          <div className="w-8 h-8 sm:w-9 sm:h-9 shimmer rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;

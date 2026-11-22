const SkeletonLoader = () => {
  return (
    <div className="border shadow rounded-md p-4 w-full mx-auto">
      <div className="flex space-x-4">
        <div className="flex-1 space-y-6 py-1">
          <div className="h-40 shimmer rounded"></div>
          <div className="space-y-3">
            <div className="h-4 w-2/4 shimmer rounded"></div>
            <div className="h-4 w-3/4 shimmer rounded"></div>
            <div className="h-4 shimmer rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;

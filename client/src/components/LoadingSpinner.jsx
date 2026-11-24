const LoadingSpinner = () => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="min-h-screen bg-gradient-to-b from-gray-50/80 to-white flex flex-col items-center justify-center px-4">
      {/* Orbital Ring + Brand Monogram */}
      <div className="relative flex items-center justify-center w-20 h-20">
        {/* Outer spinning arc */}
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full border-2 border-gray-200 border-t-gray-900 border-r-blue-600 animate-spin"
        />
        {/* Inner counter-spinning arc */}
        <span
          aria-hidden="true"
          className="absolute inset-2.5 rounded-full border-2 border-transparent border-b-blue-600/70 border-l-gray-400/50 animate-spin-reverse"
        />
        {/* Brand Initial */}
        <span
          aria-hidden="true"
          className="font-serif font-extrabold text-xl text-gray-900 tracking-tight">
          E
        </span>
      </div>

      {/* Brand Wordmark & Sweeping Bar */}
      <div className="mt-5 flex flex-col items-center gap-2.5">
        <span className="font-serif font-bold text-lg text-gray-900 tracking-tight">
          EasyBuy
        </span>
        <div className="w-28 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full w-1/2 bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 rounded-full animate-loading-bar" />
        </div>
      </div>

      <span className="sr-only">Loading EasyBuy...</span>
    </div>
  );
};

export const ThreeDotsLoader = ({ height = "80", color = "#111827" }) => {
  const numericHeight = Number(height);
  const minHeightStyle =
    !Number.isNaN(numericHeight) && numericHeight > 0
      ? { minHeight: `${numericHeight}vh` }
      : undefined;

  return (
    <div
      role="status"
      aria-live="polite"
      style={minHeightStyle}
      className="flex justify-center items-center py-4">
      <div className="flex items-center gap-1.5" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              backgroundColor: color,
              animationDelay: `${i * 140}ms`,
            }}
            className="w-2.5 h-2.5 rounded-full animate-dot-wave"
          />
        ))}
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;

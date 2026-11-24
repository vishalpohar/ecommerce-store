const CustomTooltip = ({ active, payload, label, showSales }) => {
  if (!active || !payload?.length) return null;

  const sales = payload.find((p) => p.dataKey === "sales")?.value || 0;
  const revenue = payload.find((p) => p.dataKey === "revenue")?.value || 0;

  return (
    <div className="bg-white/95 backdrop-blur-xs p-3.5 border border-gray-200/80 rounded-xl shadow-lg min-w-[150px]">
      <p className="text-xs font-semibold text-gray-900 pb-2 mb-2 border-b border-gray-100">
        {label}
      </p>

      <div className="space-y-1.5 text-xs">
        {showSales && (
          <div className="flex items-center justify-between gap-4">
            <span className="inline-flex items-center gap-1.5 text-gray-500">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              Sales
            </span>
            <span className="font-semibold text-gray-900 tabular-nums">
              {sales.toLocaleString("en-IN")}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between gap-4">
          <span className="inline-flex items-center gap-1.5 text-gray-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Revenue
          </span>
          <span className="font-semibold text-gray-900 tabular-nums">
            ₹{revenue.toLocaleString("en-IN")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CustomTooltip;

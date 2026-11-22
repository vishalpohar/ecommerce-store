import formatDate from "../../utils/formatDate";

const CustomTooltip = ({ active, payload, label, showSales }) => {
  if (active && payload && payload.length) {
    const sales = payload.find((p) => p.dataKey === "sales")?.value || 0;
    const revenue = payload.find((p) => p.dataKey === "revenue")?.value || 0;

    return (
      <div
        className="bg-white p-3 border border-gray-200 rounded-xl shadow-md"
        style={{ minWidth: 140 }}>
        <p className="text-sm font-semibold text-gray-800 mb-1">
          {formatDate(label)}
        </p>
        {showSales && (
          <p className="text-xs text-blue-600">
            Sales: <span className="font-semibold text-gray-900">{sales}</span>
          </p>
        )}
        <p className="text-xs text-green-600">
          Revenue:{" "}
          <span className="font-semibold text-gray-900">
            ₹{revenue.toLocaleString()}
          </span>
        </p>
      </div>
    );
  }

  return null;
};

export default CustomTooltip;

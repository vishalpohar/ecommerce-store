import { IndianRupee, Package, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import axios from "../../api/axios";
import formatDate from "../../utils/formatDate";
import { ThreeDotsLoader } from "../LoadingSpinner";
import AnalyticsCard from "./AnalyticsCard";
import CustomTooltip from "./CustomTooltip";

const TIME_RANGES = [
  { value: "7d", label: "7 Days" },
  { value: "30d", label: "30 Days" },
  { value: "90d", label: "90 Days" },
];

const AnalyticsTab = () => {
  const [analyticsData, setAnalyticsData] = useState({
    products: 0,
    totalSales: 0,
    totalRevenue: 0,
  });
  const [dailySalesData, setDailySalesData] = useState([]);
  const [timeRange, setTimeRange] = useState("7d");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    const fetchAnalyticsData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/analytics?range=${timeRange}`);
        if (isCancelled) return;

        setAnalyticsData(response.data.analyticsData);
        const formattedData = response.data.dailySalesData.map((item) => ({
          ...item,
          date: formatDate(item.date),
        }));
        setDailySalesData(formattedData);
      } catch (error) {
        if (!isCancelled) {
          console.error("Error fetching analytics data:", error);
        }
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };

    fetchAnalyticsData();
    return () => {
      isCancelled = true;
    };
  }, [timeRange]);

  const analyticsCardData = [
    {
      id: "TOTAL_PRODUCTS",
      title: "Total Products",
      value: (analyticsData.products || 0).toLocaleString("en-IN"),
      icon: Package,
      color: "blue",
    },
    {
      id: "TOTAL_SALES",
      title: "Total Sales",
      value: (analyticsData.totalSales || 0).toLocaleString("en-IN"),
      change: "+18.3%",
      icon: ShoppingCart,
      color: "amber",
    },
    {
      id: "TOTAL_REVENUE",
      title: "Total Revenue",
      value: `₹${(analyticsData.totalRevenue || 0).toLocaleString("en-IN")}`,
      change: "+22.7%",
      icon: IndianRupee,
      color: "emerald",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">
            Store Overview
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Sales velocity and revenue trends for the selected period.
          </p>
        </div>

        {/* Segmented Time Range Selector */}
        <div
          role="group"
          aria-label="Select analytics time range"
          className="inline-flex self-start sm:self-auto p-1 rounded-xl bg-gray-100 border border-gray-200/80">
          {TIME_RANGES.map(({ value, label }) => {
            const isActive = timeRange === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setTimeRange(value)}
                aria-pressed={isActive}
                className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-white text-gray-900 shadow-2xs"
                    : "text-gray-500 hover:text-gray-800"
                }`}>
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {isLoading ? (
        <ThreeDotsLoader height="45" />
      ) : (
        <>
          {/* KPI Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            {analyticsCardData.map((data) => (
              <AnalyticsCard
                key={data.id}
                title={data.title}
                value={data.value}
                change={data.change}
                icon={data.icon}
                color={data.color}
              />
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Sales & Revenue Line Chart */}
            <section
              aria-label="Sales and revenue chart"
              className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-5 sm:p-6">
              <div className="mb-5">
                <h3 className="text-base font-semibold text-gray-900">
                  Sales &amp; Revenue
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Daily order volume vs. revenue generated
                </p>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={dailySalesData}
                  margin={{ top: 5, right: 12, left: -10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis
                    dataKey="date"
                    stroke="#9ca3af"
                    tick={{ fill: "#6b7280", fontSize: 11 }}
                    angle={-25}
                    textAnchor="end"
                  />
                  <YAxis
                    stroke="#9ca3af"
                    tick={{ fill: "#6b7280", fontSize: 11 }}
                  />
                  <Tooltip content={<CustomTooltip showSales />} />
                  <Legend
                    verticalAlign="bottom"
                    wrapperStyle={{ paddingTop: 20, fontSize: 12 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5, stroke: "#2563eb", strokeWidth: 2 }}
                    name="Sales"
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5, stroke: "#10b981", strokeWidth: 2 }}
                    name="Revenue (₹)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </section>

            {/* Revenue Bar Chart */}
            <section
              aria-label="Revenue trend chart"
              className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-5 sm:p-6">
              <div className="mb-5">
                <h3 className="text-base font-semibold text-gray-900">
                  Revenue Trend
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Daily revenue breakdown in INR
                </p>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={dailySalesData}
                  margin={{ top: 5, right: 12, left: -10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis
                    dataKey="date"
                    stroke="#9ca3af"
                    tick={{ fill: "#6b7280", fontSize: 11 }}
                    angle={-25}
                    textAnchor="end"
                  />
                  <YAxis
                    stroke="#9ca3af"
                    tick={{ fill: "#6b7280", fontSize: 11 }}
                  />
                  <Tooltip content={<CustomTooltip showSales={false} />} />
                  <Bar
                    dataKey="revenue"
                    fill="#6366f1"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={40}
                    name="Revenue (₹)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </section>
          </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsTab;

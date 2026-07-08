import { useEffect, useRef, useState } from "react";
import axios from "../../api/axios";
import { Package, ShoppingCart, BarChart3, IndianRupee } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

import { ThreeDotsLoader } from "../LoadingSpinner";
import AnalyticsCard from "./AnalyticsCard";
import CustomTooltip from "./CustomTooltip";

import formatDate from "../../utils/formatDate";

const AnalyticsTab = () => {
  const [analyticsData, setAnalyticsData] = useState({
    products: 0,
    totalSales: 0,
    totalRevenue: 0,
  });
  const [dailySalesData, setDailySalesData] = useState([]);
  const [timeRange, setTimeRange] = useState("7d");
  
  const isFetchingAnalyticsData = useRef(false);
  

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      if (isFetchingAnalyticsData.current) return;

      isFetchingAnalyticsData.current = true;
      try {
        const response = await axios.get(`/analytics?range=${timeRange}`);
        setAnalyticsData(response.data.analyticsData);
        const formattedData = response.data.dailySalesData.map((item) => ({
          ...item,
          date: formatDate(item.date),
        }));
        setDailySalesData(formattedData);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        isFetchingAnalyticsData.current = false;
      }
    };

    fetchAnalyticsData();
  }, [timeRange]);

  const analyticsCardData = [
    {
      id: "TOTAL_PRODUCTS",
      title: "Total Products",
      value: analyticsData.products.toLocaleString(),
      icon: Package,
      color: "gray",
    },
    {
      id: "TOTAL_SALES",
      title: "Total Sales",
      value: analyticsData.totalSales.toLocaleString(),
      change: "+18.3%",
      icon: ShoppingCart,
      color: "orange",
    },
    {
      id: "TOTAL_REVENUE",
      title: "Total Revenue",
      value: `₹${analyticsData.totalRevenue.toLocaleString()}`,
      change: "+22.7%",
      icon: IndianRupee,
      color: "green",
    },
  ];

  if (isFetchingAnalyticsData.current) {
    return <ThreeDotsLoader height="60" />;
  }

  return (
    <div className="min-h-[90vh] flex flex-col gap-6">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BarChart3 className="w-4 h-4 md:w-6 md:h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="md:text-2xl font-semibold text-gray-900">
              Analytics Dashboard
            </h2>
            <p className="text-gray-600 text-xs md:text-base">
              Track your store performance
            </p>
          </div>
        </div>

        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border text-gray-700 text-xs md:text-base border-gray-300 rounded-xl outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200">
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white shadow-sm rounded-2xl border border-gray-300 p-6 transition-all duration-500">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Sales & Revenue
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailySalesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis
                dataKey="date"
                stroke="#6b7280"
                angle={-25}
                textAnchor="end"
                fontSize={10}
              />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip content={<CustomTooltip showSales={true} />} />
              <Legend
                verticalAlign="bottom"
                wrapperStyle={{ paddingTop: 20 }}
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2 }}
                name="Sales"
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#16a34a"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, stroke: "#10b981", strokeWidth: 2 }}
                name="Revenue (₹)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all duration-500">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Revenue Trend
          </h3>
          <ResponsiveContainer width="100%" height={300} paddingBottom={10}>
            <BarChart
              data={dailySalesData}
              margin={{ top: 10, right: 30, left: 0, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis
                dataKey="date"
                stroke="#6b7280"
                angle={-25}
                textAnchor="end"
                fontSize={10}
              />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip content={<CustomTooltip showSales={false} />} />
              <Bar
                dataKey="revenue"
                fill="#7c3aed"
                radius={[4, 4, 0, 0]}
                name="Revenue (₹)"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;

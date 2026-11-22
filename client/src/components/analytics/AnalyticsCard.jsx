import { TrendingUp } from "lucide-react";

const borderClasses = {
  blue: "border-blue-600",
  green: "border-green-600",
  gray: "border-gray-600",
  orange: "border-orange-600",
};

const textColorClasses = {
  blue: "text-blue-600",
  green: "text-green-600",
  gray: "text-gray-600",
  orange: "text-orange-600",
};

const AnalyticsCard = ({ title, value, change, icon: Icon, color }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-300 p-4 md:p-6 relative overflow-hidden transform transition-all duration-1000">
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 border ${borderClasses[color]} rounded-xl`}>
            <Icon
              className={`w-4 h-4 md:w-6 md:h-6 ${textColorClasses[color]}`}
            />
          </div>
          {change && (
            <div className="flex items-center gap-1 text-sm font-medium text-green-600">
              <TrendingUp className="w-3 h-3 md:w-4 md:h-4" />
              {change}
            </div>
          )}
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
          {value}
        </h3>
        <p className="text-gray-600 text-sm">{title}</p>
      </div>
    </div>
  );
};

export default AnalyticsCard;

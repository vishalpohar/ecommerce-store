import { TrendingUp } from "lucide-react";

const COLOR_STYLES = {
  blue: "bg-blue-50 text-blue-600 ring-blue-600/15",
  emerald: "bg-emerald-50 text-emerald-600 ring-emerald-600/15",
  amber: "bg-amber-50 text-amber-600 ring-amber-600/15",
  gray: "bg-gray-100 text-gray-600 ring-gray-600/15",
};

const AnalyticsCard = ({
  title,
  value,
  change,
  icon: Icon,
  color = "blue",
}) => {
  return (
    <article className="bg-white rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-sm transition-shadow duration-200 p-5">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div
          className={`p-2.5 rounded-xl ring-1 ring-inset ${
            COLOR_STYLES[color] || COLOR_STYLES.blue
          }`}>
          <Icon className="w-5 h-5" aria-hidden="true" />
        </div>

        {change && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
            <TrendingUp className="w-3 h-3" aria-hidden="true" />
            {change}
          </span>
        )}
      </div>

      <p className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight tabular-nums">
        {value}
      </p>
      <p className="text-xs sm:text-sm text-gray-500 mt-1">{title}</p>
    </article>
  );
};

export default AnalyticsCard;

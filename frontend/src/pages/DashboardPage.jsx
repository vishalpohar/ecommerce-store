import { BarChart, PlusCircle, ShoppingBasket } from "lucide-react";
import { useState } from "react";

import AddProductForm from "../components/AddProductForm";
import ProductsList from "../components/ProductsList";
import AnalyticsTab from "../components/analytics/AnalyticsTab";

const tabs = [
  { id: "add", label: "Add Product", icon: PlusCircle },
  { id: "products", label: "Manage Products", icon: ShoppingBasket },
  { id: "analytics", label: "Analytics", icon: BarChart },
];

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("add");

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-700">
              Seller Dashboard
            </h1>
            <p className="text-gray-600 text-sm md:text-base mt-2">
              Manage your store efficiently
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              aria-label={`Open ${tab.label}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 md:px-6 py-3 rounded-full text-xs md:text-base font-medium border-2 transition-all duration-200 ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-800 shadow-lg shadow-blue-500/25"
                  : "bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:text-blue-600"
              }`}>
              <tab.icon className="hidden md:block w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div key={activeTab}>
          {activeTab === "add" && <AddProductForm />}
          {activeTab === "products" && <ProductsList />}
          {activeTab === "analytics" && <AnalyticsTab />}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;

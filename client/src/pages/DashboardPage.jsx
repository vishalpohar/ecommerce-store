import { BarChart3, Package, PlusCircle, Store } from "lucide-react";
import { lazy, Suspense, useState } from "react";

import AddProductForm from "../components/AddProductForm";

// Lazy load heavier views for faster initial page load
const ProductsList = lazy(() => import("../components/ProductsList"));
const AnalyticsTab = lazy(() => import("../components/analytics/AnalyticsTab"));

const NAV_ITEMS = [
  {
    id: "add",
    label: "Add Product",
    description: "Create a new product listing for your store",
    icon: PlusCircle,
  },
  {
    id: "products",
    label: "Inventory",
    description: "Manage stock, pricing, and active listings",
    icon: Package,
  },
  {
    id: "analytics",
    label: "Analytics",
    description: "Track sales, revenue, and store performance",
    icon: BarChart3,
  },
];

const TabFallback = () => (
  <div
    role="status"
    aria-live="polite"
    className="flex items-center justify-center h-64 rounded-2xl border border-gray-200/80 bg-white/70 text-sm text-gray-500">
    Loading section...
  </div>
);

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState("add");

  const currentTab = NAV_ITEMS.find((item) => item.id === activeTab);

  return (
    <div className="min-h-screen bg-gray-50/70 pt-6 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          {/* Left Floating Sidebar (Desktop) */}
          <aside
            aria-label="Seller dashboard navigation"
            className="hidden lg:flex flex-col w-64 shrink-0 sticky top-28 bg-white/80 backdrop-blur-md border border-gray-200/80 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center gap-3 px-3 pb-4 mb-3 border-b border-gray-100">
              <div>
                <h2 className="font-bold text-gray-700 leading-tight">
                  Seller Dashboard
                </h2>
                <p className="text-xs text-gray-500">Store management</p>
              </div>
            </div>

            <nav aria-label="Dashboard sections" className="space-y-1">
              {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
                const isActive = activeTab === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveTab(id)}
                    aria-current={isActive ? "page" : undefined}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-blue-50 text-blue-700 shadow-2xs"
                        : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-900"
                    }`}>
                    <Icon
                      aria-hidden="true"
                      className={`w-5 h-5 shrink-0 ${
                        isActive ? "text-blue-600" : "text-gray-400"
                      }`}
                    />
                    <span>{label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Right Main Workspace */}
          <main className="flex-1 w-full min-w-0">
            {/* Mobile / Tablet Pill Navigation (avoids clashing with Navbar's menu) */}
            <div className="flex items-center gap-3 px-1 pb-4 mb-3 border-b border-gray-100">
              <div>
                <h2 className="font-bold text-gray-700 leading-tight">
                  Seller Dashboard
                </h2>
                <p className="text-xs text-gray-500">Store management</p>
              </div>
            </div>
            <nav
              aria-label="Dashboard sections"
              className="flex lg:hidden items-center gap-2 overflow-x-auto pb-2 mb-5">
              {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
                const isActive = activeTab === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveTab(id)}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                      isActive
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
                    }`}>
                    <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>{label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Section Header */}
            <header className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-800 tracking-tight">
                {currentTab?.label}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {currentTab?.description}
              </p>
            </header>

            {/* Active View Content */}
            <section
              aria-label={currentTab?.label}
              className="bg-white/80 backdrop-blur-xs border border-gray-200/80 rounded-2xl p-4 sm:p-6 shadow-xs">
              <Suspense fallback={<TabFallback />}>
                {activeTab === "add" && <AddProductForm />}
                {activeTab === "products" && <ProductsList />}
                {activeTab === "analytics" && <AnalyticsTab />}
              </Suspense>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;

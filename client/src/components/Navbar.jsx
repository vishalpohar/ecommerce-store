import {
  Handbag,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Search,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import { useUserStore } from "../stores/useUserStore";
import SearchBar from "./SearchBar";

const navLinks = [
  {
    id: "DASHBOARD",
    name: "Dashboard",
    path: "/seller",
    icon: LayoutDashboard,
    sellerOnly: true,
  },
  {
    id: "YOUR_BAG",
    name: "Your Bag",
    path: "/cart",
    icon: Handbag,
    showCount: true,
  },
  {
    id: "WISHLIST",
    name: "Wishlist",
    path: "/wishlist",
    icon: Heart,
  },
  {
    id: "ORDERS",
    name: "Orders",
    path: "/orders",
    icon: Package,
  },
];

const getDisplayName = (name) => {
  if (!name) return "User";
  return name.charAt(0).toUpperCase() + name.slice(1);
};

const Navbar = () => {
  const { user, logout } = useUserStore();
  const isSeller = user?.role === "seller";
  const { cart } = useCartStore();

  const [isMobileMenu, setIsMobileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const toggleMobileMenu = () => setIsMobileMenu((prev) => !prev);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (searchValue.trim() !== "") {
        navigate(`/search?query=${encodeURIComponent(searchValue.trim())}`);
        setShowSearch(false);
        setSearchValue("");
      } else {
        toast.error("Please enter a search term");
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setShowSearch(false);
        setIsMobileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <header className="fixed top-4 left-0 w-full z-50 px-3 lg:px-6 pointer-events-none">
      {/* Main Floating Pill Navbar */}
      <nav
        aria-label="Primary navigation"
        className="pointer-events-auto max-w-7xl mx-auto px-4 md:px-6 bg-white/80 text-gray-700 backdrop-blur-md border border-gray-200/80 shadow-sm rounded-full">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-gray-900 text-xl lg:text-2xl font-serif tracking-tight font-extrabold hover:opacity-80 transition-opacity">
            EasyBuy
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center">
            {user && (
              <ul className="flex items-center gap-8">
                {navLinks.map((link) => {
                  if (link.sellerOnly && !isSeller) return null;

                  return (
                    <li key={link.id}>
                      <NavLink
                        to={link.path}
                        className={({ isActive }) =>
                          `relative inline-flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 ${
                            isActive
                              ? "text-blue-600 font-semibold"
                              : "text-gray-600 hover:text-gray-900"
                          }`
                        }>
                        {link.name}
                        {link.showCount && cart.length > 0 && (
                          <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 text-[11px] font-semibold text-white bg-gray-900 rounded-full">
                            {cart.length}
                          </span>
                        )}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Search Trigger */}
            <button
              type="button"
              onClick={() => setShowSearch(true)}
              aria-label="Open Search"
              className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200">
              <Search className="w-5 h-5" aria-hidden="true" />
            </button>

            {/* Desktop User Actions */}
            <div className="hidden lg:flex items-center gap-2">
              {user ? (
                <>
                  <div className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-gray-100/80 border border-gray-200/70">
                    <div className="w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center">
                      <UserRound className="w-3.5 h-3.5" aria-hidden="true" />
                    </div>
                    <span className="text-sm font-medium text-gray-800">
                      {getDisplayName(user.name)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={logout}
                    aria-label="Log out"
                    className="relative group p-2 rounded-full text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors duration-200">
                    <LogOut className="w-5 h-5" aria-hidden="true" />
                    <span className="pointer-events-none absolute top-11 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2.5 py-1 rounded-md opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 whitespace-nowrap">
                      Log out
                    </span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-blue-600 transition-colors duration-200">
                  Login
                </Link>
              )}
            </div>

            {/* Mobile Menu / Login Trigger */}
            <div className="flex lg:hidden items-center">
              {user ? (
                <button
                  type="button"
                  onClick={toggleMobileMenu}
                  aria-label="Open navigation menu"
                  aria-expanded={isMobileMenu}
                  className="p-2 rounded-full text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                  <Menu className="w-5 h-5" aria-hidden="true" />
                </button>
              ) : (
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-full bg-gray-900 text-white text-xs sm:text-sm font-medium hover:bg-blue-600 transition-colors duration-200">
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Search Overlay (Always mounted so open/close transitions animate smoothly) */}
      <SearchBar
        searchRef={searchRef}
        showSearch={showSearch}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        setShowSearch={setShowSearch}
        handleKeyDown={handleKeyDown}
      />

      {/* Mobile Menu Backdrop */}
      <div
        aria-hidden="true"
        onClick={toggleMobileMenu}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity duration-300 lg:hidden ${
          isMobileMenu
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Mobile Menu Drawer */}
      <div
        aria-hidden={!isMobileMenu}
        className={`pointer-events-auto fixed inset-y-0 right-0 z-50 flex flex-col bg-white w-[85%] max-w-sm shadow-2xl transition-all duration-300 ease-in-out lg:hidden ${
          isMobileMenu ? "translate-x-0 visible" : "translate-x-full invisible"
        }`}>
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <span className="font-serif font-extrabold text-xl text-gray-900">
            EasyBuy
          </span>
          <button
            type="button"
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            aria-label="Close navigation menu"
            onClick={toggleMobileMenu}>
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Drawer Content */}
        {user && (
          <div className="flex-1 flex flex-col justify-between p-4 overflow-y-auto">
            <div>
              <div className="flex items-center gap-3 px-3 py-3 mb-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center shrink-0">
                  <UserRound className="w-4 h-4" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">Signed in as</p>
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {getDisplayName(user.name)}
                  </p>
                </div>
              </div>

              <ul className="space-y-1">
                {navLinks.map((link) => {
                  if (link.sellerOnly && !isSeller) return null;
                  const Icon = link.icon;

                  return (
                    <li key={link.id}>
                      <NavLink
                        to={link.path}
                        onClick={toggleMobileMenu}
                        className={({ isActive }) =>
                          `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 ${
                            isActive
                              ? "bg-blue-50 text-blue-700 font-semibold"
                              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                          }`
                        }>
                        <span className="flex items-center gap-3">
                          <Icon
                            className="w-5 h-5 shrink-0"
                            aria-hidden="true"
                          />
                          {link.name}
                        </span>
                        {link.showCount && cart.length > 0 && (
                          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-gray-900 text-white">
                            {cart.length}
                          </span>
                        )}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="pt-4 mt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  logout();
                  toggleMobileMenu();
                }}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-200">
                <LogOut className="w-5 h-5" aria-hidden="true" />
                Log Out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;

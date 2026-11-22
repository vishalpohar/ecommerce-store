import {
  LogOut,
  Search,
  Menu,
  Package,
  Handbag,
  Heart,
  UserRound,
  LayoutDashboard,
  X,
} from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
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

const Navbar = () => {
  const { user, logout } = useUserStore();
  const isSeller = user?.role === "seller";
  const { cart } = useCartStore();

  const [isMobileMenu, setIsMobileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenu((prev) => !prev);
  };

  const getDisplayName = (name) => {
    if (!name) return "User";
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchValue !== "") {
      navigate(`/search?query=${encodeURIComponent(searchValue.trim())}`);
      setShowSearch(false);
      setSearchValue("");
    } else if (e.key === "Enter" && searchValue.trim() === "") {
      toast.error("Please enter a search term");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="fixed top-4 left-0 w-full z-50">
      {/* Main Navbar */}
      <nav className="px-2 md:px-6 mx-3 lg:mx-6 bg-black/5 text-gray-600 backdrop-blur-md rounded-full">
        <div className="container mx-auto">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div>
              <Link
                to="/"
                aria-label="Website Logo"
                className="relative flex items-center gap-3 text-gray-700 text-xl lg:text-3xl font-serif tracking-tight outline-none font-extrabold duration-500">
                EasyBuy
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-4 md:space-x-6 lg:space-x-10 px-2">
              {user && (
                <ul className="flex items-center gap-6 lg:gap-10">
                  {navLinks.map((link) => {
                    if (link.sellerOnly && !isSeller) return null;

                    return (
                      <li key={link.id}>
                        <NavLink
                          to={link.path}
                          aria-label={`Open ${link.name}`}
                          className={({ isActive }) =>
                            `relative inline-block text-lg font-medium text-gray-500 transition-transform hover:scale-110 group ${isActive ? "text-blue-600 font-semibold border-blue-500 hover:text-blue-700" : "hover:text-gray-900"}`
                          }>
                          {link.name}
                          {link.showCount && cart.length > 0 && (
                            <p className="absolute -top-2 -right-4 bg-gray-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-medium group-hover:bg-gray-900">
                              {cart.length}
                            </p>
                          )}
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="flex ">
              {/* Search Button */}
              <button
                onClick={() => setShowSearch(true)}
                aria-label="Open Search"
                className="p-2 hover:text-gray-900 transition-colors hover:scale-110 duration-200">
                <Search size={20} />
              </button>

              <div className="hidden lg:flex justify-center items-center">
                {/* User Actions */}
                {user ? (
                  <div className="flex gap-1 justify-center items-center">
                    <button
                      onClick={logout}
                      aria-label="Open Logout"
                      className="relative group px-4 py-2 hover:text-gray-900 hover:scale-110 transition-all duration-200">
                      <LogOut size={20} />
                      <span
                        className="
                            absolute top-9 left-1/2 -translate-x-1/2
                            bg-gray-900 text-white text-xs px-3 py-1 rounded-md
                            opacity-0 scale-95
                            group-hover:opacity-100 group-hover:scale-100
                            transition-all duration-200
                          ">
                        logout
                      </span>
                    </button>
                    <div className="flex items-center justify-center">
                      <UserRound
                        size={20}
                        className="border-2 rounded-full border-gray-600"
                      />
                      <span className="text-lg">
                        {getDisplayName(user.name)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    aria-label="Login"
                    className="px-4 py-2 hover:text-blue-600 hover:scale-105 transition-all duration-200">
                    <span className="text-lg font-light">Login</span>
                  </Link>
                )}
              </div>

              {/* Mobile Menu Button */}
              <div className="flex lg:hidden items-center space-x-3">
                {user ? (
                  !isMobileMenu ? (
                    <button
                      onClick={toggleMobileMenu}
                      aria-label="Open Menu"
                      className="p-2 hover:text-blue-600 transition-colors duration-200">
                      <Menu size={22} />
                    </button>
                  ) : (
                    <button
                      className="p-2 hover:text-blue-600 transition-colors duration-200"
                      aria-label="Close"
                      onClick={toggleMobileMenu}>
                      <X size={22} />
                    </button>
                  )
                ) : (
                  <Link
                    to="/login"
                    aria-label="Login"
                    className="px-4 py-2 hover:text-blue-600 hover:scale-105 transition-all duration-200">
                    <span className="text-lg font-light">Login</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Search Overlay */}
      {showSearch && (
        <SearchBar
          searchRef={searchRef}
          showSearch={showSearch}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          setShowSearch={setShowSearch}
          handleKeyDown={handleKeyDown}
        />
      )}

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
        className={`fixed inset-y-0 right-0 z-50 flex flex-col bg-white w-[85%] max-w-sm py-4 shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileMenu ? "translate-x-0" : "translate-x-full"
        }`}>
        <div className="w-full flex flex-col mt-2">
          <div className="flex justify-end pr-4">
            <button
              type="button"
              className="p-2 transition-colors duration-200"
              aria-label="Close"
              onClick={toggleMobileMenu}>
              <X size={22} />
            </button>
          </div>

          {user && (
            <>
              <div className="flex items-center space-x-3 px-6 py-2">
                <UserRound className="text-gray-600" size={20} />
                <span className="text-lg font-light text-gray-700">
                  {getDisplayName(user.name)}
                </span>
              </div>

              <ul className="w-full flex flex-col pb-4">
                {navLinks.map((link) => {
                  if (link.sellerOnly && !isSeller) return null;

                  const Icon = link.icon;

                  return (
                    <li key={link.id} className="w-full">
                      <NavLink
                        to={link.path}
                        aria-label={`Open ${link.name}`}
                        onClick={toggleMobileMenu}
                        className={({ isActive }) =>
                          `flex transition-colors duration-200 px-6 py-2.5 group ${
                            isActive ? "bg-gray-200" : "hover:bg-gray-50"
                          }`
                        }>
                        {({ isActive }) => (
                          <div className="flex items-center gap-3">
                            <Icon
                              size={20}
                              className={
                                isActive ? "text-gray-900" : "text-gray-600"
                              }
                            />
                            <span
                              className={`text-lg font-light ${
                                isActive
                                  ? "text-gray-900 font-semibold"
                                  : "text-gray-600"
                              }`}>
                              {link.name}{" "}
                              {link.showCount &&
                                cart.length > 0 &&
                                `(${cart.length})`}
                            </span>
                          </div>
                        )}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </>
          )}

          <hr className="w-full border-t border-gray-200 my-2" />

          {user && (
            <button
              type="button"
              aria-label="Logout"
              onClick={() => {
                logout();
                toggleMobileMenu();
              }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-red-600 hover:text-red-700 transition-colors duration-200 group">
              <LogOut size={20} />
              <span className="text-lg font-light group-hover:font-semibold">
                Log Out
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

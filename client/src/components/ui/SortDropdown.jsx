import { ArrowUpDown, Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const SortDropdown = ({
  options = [],
  value,
  onChange,
  label = "Sort by",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption =
    options.find((opt) => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`${label}: ${selectedOption?.label}`}
        className={`flex items-center gap-2 px-3.5 py-2 bg-white border rounded-xl text-xs sm:text-sm font-medium text-gray-700 transition-all duration-200 shadow-2xs hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
          isOpen ? "border-blue-500 ring-2 ring-blue-500/20" : "border-gray-200"
        }`}>
        <ArrowUpDown
          className="w-3.5 h-3.5 text-gray-400 shrink-0"
          aria-hidden="true"
        />
        <span className="hidden sm:inline text-gray-400 font-normal">
          {label}:
        </span>
        <span className="text-gray-800 whitespace-nowrap">
          {selectedOption?.label}
        </span>
        <ChevronDown
          aria-hidden="true"
          className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-blue-600" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <ul
          role="listbox"
          aria-label={label}
          className="absolute right-0 mt-2 w-52 bg-white border border-gray-200/80 rounded-xl shadow-lg py-1.5 z-30 origin-top-right animate-fadeIn">
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <li key={option.value} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`w-full flex items-center justify-between px-3.5 py-2 text-sm text-left transition-colors ${
                    isSelected
                      ? "bg-blue-50/80 text-blue-700 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}>
                  <span>{option.label}</span>
                  {isSelected && (
                    <Check
                      className="w-4 h-4 text-blue-600 shrink-0"
                      aria-hidden="true"
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SortDropdown;

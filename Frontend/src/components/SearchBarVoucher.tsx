import { FiSearch, FiX } from "react-icons/fi";
import React from "react";

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  placeholder?: string;
  className?: string;
  widthClassName?: string; // Thay vì width string, truyền class để linh hoạt
}

const SearchBarVoucher: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onClear,
  placeholder = "Tìm kiếm voucher...",
  className = "",
  widthClassName = "w-full max-w-3xl", // mặc định full width max 448px
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      onClear();
    }
  };

  return (
    <div className={`flex justify-center ${className}`}>
      <div className={`relative ${widthClassName}`}>
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <FiSearch className="text-gray-500" size={18} />
        </div>

        <input
          type="text"
          placeholder={placeholder}
          className={`
            w-full pl-12 pr-10 py-2.5 bg-white border border-gray-300 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300
            transition-all duration-200 shadow-sm text-gray-700
          `}
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
        />

        {value && (
          <button
            onClick={onClear}
            className="absolute inset-y-0 right-0 flex items-center pr-4
              text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Clear search"
          >
            <FiX size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBarVoucher;

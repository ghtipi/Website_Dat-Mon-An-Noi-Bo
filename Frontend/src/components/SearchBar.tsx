import React, { useState } from "react";

type SearchBarProps = {
  onSearch: (query: string) => void;
  className?: string;
};

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, className = "" }) => {
  const [query, setQuery] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSearch(query);
    }
  };

  const handleSearchClick = () => {
    onSearch(query);
  };

  return (
    <div className={`flex justify-center ${className}`}>
      <div className="relative w-full max-w-4xl"> {/* Tăng max-width lên max-w-4xl */}
        <div className="flex items-center border-2 border-gray-300 rounded-full px-6 py-3 bg-white shadow-md hover:shadow-lg transition-all duration-200">
          <i 
            className="bi bi-search text-gray-500 text-xl cursor-pointer" /* Tăng kích thước icon */
            onClick={handleSearchClick}
          ></i>
          <input
            type="text"
            placeholder="Tìm kiếm món ăn, nhà hàng..."
            className="ml-4 bg-transparent outline-none w-full text-lg text-gray-800 placeholder-gray-500" /* Tăng kích thước chữ */
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {query && (
            <i
              className="bi bi-x text-gray-500 text-xl cursor-pointer ml-3" /* Tăng kích thước icon */
              onClick={() => setQuery("")}
            ></i>
          )}
          <i
            className="bi bi-sliders text-gray-500 text-xl ml-4 cursor-pointer hover:text-blue-600 transition-colors" /* Tăng kích thước icon */
            title="Lọc nâng cao"
            onClick={handleSearchClick}
          ></i>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
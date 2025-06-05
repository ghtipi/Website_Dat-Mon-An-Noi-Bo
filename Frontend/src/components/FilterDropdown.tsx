import { FiFilter, FiChevronDown } from "react-icons/fi";

interface FilterDropdownProps {
  showFilters: boolean;
  onToggle: () => void;
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  showFilters,
  onToggle,
  categories,
  selectedCategory,
  onSelectCategory
}) => (
  <div className="relative inline-block text-left">
    <button
      onClick={onToggle}
      className="flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm sm:text-base text-gray-700 hover:bg-gray-50 transition"
    >
      <FiFilter className="mr-2" />
      Lọc
      <FiChevronDown className="ml-2" />
    </button>

    {showFilters && (
      <div
        className="absolute mt-2 right-0 w-44 sm:w-56 bg-white rounded-md shadow-lg z-20"
        style={{ minWidth: "10rem" }}
      >
        <div className="py-1 max-h-64 overflow-y-auto">
          <div className="px-4 py-2 text-sm font-medium text-gray-700 border-b">
            Danh mục
          </div>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={`block w-full text-left px-4 py-2 text-sm ${
                selectedCategory === category
                  ? "bg-red-50 text-red-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    )}
  </div>
);

export default FilterDropdown;

// SelectedCategoryTag.tsx
import { FiX } from "react-icons/fi";

interface SelectedCategoryTagProps {
  category: string;
  onClear: () => void;
}

const SelectedCategoryTag: React.FC<SelectedCategoryTagProps> = ({ category, onClear }) => {
  if (category === "Tất cả") return null;
  return (
    <div className="mb-4 flex items-center">
      <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
        {category}
      </span>
      <button 
        onClick={onClear}
        className="ml-2 text-gray-500 hover:text-gray-700"
      >
        <FiX />
      </button>
    </div>
  );
};

export default SelectedCategoryTag;

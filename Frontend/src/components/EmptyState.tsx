interface EmptyStateProps {
  searchTerm: string;
  onClearFilters: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ searchTerm, onClearFilters }) => (
  <div className="flex flex-col items-center justify-center text-center px-4 py-12 sm:px-6 md:px-8">
    <div className="text-gray-400 mb-4">
      <svg
        className="w-16 h-16 sm:w-20 sm:h-20 mx-auto"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1"
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Không tìm thấy voucher</h3>
    <p className="text-gray-500 mt-2 text-sm sm:text-base max-w-md">
      {searchTerm
        ? "Không có voucher nào phù hợp với từ khóa tìm kiếm của bạn."
        : "Không có voucher nào trong danh mục này."}
    </p>
    <button
      onClick={onClearFilters}
      className="mt-5 px-4 py-2 rounded-md bg-red-600 text-white text-sm sm:text-base hover:bg-red-700 transition"
    >
      Xóa bộ lọc
    </button>
  </div>
);

export default EmptyState;

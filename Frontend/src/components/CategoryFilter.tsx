interface Category {
  label: string;
  active?: boolean;
}

const categories: Category[] = [
  { label: "Tất cả", active: true },
  { label: "Pizza" },
  { label: "Đồ ăn nhanh" },
  { label: "Mì" },
  { label: "Tráng miệng" },
  { label: "Hải sản" },
  { label: "Shushi" },
  { label: "Ramen" },
];

const CategoryFilter = () => (
  <div className="overflow-x-auto w-full mb-6">
    <div className="flex gap-2 sm:gap-3 md:gap-4 w-max sm:w-full flex-nowrap sm:flex-wrap">
      {categories.map(({ label, active }, i) => (
        <button
          key={i}
          className={`whitespace-nowrap px-4 py-2 rounded-full border text-sm sm:text-base transition duration-200
            ${active ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}
        >
          {label}
        </button>
      ))}
    </div>
  </div>
);

export default CategoryFilter;
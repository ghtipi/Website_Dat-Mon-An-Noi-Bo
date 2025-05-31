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
  <div className="flex flex-wrap gap-2 mb-6">
    {categories.map(({ label, active }, i) => (
      <div
        key={i}
        className={`flex items-center px-4 py-2 rounded-full border ${
          active ? "bg-blue-500 text-white" : "bg-white text-gray-700"
        }`}
      >
        {label}
      </div>
    ))}
  </div>
);

export default CategoryFilter;
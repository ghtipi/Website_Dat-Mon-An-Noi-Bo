import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Category, categoryService } from '../services/categoryService';

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await categoryService.getAllCategories();
        // Thêm "Tất cả" vào đầu danh sách
        const allCategory: Category = {
          id: 'all', // dùng string để tránh trùng với các id thật
          name: 'Tất cả',
          slug: 'all',
        };
        setCategories([allCategory, ...data]);
        setError(null);
      } catch (err) {
        setError('Không thể tải danh mục. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-4 rounded-xl bg-gray-100/50 backdrop-blur-sm animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-500 text-center py-4 text-lg font-medium">
          {error}
        </div>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="p-6">
        <div className="text-gray-500 text-center py-4 text-lg font-medium">
          Không có danh mục nào
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-end items-center mb-4">
        <Link
          to="/categories"
          className="text-sm text-teal-600 hover:underline font-medium transition-all duration-200"
        >
          Xem tất cả
        </Link>
      </div>

      {/* Grid danh mục */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 bg-transparent">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/menu/${category.slug}`}
            className={`flex flex-col items-center p-2 rounded-xl border shadow-lg hover:shadow-2xl transition-all duration-300 group 
              ${category.slug === 'all' ? 'bg-teal-500/80 text-white border-teal-600' : 'bg-white/30 backdrop-blur-md border-gray-300'}`}
          >
            <span className="font-medium text-center text-sm group-hover:text-white transition-colors duration-300">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </>
  );
};

export default CategoryList;

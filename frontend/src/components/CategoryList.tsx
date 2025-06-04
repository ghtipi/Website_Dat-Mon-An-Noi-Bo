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
        const allCategory: Category = {
          id: 'all',
          name: 'Tất cả',
          slug: 'all',
          image: '', // Không có hình ảnh
          description: 'Xem tất cả các món ăn có sẵn',
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
            >
              <div className="w-20 h-20 bg-gray-300 rounded-full mb-2"></div>
              <div className="w-16 h-4 bg-gray-300 rounded"></div>
            </div>
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
            className={`relative flex flex-col items-center p-4 rounded-xl border shadow-lg hover:shadow-2xl transition-all duration-300 group 
              ${category.slug === 'all' ? 'bg-teal-500/80 text-white border-teal-600' : 'bg-white/30 backdrop-blur-md border-gray-300'}`}
          >
            {/* Xử lý khi không có hình ảnh (trường hợp "Tất cả") */}
            {category.image ? (
              <img
                src={category.image}
                alt={category.name}
                className="w-20 h-20 object-cover rounded-full mb-2 transition-transform duration-300 group-hover:scale-110"
              />
            ) : (
              <div className="w-20 h-20 flex items-center justify-center bg-white/20 rounded-full mb-2 transition-transform duration-300 group-hover:scale-110">
                <svg 
                  className="w-10 h-10" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 6h16M4 12h16M4 18h16" 
                  />
                </svg>
              </div>
            )}
            
            {/* Category Name */}
            <span className={`font-medium text-center text-sm transition-colors duration-300 ${
              category.slug === 'all' ? 'text-white' : 'group-hover:text-teal-600'
            }`}>
              {category.name}
            </span>
            
            {/* Description on Hover */}
            {category.description && (
              <div className={`absolute top-full mt-2 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 ${
                category.slug === 'all' ? 'bg-white text-teal-800' : 'bg-gray-800 text-white'
              }`}>
                <div dangerouslySetInnerHTML={{ __html: category.description }} />
              </div>
            )}
          </Link>
        ))}
      </div>
    </>
  );
};

export default CategoryList;
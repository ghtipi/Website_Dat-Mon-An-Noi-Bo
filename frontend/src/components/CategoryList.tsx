import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Category, categoryService } from '../services/categoryService';
import Tooltip from './Tooltip';

function stripHtmlAndTruncate(html: string, maxLength: number): string {
  const text = html.replace(/<[^>]*>?/gm, '');
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + '...';
  }
  return text;
}

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipX, setTooltipX] = useState(0);
  const [tooltipY, setTooltipY] = useState(0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await categoryService.getAllCategories();
        const allCategory: Category = {
          id: 'all',
          name: 'Tất cả',
          slug: 'all',
          image: '',
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
      <div className="p-6 bg-transparent">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-4 rounded-2xl bg-gray-100/80 animate-pulse backdrop-blur-sm"
            >
              <div className="w-24 h-24 bg-gray-200/70 rounded-full mb-3"></div>
              <div className="w-20 h-4 bg-gray-200/70 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center bg-transparent">
        <div className="inline-flex items-center px-4 py-2 bg-red-100/80 text-red-700 rounded-lg backdrop-blur-sm">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="p-6 text-center bg-transparent">
        <div className="inline-flex items-center px-4 py-2 bg-blue-100/80 text-blue-700 rounded-lg backdrop-blur-sm">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Không có danh mục nào
        </div>
      </div>
    );
  }

  return (
    <div className="relative p-4 sm:p-6 bg-transparent">
      <div className="flex justify-end mb-6">
        <Link
            to="/categories"
            className="flex items-center text-teal-600 hover:text-teal-800 font-medium transition-colors"
        >
            Xem tất cả
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
        </Link>
        </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/menu/${category.slug}`}
            className={`group relative flex flex-col items-center p-4 rounded-2xl transition-all duration-300 hover:shadow-lg overflow-hidden
              ${category.slug === 'all' 
                ? 'bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-md' 
                : 'bg-white/80 border border-gray-200/70 hover:border-teal-200 backdrop-blur-sm'}`}
            onMouseEnter={(e) => {
              setTooltipX(e.clientX);
              setTooltipY(e.clientY);
              setTooltipContent(
                category.description
                  ? stripHtmlAndTruncate(category.description, 200)
                  : 'Không có mô tả'
              );
              setTooltipVisible(true);
            }}
            onMouseMove={(e) => {
              setTooltipX(e.clientX);
              setTooltipY(e.clientY);
            }}
            onMouseLeave={() => {
              setTooltipVisible(false);
              setTooltipContent('');
            }}
          >
            <div className="relative z-10 mb-3">
              {category.image ? (
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-full border-2 border-white shadow-md transition-transform duration-300 group-hover:scale-110"
                />
              ) : (
                <div className={`w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center rounded-full border-2 shadow-md transition-transform duration-300 group-hover:scale-110
                  ${category.slug === 'all' 
                    ? 'border-white bg-teal-400' 
                    : 'border-gray-100/70 bg-gray-50/70'}`}>
                  <svg 
                    className={`w-10 h-10 ${category.slug === 'all' ? 'text-white' : 'text-gray-400'}`}
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
            </div>

            <span className={`relative z-10 font-medium text-center text-sm sm:text-base transition-colors duration-300 ${
              category.slug === 'all' 
                ? 'text-white' 
                : 'text-gray-700 group-hover:text-teal-600'
            }`}>
              {category.name}
            </span>
          </Link>
        ))}
      </div>

      <Tooltip
        x={tooltipX}
        y={tooltipY}
        content={tooltipContent}
        visible={tooltipVisible}
      />
    </div>
  );
};

export default CategoryList;
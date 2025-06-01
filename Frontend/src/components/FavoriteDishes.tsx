import React, { useState, useEffect } from "react";

type Dish = {
  id: number;
  name: string;
  image: string;
  rating: number;
  favorites: number;
};

const sampleDishes: Dish[] = [
  {
    id: 1,
    name: "Cơm tấm sườn bì chả",
    image: "/images/comtam.jpg",
    rating: 5,
    favorites: 128,
  },
  {
    id: 2,
    name: "Phở bò đặc biệt",
    image: "/images/phobo.jpg",
    rating: 4,
    favorites: 97,
  },
  {
    id: 3,
    name: "Bún chả Hà Nội",
    image: "/images/buncha.jpg",
    rating: 5,
    favorites: 82,
  },
];

const FavoriteDishes: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dishes, setDishes] = useState<Dish[]>([]);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setDishes(sampleDishes);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-1 text-sm text-gray-500">({rating}.0)</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md animate-pulse">
        <div className="h-8 w-1/3 bg-gray-200 rounded mb-6"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="grid grid-cols-3 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-md"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
              <div className="flex items-center">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-6 text-gray-800">Món ăn được yêu thích nhất</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm">
              <th className="p-3 font-medium rounded-l-lg">Món ăn</th>
              <th className="p-3 font-medium">Đánh giá</th>
              <th className="p-3 font-medium rounded-r-lg">Yêu thích</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {dishes.map((dish) => (
              <tr 
                key={dish.id} 
                className="hover:bg-gray-50 transition-colors duration-150"
                tabIndex={0}
                aria-label={`Món ${dish.name}, đánh giá ${dish.rating} sao, ${dish.favorites} lượt yêu thích`}
              >
                <td className="p-3">
                  <div className="flex items-center space-x-3">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-12 h-12 object-cover rounded-md shadow-sm"
                      loading="lazy"
                    />
                    <span className="font-medium text-gray-800">{dish.name}</span>
                  </div>
                </td>
                <td className="p-3">
                  {renderStars(dish.rating)}
                </td>
                <td className="p-3">
                  <div className="flex items-center">
                    <svg 
                      className="w-5 h-5 text-red-500 mr-1" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold text-gray-700">{dish.favorites}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {dishes.length > 3 && (
        <button className="mt-4 w-full py-2 bg-gray-50 text-blue-600 rounded-lg hover:bg-gray-100 transition-colors">
          Xem thêm món ăn
        </button>
      )}
    </div>
  );
};

export default FavoriteDishes;
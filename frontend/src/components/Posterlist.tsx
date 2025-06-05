import { useEffect, useState, useRef } from 'react';
import { getposterrow, Poster } from '../services/PosterServie';

const PosterList = () => {
  const [posters, setPosters] = useState<Poster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const fetchPosters = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token') || '';
        const data = await getposterrow(token);
        setPosters(data);
        setError(null);
      } catch (err) {
        setError('Không thể tải danh sách poster. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosters();
  }, []);

  useEffect(() => {
    if (posters.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % posters.length);
      }, 5000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [posters.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? posters.length - 1 : prevIndex - 1
    );
    resetInterval();
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % posters.length);
    resetInterval();
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    resetInterval();
  };

  const resetInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % posters.length);
    }, 5000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600 text-lg animate-pulse">Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-8 text-lg font-medium">
        {error}
      </div>
    );
  }

  if (posters.length === 0) {
    return (
      <div className="text-gray-600 text-center py-8 text-lg font-medium">
        Không có poster nào để hiển thị.
      </div>
    );
  }

  return (
    <div className="w-full h-[350px] md:h-[450px] relative overflow-hidden rounded-2xl shadow-xl">
      {/* Carousel Slides */}
      {posters.map((poster, index) => (
        <div
          key={poster.id}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <img
            src={
              poster.image ||
              'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80'
            }
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {/* Navigation Buttons */}
      <button
        onClick={goToPrevious}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800/60 text-white p-2 rounded-full hover:bg-gray-800 transition-colors hidden sm:flex"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        onClick={goToNext}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800/60 text-white p-2 rounded-full hover:bg-gray-800 transition-colors hidden sm:flex"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {posters.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? 'bg-teal-500' : 'bg-gray-400'
            } hover:bg-teal-600 transition-colors`}
          />
        ))}
      </div>
    </div>
  );
};

export default PosterList;

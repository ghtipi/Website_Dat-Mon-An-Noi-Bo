import { Clock4 } from 'lucide-react';

const TimeInfo = () => {
  const today = new Date();

  const formattedDate = today.toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const hours = today.getHours();
  const minutes = today.getMinutes().toString().padStart(2, '0');
  const time = `${hours}:${minutes}`;

  const getTimeOfDay = (hour: number) => {
    if (hour >= 5 && hour < 10) return 'Sáng';
    if (hour >= 10 && hour < 13) return 'Trưa';
    if (hour >= 13 && hour < 18) return 'Chiều';
    if (hour >= 18 && hour < 22) return 'Tối';
    return 'Khuya';
  };

  const timeOfDay = getTimeOfDay(hours);


  const getTimeColorClass = (timeOfDay: string) => {
    switch (timeOfDay) {
      case 'Sáng':
        return 'from-yellow-200 to-orange-300'; 
      case 'Trưa':
        return 'from-orange-300 to-yellow-400'; 
      case 'Chiều':
        return 'from-amber-400 to-red-400'; 
      case 'Tối':
        return 'from-blue-600 to-purple-500'; 
      case 'Khuya':
      default:
        return 'from-blue-800 to-gray-900'; 
    }
  };

  const gradientClass = getTimeColorClass(timeOfDay);

  return (
    <div className={`flex items-center gap-2 bg-gradient-to-r ${gradientClass} text-white px-3 py-1 rounded-md shadow`}>
      <Clock4 className="w-4 h-4" />
      <div className="text-xs leading-tight">
        <div className="font-medium">{formattedDate}</div>
        <div className="opacity-90">{time} – {timeOfDay}</div>
      </div>
    </div>
  );
};

export default TimeInfo;
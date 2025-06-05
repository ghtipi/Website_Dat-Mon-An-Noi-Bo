import React from "react";

const CommentSidebar: React.FC = () => {
  return (
    <div className="w-full sm:w-72 bg-white border sm:border-r shadow-sm p-3 sm:p-4 h-full overflow-y-auto">
      <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Bình luận về món ăn</h2>

      <div className="sticky top-0 bg-white pb-3 z-10">
        <textarea
          className="w-full h-20 sm:h-24 border rounded p-2 mb-2 text-xs sm:text-sm resize-none"
          placeholder="Chia sẻ cảm nhận của bạn về món ăn này..."
        />
        <button className="w-full bg-blue-600 text-white py-1.5 sm:py-2 rounded hover:bg-blue-700 transition text-sm sm:text-base">
          Gửi bình luận
        </button>
      </div>

      <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
        <div className="bg-gray-50 p-2 rounded">
          <p className="text-xs sm:text-sm font-medium">Nguyễn Văn A</p>
          <p className="text-xs sm:text-sm">Món ăn có hương vị đậm đà, gia vị vừa miệng!</p>
          <p className="text-xs text-gray-500 mt-1">2 giờ trước</p>
        </div>
        <div className="bg-gray-50 p-2 rounded">
          <p className="text-xs sm:text-sm font-medium">Trần Thị B</p>
          <p className="text-xs sm:text-sm">Cách trình bày đẹp mắt, nguyên liệu tươi ngon.</p>
          <p className="text-xs text-gray-500 mt-1">1 ngày trước</p>
        </div>
        <div className="bg-gray-50 p-2 rounded">
          <p className="text-xs sm:text-sm font-medium">Lê Hoàng C</p>
          <p className="text-xs sm:text-sm">Món này hợp khẩu vị gia đình tôi, sẽ nấu lại!</p>
          <p className="text-xs text-gray-500 mt-1">3 ngày trước</p>
        </div>
      </div>
    </div>
  );
};

export default CommentSidebar;
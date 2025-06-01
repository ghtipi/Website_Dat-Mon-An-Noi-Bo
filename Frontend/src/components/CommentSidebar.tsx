import React from "react";

const CommentSidebar: React.FC = () => {
  return (
    <div className="w-72 bg-white border-r shadow-sm p-4 h-full">
      <h2 className="text-lg font-semibold mb-4">Bình luận về món ăn</h2>

      <textarea
        className="w-full h-24 border rounded p-2 mb-3 text-sm resize-none"
        placeholder="Chia sẻ cảm nhận của bạn về món ăn này..."
      />
      <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
        Gửi bình luận
      </button>

      <div className="mt-6 space-y-3">
        <div className="bg-gray-100 p-2 rounded">
          <p className="text-sm font-medium">Nguyễn Văn A</p>
          <p className="text-sm">Món ăn có hương vị đậm đà, gia vị vừa miệng!</p>
        </div>
        <div className="bg-gray-100 p-2 rounded">
          <p className="text-sm font-medium">Trần Thị B</p>
          <p className="text-sm">Cách trình bày đẹp mắt, nguyên liệu tươi ngon.</p>
        </div>
        <div className="bg-gray-100 p-2 rounded">
          <p className="text-sm font-medium">Lê Hoàng C</p>
          <p className="text-sm">Món này hợp khẩu vị gia đình tôi, sẽ nấu lại!</p>
        </div>
      </div>
    </div>
  );
};

export default CommentSidebar;
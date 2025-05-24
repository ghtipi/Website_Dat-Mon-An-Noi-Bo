# Ghi chú cuộc họp khách hàng - Thu thập yêu cầu

## Thông tin cuộc họp
- **Thời gian**: 05:16 PM, Thứ Bảy, 24/05/2025  
- **Địa điểm**: 709a Đ. Phan Văn Trị, Phường 1, Gò Vấp, Hồ Chí Minh
- **Người tham dự**:  
  - Khách hàng:  Trần Thị B
  - Đội dự án:  
    + [Trần Thành Phát] (PM)  
    + Nhóm UI/UX [Huỳnh Minh Thuận - Nguyễn Phúc Vũ Khánh]  
    + Nhóm Frontend [Đặng Vương Đại]  
    + Nhóm Backend [Trần Thành Phát]  
- **Mục tiêu**: Thu thập yêu cầu cho website đặt món ăn nội bộ (Frontend: React/Vite, Backend: Laravel/MongoDB)

## Yêu cầu thu thập được

| STT | Yêu cầu                          | Mức độ ưu tiên | Người chịu trách nhiệm | Thời hạn    | Trạng thái      |
|-----|----------------------------------|----------------|------------------------|-------------|-----------------|
| 1   | Thiết kế giao diện trang đăng nhập đẹp hơn | Cao            | Nhóm UI/UX             | 2025-05-31  | Chưa bắt đầu    |
| 2   | Thêm chức năng quên mật khẩu      | Trung bình     | Nhóm Backend           | 2025-06-07  | Đang thực hiện  |
| 3   | Tích hợp thông báo real-time cho đơn hàng | Thấp           | Nhóm Frontend          | 2025-06-14  | Chưa bắt đầu    |
| 4   | Tối ưu tốc độ tải trang menu      | Cao            | Nhóm DevOps            | 2025-05-30  | Đang thực hiện  |

## Ghi chú bổ sung
- **Về giao diện đăng nhập**: Khách hàng muốn thêm logo công ty phía trên form đăng nhập và sử dụng màu chủ đạo là xanh dương (#1D4ED8).  
- **Về chức năng quên mật khẩu**: Cần gửi email reset mật khẩu, sử dụng dịch vụ email bên thứ 3 như SendGrid.  
- **Về thông báo real-time**: Khách hàng gợi ý sử dụng WebSocket hoặc Pusher để hiển thị thông báo khi trạng thái đơn hàng thay đổi.  
- **Về tối ưu tốc độ**: Cần kiểm tra hiệu suất API `/api/menu` và cân nhắc thêm caching (Redis).  
- **Yêu cầu bổ sung**: Khách hàng đề xuất thêm tính năng "Giỏ hàng" để người dùng xem lại món trước khi đặt.  

## Hành động tiếp theo
1. **Nhóm UI/UX**: Bắt đầu thiết kế giao diện trang đăng nhập, gửi bản mockup cho khách hàng trước 27/05/2025.  
2. **Nhóm Backend**: Tìm hiểu tích hợp SendGrid và thiết kế API `/api/auth/forgot-password`.  
3. **Nhóm Frontend**: Lên kế hoạch tích hợp WebSocket/Pusher và thiết kế tính năng giỏ hàng.  
4. **Nhóm DevOps**: Phân tích hiệu suất API `/api/menu`, đề xuất giải pháp caching.  
5. **PM ([Tên bạn])**: Gửi email xác nhận yêu cầu cho khách hàng trước 25/05/2025.

## Kết luận
Đã thu thập được các yêu cầu quan trọng, giúp định hướng phát triển cho website đặt món ăn nội bộ. Các nhóm cần bắt đầu thực hiện ngay để đảm bảo tiến độ dự án.

folder Frontend : React, Typescript, tailwwind
folder Backend: Laravel , PHP

cơ sở dữ liệu chính :MongoDB


Kế hoạch khởi đầu dự án website đặt thức ăn nội bộ
1. Bắt đầu với giai đoạn Yêu cầu

Mục tiêu: Thu thập và xác định đầy đủ yêu cầu từ sinh viên, căn tin, và ban quản lý KTX.
Các bước:
Phỏng vấn các bên liên quan:
Sinh viên: Nhu cầu đặt món, giao diện mong muốn.
Căn tin: Quy trình quản lý thực đơn, thống kê.
Ban quản lý: Yêu cầu báo cáo, bảo mật.
Công cụ: Google Forms, phỏng vấn trực tiếp.


Xác định tính năng:
Người dùng: Đặt món, hủy đơn, xem lịch sử, thanh toán.
Căn tin: Quản lý thực đơn, in danh sách nấu ăn.
Quản trị viên: Quản lý người dùng, báo cáo.


Xác định yêu cầu phi chức năng:
Hiệu suất: Hỗ trợ 100 người dùng đồng thời.
Bảo mật: JWT, mã hóa mật khẩu.
Thiết bị: Mobile-first, hỗ trợ laptop.


Tạo tài liệu yêu cầu:
Viết SRS hoặc tài liệu ngắn (1-2 trang).
Công cụ: Google Docs, Notion.





2. Chuẩn bị cho giai đoạn Phân tích

Xác định tác nhân: Người dùng, căn tin, quản trị viên.
Phác thảo sơ đồ Use Case: Dùng Lucidchart hoặc Draw.io.
Phân tích cơ sở dữ liệu: Kiểm tra schema MongoDB (Users, Menu, Orders, Invoices, Notifications, Reports).
Chuẩn bị môi trường phát triển:
Cài Node.js, PHP, MongoDB.
Tạo dự án Laravel:composer create-project laravel/laravel food-ordering-backend
composer require jenssegers/mongodb


Tạo dự án React + TypeScript:npx create-react-app food-ordering-frontend --template typescript
npm install bootstrap tailwindcss
npx tailwindcss init


Tạo repository Git:git init
git add .
git commit -m "Initial commit"
git remote add origin <repository-url>
git push -u origin main





3. Công việc tuần đầu tiên

Ngày 1-2: Viết tài liệu yêu cầu sơ bộ.
Ngày 3-4: Chuẩn bị bảng câu hỏi và gửi cho các bên liên quan.
Ngày 5: Cài đặt môi trường phát triển và tạo repository.
Ngày 6-7: Phác thảo sơ đồ Use Case và giao diện cơ bản.


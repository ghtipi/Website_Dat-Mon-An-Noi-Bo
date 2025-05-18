# Food Ordering System

Website đặt thức ăn nội bộ cho căn tin/KTX, hỗ trợ sinh viên/nhân viên đặt món, căn tin quản lý thực đơn và đơn hàng, quản trị viên xem báo cáo và gửi thông báo. Dự án được phát triển theo mô hình **Waterfall** bởi Nhóm 4, với giao diện mobile-first và ngôn ngữ tiếng Việt.

## Thông tin dự án

- **Tên dự án**: Website Đặt Thức Ăn Nội Bộ
- **Thời gian**: 28/04/2025 – 09/06/2025
- **Nhóm phát triển**:
  - **Trần Thành Phát (leader)**: Backend Developer (Laravel, MongoDB)
  - **Đặng Vương Đại**: Frontend Developer (React, TypeScript)
  - **Nguyễn Phúc Vũ Khánh**: Tester (API, UI)
  - **Huỳnh Minh Thuận**: UI/UX Designer (Figma, responsive)
- **Repository**: [Website_Dat-Mon-An-Noi-Bo](https://github.com/ghtipi/Website_Dat-Mon-An-Noi-Bo) (Public)

## Công nghệ sử dụng

- **Backend**: Laravel 10, MongoDB, JWT (tymon/jwt-auth), barryvdh/laravel-dompdf
- **Frontend**: React 18, TypeScript, Tailwind CSS, axios, react-query, react-router-dom, recharts
- **Database**: MongoDB (local hoặc Atlas)
- **Quản lý mã nguồn**: GitHub (một repository, nhiều nhánh)
- **Thiết kế UI/UX**: Figma
- **Kiểm thử**: Postman, Jest, PHPUnit

## Cấu trúc thư mục

```
food-ordering-system/
├── backend/                    # Mã nguồn backend (Laravel)
│   ├── app/
│   ├── config/
│   ├── routes/
│   ├── .env.example
│   ├── composer.json
├── frontend/                   # Mã nguồn frontend (React + TypeScript)
│   ├── src/
│   ├── public/
│   ├── package.json
├── docs/                       # Tài liệu (API, mockup Figma)
├── .gitignore
├── README.md
```

## Cài đặt và chạy dự án

### Yêu cầu
- **Backend**: PHP >= 8.1, Composer, MongoDB (local hoặc Atlas)
- **Frontend**: Node.js >= 18, npm
- **Git**: Đã cài đặt để clone repository
- **Postman**: Kiểm thử API

### Backend
1. Clone repository:
   ```bash
   git clone https://github.com/ghtipi/Website_Dat-Mon-An-Noi-Bo.git
   cd food-ordering-system/backend
   ```
2. Cài đặt dependencies:
   ```bash
   composer install
   ```
3. Sao chép và cấu hình `.env`:
   ```bash
   cp .env.example .env
   ```
   - Cập nhật MongoDB connection trong `.env`:
     ```
     DB_CONNECTION=mongodb
     DB_HOST=127.0.0.1
     DB_PORT=27017
     DB_DATABASE=food_ordering
     ```
   - Tạo key:
     ```bash
     php artisan key:generate
     php artisan jwt:secret
     ```
4. Chạy server:
   ```bash
   php artisan serve
   ```
   - API chạy tại: `http://localhost:8000`

### Frontend
1. Di chuyển đến thư mục frontend:
   ```bash
   cd food-ordering-system/frontend
   ```
2. Cài đặt dependencies:
   ```bash
   npm install
   ```
3. Sao chép và cấu hình `.env`:
   ```bash
   cp .env.example .env
   ```
   - Cập nhật API URL:
     ```
     VITE_API_URL=http://localhost:8000/api
     ```
4. Chạy ứng dụng:
   ```bash
   npm start
   ```
   - Frontend chạy tại: `http://localhost:3000`

### Database
1. Cài MongoDB (local hoặc dùng MongoDB Atlas).
2. Tạo database `food_ordering`:
   ```bash
   mongosh
   use food_ordering
   ```
3. Chèn dữ liệu mẫu (users, categories, menu):
   ```javascript
   db.users.insertOne({
       email: "admin@example.com",
       password: "$2y$10$...hashed_password...",
       name: "Quản trị viên",
       role: "admin",
       status: "active",
       created_at: new Date(),
       updated_at: new Date()
   });
   db.categories.insertOne({
       name: "Cơm",
       description: "Các món cơm",
       created_at: new Date(),
       updated_at: new Date()
   });
   ```

## Quản lý dự án trên GitHub

### 1. Tạo repository
- **Tên**: `Website_Dat-Mon-An-Noi-Bo` (Private).
- **Khởi tạo**:
  - Thêm `.gitignore` (kết hợp PHP và Node).
  - Thêm `README.md`.
- **Phân quyền**:
  - Owner: Trần Thành Phát (quản lý repository).
  - Collaborators: Đặng Vương Đại (write), Nguyễn Phúc Vũ Khánh (read), Huỳnh Minh Thuận (read).
- **Bảo vệ nhánh**:
  - `main`: Yêu cầu Pull Request (PR) và review trước khi merge.
  - `develop`: Yêu cầu PR để kiểm tra mã.

### 2. Cấu trúc nhánh
- **main**: Mã ổn định, dùng để triển khai (Tuần 7, 09/06/2025).
- **develop**: Mã tích hợp từ các nhánh tính năng, dùng để kiểm thử.
- **feature/<tên-công-việc>**: Nhánh tính năng (ví dụ: `feature/backend-auth-api`, `feature/frontend-login-page`).
- **fix/<tên-lỗi>**: Nhánh sửa lỗi (ví dụ: `fix/login-bug`).

### 3. Quy trình làm việc
1. **Bắt đầu công việc**:
   - Kéo mã mới nhất:
     ```bash
     git checkout develop
     git pull origin develop
     ```
   - Tạo nhánh:
     ```bash
     git checkout -b feature/backend-auth-api
     ```
2. **Làm việc**:
   - Commit mã:
     ```bash
     git add backend/
     git commit -m "Add AuthController with login endpoint"
     ```
   - Đẩy nhánh:
     ```bash
     git push origin feature/backend-auth-api
     ```
3. **Tạo Pull Request**:
   - Vào GitHub, tạo PR từ `feature/backend-auth-api` → `develop`.
   - Mô tả PR:
     - Liên kết Issue (ví dụ: `Closes #12`).
     - Mô tả thay đổi: "Thêm API đăng nhập, kiểm tra Postman".
   - Gán reviewer:
     - Backend: Phát, Khánh.
     - Frontend: Đại, Thuận, Khánh.
4. **Review và Merge**:
   - Reviewer kiểm tra mã, bình luận nếu cần sửa.
   - Merge PR vào `develop` sau khi được duyệt.
   - Xóa nhánh:
     ```bash
     git branch -d feature/backend-auth-api
     ```
5. **Triển khai**:
   - Merge `develop` vào `main`:
     ```bash
     git checkout main
     git merge develop
     git push origin main
     ```

### 4. Quản lý công việc
- **Issues**:
  - Tạo Issue cho mỗi công việc (ví dụ: `[Backend] Tạo OrderController`).
  - Nhãn: `backend`, `frontend`, `ui`, `test`, `bug`, `priority:high`.
  - Gán người phụ trách và Milestone (Tuần 3, Tuần 4, v.v.).
- **Project Board**:
  - Tên: `Food Ordering Project`.
  - Cột: `To Do`, `In Progress`, `Done`, `Blocked`.
  - Di chuyển Issues theo tiến độ.
- **Milestones**:
  - Yêu cầu (28/04–04/05/2025)
  - Thiết kế (05/05–11/05/2025)
  - Lập trình (12/05–08/06/2025)
  - Kiểm thử (09/06/2025)
  - Triển khai (09/06/2025)

### 5. Quy tắc commit
- Commit theo thư mục (`backend/` hoặc `frontend/`).
- Message rõ ràng: "Add backend OrderController", "Fix frontend Login UI".
- Không commit file `.env`, `vendor/`, `node_modules/`.

### 6. Kiểm tra tự động (GitHub Actions)
- Tự động chạy unit test khi đẩy mã:
  ```yaml
  name: Run Tests
  on: [push, pull_request]
  jobs:
    backend:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v3
        - name: Setup PHP
          uses: shivammathur/setup-php@v2
          with:
            php-version: '8.1'
        - name: Install Dependencies
          run: cd backend && composer install
        - name: Run Tests
          run: cd backend && php artisan test
    frontend:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v3
        - name: Setup Node
          uses: actions/setup-node@v3
          with:
            node-version: '18'
        - name: Install Dependencies
          run: cd frontend && npm install
        - name: Run Tests
          run: cd frontend && npm test
  ```

## Danh sách API (Tham khảo)

| **Phương thức** | **Endpoint** | **Mô tả** | **Quyền** |
|-----------------|--------------|-----------|-----------|
| POST | `/api/register` | Đăng ký người dùng | Public |
| POST | `/api/login` | Đăng nhập, trả về JWT | Public |
| POST | `/api/logout` | Đăng xuất | Authenticated |
| GET | `/api/categories` | Lấy danh sách danh mục | Public |
| POST | `/api/categories` | Thêm danh mục | Canteen, Admin |
| GET | `/api/menu` | Lấy danh sách món | Public |
| POST | `/api/orders` | Đặt món | Student, Staff |
| GET | `/api/orders` | Xem danh sách đơn | Student, Staff, Canteen |
| GET | `/api/invoices` | Xem danh sách hóa đơn | Student, Staff, Admin |
| GET | `/api/invoices/{id}/pdf` | Tải PDF hóa đơn | Student, Staff, Admin |
| POST | `/api/notifications` | Gửi thông báo | Admin, Canteen |
| GET | `/api/reports` | Xem báo cáo doanh thu | Admin |

- **Tài liệu chi tiết**: Xem `docs/api.md` (sẽ được cập nhật Tuần 2).
- **Kiểm thử**: Dùng Postman với token JWT trong header `Authorization: Bearer <token>`.

## Triển khai

### Server nội bộ (LAN)
1. **Backend**:
   - Cài Nginx, PHP-FPM, MongoDB.
   - Copy thư mục `backend/` vào server.
   - Chạy:
     ```bash
     cd backend
     composer install
     php artisan optimize
     ```
2. **Frontend**:
   - Build:
     ```bash
     cd frontend
     npm run build
     ```
   - Copy thư mục `frontend/build/` vào server.
3. **Nginx Config**:
   ```nginx
   server {
       listen 80;
       server_name food-ordering.local;
       root /path/to/food-ordering-system/backend/public;
       index index.php;
       location / {
           try_files $uri $uri/ /index.php?$query_string;
       }
       location ~ \.php$ {
           include fastcgi_params;
           fastcgi_pass 127.0.0.1:9000;
           fastcgi_index index.php;
           fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
       }
       location /frontend {
           alias /path/to/food-ordering-system/frontend/build;
           try_files $uri $uri/ /frontend/index.html;
       }
   }
   ```

### Kiểm thử triển khai
- Mời 5 sinh viên/căn tin thử hệ thống.
- Kiểm tra luồng: đăng nhập → đặt món → xem hóa đơn → xem báo cáo.

## Lưu ý
- **Bảo mật**: Không commit `.env`, kiểm tra JWT và phân quyền trước triển khai.
- **Tiếng Việt**: Giao diện, API response, thông báo lỗi phải thống nhất tiếng Việt.
- **Họp nhóm**: Thứ Hai hàng tuần, cập nhật GitHub Project Board.
- **Hỗ trợ**: Liên hệ Phát nếu gặp lỗi Git, server, hoặc API.

## Liên hệ
- **Trần Thành Phát**: Backend, GitHub admin (<email@example.com>)
- **Đặng Vương Đại**: Frontend (<email@example.com>)
- **Nguyễn Phúc Vũ Khánh**: Tester (<email@example.com>)
- **Huỳnh Minh Thuận**: UI/UX (<email@example.com>)
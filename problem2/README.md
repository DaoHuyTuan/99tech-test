# Problem 2 - Token Swap Application

Ứng dụng token swap với real-time pricing sử dụng Socket.IO.

## 📋 Yêu cầu

### Với Docker (Khuyến nghị)

- **Docker**: >= 20.10
- **Docker Compose**: >= 2.0

Kiểm tra cài đặt:

```bash
docker --version
docker-compose --version
```

### Không dùng Docker

- **Node.js**: >= 20.x
- **Yarn**: >= 1.22
- **PostgreSQL**: >= 16

## 🚀 Cách chạy với Docker Compose (Khuyến nghị)

### 1. Clone repository và di chuyển vào thư mục project

```bash
cd problem2
```

### 2. Chạy tất cả services

```bash
docker-compose up
```

Hoặc chạy ở background:

```bash
docker-compose up -d
```

### 3. Truy cập ứng dụng

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **Database**: localhost:5432

### 4. Dừng services

```bash
docker-compose down
```

Để xóa cả volumes (database data):

```bash
docker-compose down -v
```

### 5. Rebuild images

Nếu có thay đổi code, rebuild images:

```bash
docker-compose build
docker-compose up
```

Hoặc rebuild và chạy cùng lúc:

```bash
docker-compose up --build
```

### 6. Xem logs

Xem logs của tất cả services:

```bash
docker-compose logs -f
```

Xem logs của service cụ thể:

```bash
docker-compose logs -f server
docker-compose logs -f frontend
docker-compose logs -f db
```

## 🛠️ Cách chạy không dùng Docker

Nếu máy bạn không có Docker, bạn có thể chạy từng service riêng lẻ.

### Bước 1: Cài đặt PostgreSQL

#### macOS (với Homebrew):

```bash
brew install postgresql@16
brew services start postgresql@16
```

#### Linux (Ubuntu/Debian):

```bash
sudo apt-get update
sudo apt-get install postgresql-16
sudo systemctl start postgresql
```

#### Windows:

Tải và cài đặt từ [PostgreSQL Downloads](https://www.postgresql.org/download/windows/)

### Bước 2: Tạo database

```bash
# Kết nối PostgreSQL
psql -U postgres

# Tạo database
CREATE DATABASE app_db;

# Thoát
\q
```

### Bước 3: Chạy Backend

#### 3.1. Di chuyển vào thư mục backend

```bash
cd backend
```

#### 3.2. Cài đặt dependencies

```bash
yarn install
```

#### 3.3. Tạo file `.env` trong thư mục `backend/`

```bash
# backend/.env
NODE_ENV=development
PORT=4000
DATABASE_URL=postgres://postgres:postgres@localhost:5432/app_db
CORS_ORIGIN=http://localhost:3000
SOCKET_PATH=/ws
```

**Lưu ý**: Thay đổi `postgres:postgres` nếu bạn có username/password khác cho PostgreSQL.

#### 3.4. Chạy database migrations (nếu cần)

```bash
yarn db:push
```

#### 3.5. Seed database (nếu cần)

```bash
psql -U postgres -d app_db -f seed.sql
```

#### 3.6. Chạy backend server

Development mode:

```bash
yarn dev
```

Production mode:

```bash
yarn build
yarn start
```

Backend sẽ chạy tại: http://localhost:4000

### Bước 4: Chạy Frontend

#### 4.1. Mở terminal mới và di chuyển vào thư mục frontend

```bash
cd frontend
```

#### 4.2. Cài đặt dependencies

```bash
yarn install
```

#### 4.3. Tạo file `.env` trong thư mục `frontend/`

```bash
# frontend/.env
VITE_API_URL=http://localhost:4000
VITE_SOCKET_URL=http://localhost:4000
```

**Lưu ý**:

- `VITE_API_URL`: URL của backend API
- `VITE_SOCKET_URL`: URL của backend Socket.IO server
- Nếu backend chạy ở port khác, thay đổi tương ứng

#### 4.4. Chạy frontend development server

```bash
yarn dev
```

Frontend sẽ chạy tại: http://localhost:3000

## 📝 Biến môi trường

### Backend (`.env` trong `backend/`)

| Biến           | Mô tả                            | Mặc định      | Bắt buộc |
| -------------- | -------------------------------- | ------------- | -------- |
| `NODE_ENV`     | Môi trường chạy                  | `development` | Không    |
| `PORT`         | Port của backend server          | `4000`        | Không    |
| `DATABASE_URL` | Connection string của PostgreSQL | -             | **Có**   |
| `CORS_ORIGIN`  | Origin được phép CORS            | `*`           | Không    |
| `SOCKET_PATH`  | Path của Socket.IO               | `/ws`         | Không    |

**Ví dụ DATABASE_URL:**

```
postgres://username:password@host:port/database
```

### Frontend (`.env` trong `frontend/`)

| Biến              | Mô tả                     | Mặc định                | Bắt buộc |
| ----------------- | ------------------------- | ----------------------- | -------- |
| `VITE_API_URL`    | URL của backend API       | `http://localhost:4000` | Không    |
| `VITE_SOCKET_URL` | URL của backend Socket.IO | `http://localhost:4000` | Không    |

**Lưu ý**: Các biến môi trường trong Vite phải bắt đầu với `VITE_` để được expose ra client-side.

## 🏗️ Cấu trúc Project

```
problem2/
├── backend/              # Backend service (Node.js + Express + Socket.IO)
│   ├── src/
│   │   ├── config/       # Configuration files
│   │   ├── db/           # Database schema và client
│   │   ├── socket/       # Socket.IO handlers
│   │   └── server.ts     # Main server file
│   ├── Dockerfile
│   ├── package.json
│   └── seed.sql          # Database seed data
├── frontend/             # Frontend service (React + Vite)
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── containers/   # Container components
│   │   ├── hooks/        # Custom React hooks
│   │   └── types/        # TypeScript types
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.ts
└── docker-compose.yml    # Docker Compose configuration
```

## 🔧 Troubleshooting

### Lỗi kết nối database

- Kiểm tra PostgreSQL đã chạy chưa: `pg_isready` hoặc `psql -U postgres`
- Kiểm tra `DATABASE_URL` trong `.env` có đúng không
- Kiểm tra firewall có chặn port 5432 không

### Lỗi CORS

- Đảm bảo `CORS_ORIGIN` trong backend `.env` khớp với URL frontend
- Hoặc đặt `CORS_ORIGIN=*` để cho phép tất cả origins (chỉ dùng cho development)

### Frontend không kết nối được Socket.IO

- Kiểm tra `VITE_SOCKET_URL` trong frontend `.env`
- Đảm bảo backend đã chạy và Socket.IO server đã khởi động
- Kiểm tra console browser để xem lỗi chi tiết

### Port đã được sử dụng

Nếu port 3000, 4000, hoặc 5432 đã được sử dụng:

**Docker Compose**: Sửa trong `docker-compose.yml`

```yaml
ports:
  - "3001:80" # Thay đổi port bên trái
```

**Không dùng Docker**:

- Backend: Thay đổi `PORT` trong `backend/.env`
- Frontend: Sửa trong `vite.config.ts` hoặc dùng `yarn dev --port 3001`

## 📚 Scripts

### Backend

- `yarn dev`: Chạy development server với hot reload
- `yarn build`: Build production
- `yarn start`: Chạy production server
- `yarn db:generate`: Generate database migrations
- `yarn db:push`: Push schema changes to database

### Frontend

- `yarn dev`: Chạy development server
- `yarn build`: Build production
- `yarn preview`: Preview production build
- `yarn lint`: Chạy ESLint

## 🐳 Docker Commands

```bash
# Build tất cả images
docker-compose build

# Build image cụ thể
docker-compose build server
docker-compose build frontend

# Chạy services
docker-compose up

# Chạy ở background
docker-compose up -d

# Dừng services
docker-compose down

# Xem logs
docker-compose logs -f

# Xem status
docker-compose ps

# Restart service
docker-compose restart server
```

## 📞 Support

Nếu gặp vấn đề, kiểm tra:

1. Logs của services: `docker-compose logs` hoặc console output
2. Environment variables đã đúng chưa
3. Ports có bị conflict không
4. Database đã được tạo và seed chưa

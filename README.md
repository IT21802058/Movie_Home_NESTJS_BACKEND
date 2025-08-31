# 🎬 Movie Home Backend

A **secure, role-based NestJS backend** for a movie management application.  
Supports **admin and user roles**, **JWT authentication with HTTP-only cookies**, **CRUD operations**, and follows **best practices** in error handling, validation, and testing.

---

## 🚀 Features
- 🔐 **Authentication & Authorization**
  - JWT + **HTTP-only cookies** (secure, `sameSite=lax`)
  - Role-based access control (**Admin vs User**)
- 🎥 **Movie Management**
  - Public browsing of movies
  - Admin-only: Create, Update, Delete
- 👥 **User Management**
  - Admin can list and view users
- 🛡️ **Security Best Practices**
  - Global exception handling
  - Input validation with `class-validator`
  - DTO-based request validation
- 🧪 **Testing**
  - Unit & integration testing with **Jest**
- ☁️ **Deployment-Ready**
  - Configured for **GCP Cloud Run** (to be done soon)

---

## 🛠️ Tech Stack

| Layer            | Technology |
|------------------|------------|
| **Framework**    | NestJS |
| **Database**     | MySQL (via TypeORM) |
| **Auth**         | JWT + HTTP-only cookies |
| **RBAC**         | Role-based guards (`admin`, `user`) |
| **Validation**   | `class-validator` + `ValidationPipe` |
| **Error Handling** | Global `HttpExceptionFilter` |
| **Testing**      | Jest (unit & integration) |
| **Deployment**   | GCP Cloud Run (to be done soon)|

---

## 🗂️ Project Structure
```
src/
├── auth/               # Authentication: JWT, login, register
├── users/              # User management (admin-only)
├── movies/             # Movie CRUD
├── guards/             # JwtAuthGuard, RolesGuard
├── decorators/         # @Roles()
├── database/           # TypeORM config
├── filters/            # HttpExceptionFilter
├── utils/              # Constants (e.g., UserRole)
└── main.ts             # App bootstrap (CORS, cookies, global pipes)
```

---

## 🔐 Authentication & Authorization

### ✅ JWT with HTTP-only Cookies
- JWT is issued on login and stored in `Authentication` cookie.
- Cookie flags:
  - `httpOnly`
  - `secure` (in production)
  - `sameSite=lax`
- **Frontend never reads JWT manually** → browser sends it automatically.

### ✅ Role-Based Access
- Roles: **`admin`**, **`user`**
- Example usage:
  ```ts
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  ```
- **Admin** → manage movies & users  
- **User** → browse movies only  

---

## 📡 API Routes

### 🔹 Auth Routes
**POST /auth/register** → Register new user  
**POST /auth/login** → Login + set JWT cookie  
**GET /auth/profile** → Get logged-in user profile  

---

### 🔹 Movies Routes
**GET /movies** → Public list of all movies  
**GET /movies/:id** → Get single movie by ID  
**POST /movies** → Create movie (**Admin only**)  
**PUT /movies/:id** → Update movie (**Admin only**)  
**DELETE /movies/:id** → Delete movie (**Admin only**)  

---

### 🔹 Users Routes (Admin Only)
**GET /users** → List all users  
**GET /users/:id** → Get single user (no password returned)  

---

## 🛡️ Error Handling

All errors handled via **HttpExceptionFilter**:  
```json
{
  "statusCode": 403,
  "message": "Insufficient permissions",
  "error": "Forbidden",
  "timestamp": "2025-08-30T12:00:00Z",
  "path": "/users"
}
```
Logs are also written to console:
```
ERROR [HttpExceptionFilter] GET /users -> 403 - "Insufficient permissions"
```

---

## ✅ Best Practices Implemented

| Feature | Status |
|---------|--------|
| DTOs + Validation | ✅ `class-validator`, `ValidationPipe` |
| Global Error Handling | ✅ `HttpExceptionFilter` |
| Secure Cookies | ✅ HTTP-only + Secure |
| Role-Based Access | ✅ `RolesGuard`, `@Roles()` |
| Modular Structure | ✅ `auth/`, `users/`, `movies/` |
| Testing | ✅ Jest (unit + integration) |
| API Documentation | ✅ Swagger-ready (`@ApiTags`, `@ApiResponse`) |

---

## ⚡ Getting Started

### 1️⃣ Install dependencies
```bash
npm install
```

### 2️⃣ Start Development Server
```bash
npm run start:dev
```
Server runs at: **http://localhost:5000**

---

## 🌐 Environment Variables
Create a `.env` file:
```env
JWT_SECRET=your-super-secret-key-here
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=movie_home
```

---

## 🧪 Testing

Run tests with:
```bash
npm run test
```

### 🔎 Postman Testing
- Import: `movie-home.postman_collection.json`
- Flow:
  1. **Register → Login** → Cookie set
  2. Access protected routes
  3. `/users` with `user` role → **403 Forbidden**  

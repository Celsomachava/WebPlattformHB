# 🚀 Heduschka Service Platform - Complete Setup

## Quick Start (Windows)

### Option 1: Automated Setup (Recommended)
```bash
# Double-click this file or run:
start-all.bat
```

This will:
- Install dependencies (if needed)
- Start Backend on port 3001
- Start Frontend on port 3000

### Option 2: Manual Setup

#### 1. Backend Setup
```bash
cd Backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run dev
```

#### 2. Frontend Setup (in new terminal)
```bash
npm install
npm run dev
```

### Option 3: Using npm scripts
```bash
# Install all dependencies first
npm install
cd Backend && npm install && cd ..

# Start both servers
npm start
```

## 📋 Prerequisites

### Required
- Node.js 16+ ([Download](https://nodejs.org/))
- MySQL 8.0+ ([Download](https://dev.mysql.com/downloads/))
- npm (comes with Node.js)

### Optional
- Git for version control

## 🗄️ Database Setup

### 1. Create Database
```bash
mysql -u root -p
```

```sql
CREATE DATABASE heduschka_service;
exit;
```

### 2. Run Schema
```bash
mysql -u root -p heduschka_service < Backend/database/schema.sql
```

### 3. Generate Password Hashes
```bash
cd Backend
node utils/hashPassword.js
```

Copy the generated hashes and update `Backend/database/seed.sql`

### 4. Seed Demo Data
```bash
mysql -u root -p heduschka_service < Backend/database/seed.sql
```

## ⚙️ Configuration

### Backend (.env)
```env
PORT=3001
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=heduschka_service

JWT_SECRET=change-this-to-random-string
JWT_EXPIRES_IN=7d

CORS_ORIGIN=http://localhost:3000
```

### Frontend (vite.config.js)
Already configured to proxy API requests to `http://localhost:3001`

## 🧪 Testing the Setup

### 1. Check Backend Health
```bash
curl http://localhost:3001/health
```

Expected: `{"status":"OK","timestamp":"..."}`

### 2. Test Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"userId\":\"KUNDE_001\",\"password\":\"demo123\"}"
```

### 3. Open Frontend
Navigate to: `http://localhost:3000`

Login with:
- **Customer**: KUNDE_001 / demo123
- **Admin**: ADMIN_001 / admin123

## 📦 Project Structure

```
WebPlattformHB/
├── Backend/                 # Node.js/Express API
│   ├── config/             # Database config
│   ├── middleware/         # Auth & error handling
│   ├── routes/             # API endpoints
│   ├── database/           # Schema & seeds
│   ├── .env               # Environment config
│   └── server.js          # Entry point
│
├── src/                    # React Frontend
│   ├── components/        # React components
│   ├── services/          # API & offline services
│   ├── hooks/             # Custom hooks
│   └── pages/             # Page components
│
├── public/                # Static assets & PWA
├── start-all.bat          # Automated startup
└── package.json           # Frontend dependencies
```

## 🔧 Common Issues

### Port Already in Use
```bash
# Windows: Kill process on port
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### Database Connection Failed
- Verify MySQL is running: `services.msc` → MySQL
- Check credentials in `Backend/.env`
- Ensure database exists: `SHOW DATABASES;`

### CORS Errors
- Verify Backend is running on port 3001
- Check `CORS_ORIGIN` in Backend `.env`
- Ensure Frontend proxy is configured in `vite.config.js`

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

cd Backend
rm -rf node_modules package-lock.json
npm install
```

## 🌐 URLs

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | React PWA |
| Backend API | http://localhost:3001 | REST API |
| Health Check | http://localhost:3001/health | API status |
| API Docs | Backend/README.md | Endpoint documentation |

## 🎯 Development Workflow

### Starting Development
```bash
# Terminal 1: Backend
cd Backend
npm run dev

# Terminal 2: Frontend
npm run dev
```

### Making Changes
- Backend changes auto-reload (nodemon)
- Frontend changes hot-reload (Vite HMR)

### Testing
```bash
# Frontend tests
npm test

# E2E tests
npm run test:e2e

# Backend API tests
cd Backend
# Use Postman or curl
```

## 🚀 Production Deployment

### Build Frontend
```bash
npm run build
# Output: dist/
```

### Start Backend (Production)
```bash
cd Backend
NODE_ENV=production npm start
```

### Environment Variables (Production)
- Set strong `JWT_SECRET`
- Configure production database
- Update `CORS_ORIGIN` to production domain
- Enable HTTPS

## 📞 Support

### Demo Accounts
- **Customer**: KUNDE_001 / demo123
- **Admin**: ADMIN_001 / admin123

### Documentation
- Frontend: `README.md`
- Backend: `Backend/README.md`
- API Endpoints: `Backend/README.md#api-endpoints`

---

**© 2024 Heduschka GmbH** • 🔐 Secure • 🛡️ DSGVO-compliant

# 🚀 Heduschka Platform - Quick Start Guide

## ⚡ One-Command Setup

```bash
# Run complete setup
setup.bat

# Then start everything
npm start
```

## 📋 What Happens

### `npm start` runs:
1. **Backend** on port 3001 (Express API + MySQL)
2. **Frontend** on port 3000 (React PWA)
3. **Auto-proxy** `/api` requests to backend

### Data Flow:
```
Frontend (React) 
    ↓ /api/* requests
Vite Proxy 
    ↓ http://localhost:3001/api
Backend (Express) 
    ↓ SQL queries
MySQL Database
```

## 🗄️ Database Setup

### Quick Setup
```bash
cd Backend
setup-db.bat
```

### Manual Setup
```bash
# 1. Create database
mysql -u root -p -e "CREATE DATABASE heduschka_service;"

# 2. Run schema
mysql -u root -p heduschka_service < Backend/database/schema.sql

# 3. Insert demo data
mysql -u root -p heduschka_service < Backend/database/seed.sql
```

## ⚙️ Configuration

### Backend/.env
```env
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=heduschka_service
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:3000
```

### Frontend (automatic)
- Vite proxy configured in `vite.config.js`
- API calls use `/api` (proxied to backend)

## 🎯 Usage

### Start Development
```bash
npm start
```

### Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

### Demo Accounts
- **Customer**: `KUNDE_001` / `demo123`
- **Admin**: `ADMIN_001` / `admin123`

## 📊 Features Working

### ✅ Authentication
- Login with database credentials
- JWT token authentication
- Role-based access (customer/admin)

### ✅ Service Requests
- Create requests (saved to database)
- View requests (fetched from database)
- Offline support (IndexedDB cache)
- Auto-sync when online

### ✅ Customer Management
- View profile (from database)
- Update profile (saved to database)
- Admin can manage all customers

### ✅ Anlagen (Assets)
- View customer's anlagen (from database)
- QR code lookup
- Admin can manage all anlagen

## 🔄 Offline-First Architecture

```
User Action
    ↓
IndexedDB (local cache)
    ↓
Online? → YES → Sync to Backend → MySQL
    ↓
    NO → Queue for later sync
```

### How It Works:
1. **Online**: Data saved to IndexedDB + Backend
2. **Offline**: Data saved to IndexedDB only
3. **Back Online**: Auto-sync queued data to Backend

## 🧪 Testing

### Test Backend
```bash
# Health check
curl http://localhost:3001/health

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"userId\":\"KUNDE_001\",\"password\":\"demo123\"}"
```

### Test Frontend
1. Open http://localhost:3000
2. Login with KUNDE_001 / demo123
3. Submit service request
4. Check database:
```sql
SELECT * FROM service_requests;
```

### Test Offline Sync
1. Open DevTools (F12)
2. Network tab → Offline
3. Submit service request
4. Go back Online
5. Watch auto-sync in console

## 📁 Key Files

### Frontend
- `src/services/api.js` - API client with all endpoints
- `src/services/authService.js` - Authentication with backend
- `src/services/syncService.ts` - Offline sync logic
- `vite.config.js` - Proxy configuration

### Backend
- `server.js` - Express app entry point
- `routes/auth.js` - Authentication endpoints
- `routes/service.js` - Service request endpoints
- `routes/customer.js` - Customer management
- `routes/anlagen.js` - Asset management
- `middleware/auth.js` - JWT authentication
- `config/database.js` - MySQL connection

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check MySQL is running
services.msc → MySQL

# Verify .env configuration
cd Backend
type .env
```

### Frontend can't connect to backend
```bash
# Verify backend is running on 3001
curl http://localhost:3001/health

# Check proxy in vite.config.js
```

### Database errors
```bash
# Verify database exists
mysql -u root -p -e "SHOW DATABASES;"

# Re-run setup
cd Backend
setup-db.bat
```

### CORS errors
- Ensure `CORS_ORIGIN=http://localhost:3000` in Backend/.env
- Restart backend after changing .env

## 📚 API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Current user
- `POST /api/auth/validate` - Validate token

### Service Requests
- `GET /api/serviceanfragen` - List requests
- `POST /api/serviceanfragen` - Create request
- `POST /api/serviceanfragen/sync` - Sync offline requests
- `PATCH /api/serviceanfragen/:id/status` - Update status (admin)

### Customers
- `GET /api/kunden/me` - Current profile
- `GET /api/kunden` - List all (admin)
- `PUT /api/kunden/:id` - Update profile

### Anlagen
- `GET /api/anlagen` - List anlagen
- `GET /api/anlagen/qr/:code` - Get by QR code

**Full API docs**: `Backend/README.md`

## 🚀 Production Deployment

### Build Frontend
```bash
npm run build
# Output: dist/
```

### Configure Production
1. Set strong `JWT_SECRET` in Backend/.env
2. Configure production database
3. Update `CORS_ORIGIN` to production domain
4. Enable HTTPS
5. Set `NODE_ENV=production`

---

**© 2024 Heduschka GmbH** • Full-Stack PWA • Database-Backed • Offline-First

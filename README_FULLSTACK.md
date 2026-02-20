# 🚀 Heduschka Service Platform

**Complete Full-Stack PWA for Digital Filter Service Requests**

Progressive Web App with offline-first architecture, JWT authentication, and MySQL backend.

---

## ⚡ Quick Start

### Windows (Recommended)
```bash
# Double-click or run:
start-all.bat
```

### Cross-Platform
```bash
# Install dependencies
npm install
cd Backend && npm install && cd ..

# Start both servers
npm start
```

**Access the app**: http://localhost:3000

---

## 📋 What's Included

### Frontend (React PWA)
- ✅ Offline-first architecture with IndexedDB
- 🔐 JWT authentication
- 📱 Installable PWA
- 🔄 Automatic sync when online
- 🛡️ DSGVO-compliant forms

### Backend (Node.js/Express)
- 🔒 JWT authentication with bcrypt
- 🗄️ MySQL database
- 🛡️ Security middleware (Helmet, CORS, rate limiting)
- 📊 RESTful API
- 🔄 Offline sync endpoint

---

## 🛠️ Prerequisites

| Requirement | Version | Download |
|-------------|---------|----------|
| Node.js | 16+ | [nodejs.org](https://nodejs.org/) |
| MySQL | 8.0+ | [mysql.com](https://dev.mysql.com/downloads/) |
| npm | 8+ | Included with Node.js |

---

## 📦 Installation

### 1. Clone Repository
```bash
git clone <repository-url>
cd WebPlattformHB
```

### 2. Install Dependencies
```bash
# Frontend
npm install

# Backend
cd Backend
npm install
cd ..
```

### 3. Database Setup
```bash
# Create database
mysql -u root -p -e "CREATE DATABASE heduschka_service;"

# Run schema
mysql -u root -p heduschka_service < Backend/database/schema.sql

# Generate password hashes
cd Backend
node utils/hashPassword.js

# Update seed.sql with generated hashes, then seed
mysql -u root -p heduschka_service < Backend/database/seed.sql
cd ..
```

### 4. Configure Environment
```bash
# Backend
cd Backend
cp .env.example .env
# Edit .env with your database credentials
cd ..
```

### 5. Start Servers
```bash
# Option A: Automated (Windows)
start-all.bat

# Option B: npm script
npm start

# Option C: Manual (2 terminals)
# Terminal 1:
cd Backend && npm run dev

# Terminal 2:
npm run dev
```

---

## 🌐 Access Points

| Service | URL | Credentials |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | See below |
| **Backend API** | http://localhost:3001 | - |
| **Health Check** | http://localhost:3001/health | - |

### Demo Accounts
- **Customer**: `KUNDE_001` / `demo123`
- **Admin**: `ADMIN_001` / `admin123`

---

## 📁 Project Structure

```
WebPlattformHB/
│
├── Backend/                    # Node.js/Express API
│   ├── config/                # Database configuration
│   ├── middleware/            # Auth & error handling
│   ├── routes/                # API endpoints
│   │   ├── auth.js           # Authentication
│   │   ├── service.js        # Service requests
│   │   ├── customer.js       # Customer management
│   │   └── anlagen.js        # Asset management
│   ├── database/
│   │   ├── schema.sql        # Database schema
│   │   └── seed.sql          # Demo data
│   ├── utils/
│   │   └── hashPassword.js   # Password utility
│   ├── .env.example          # Environment template
│   ├── server.js             # Entry point
│   └── README.md             # Backend docs
│
├── src/                       # React Frontend
│   ├── components/           # React components
│   │   ├── auth/            # Login/Auth
│   │   ├── forms/           # Service forms
│   │   ├── dashboard/       # Dashboards
│   │   └── ui/              # UI components
│   ├── services/            # Business logic
│   │   ├── authService.js   # Authentication
│   │   ├── optimizedDB.js   # IndexedDB
│   │   ├── syncService.ts   # Offline sync
│   │   └── api.js           # API client
│   ├── hooks/               # Custom React hooks
│   ├── pages/               # Page components
│   └── App.jsx              # Main app
│
├── public/                   # Static assets
│   ├── manifest.json        # PWA manifest
│   └── service-worker.js    # Service worker
│
├── start-all.bat            # Automated startup (Windows)
├── SETUP.md                 # Detailed setup guide
├── package.json             # Frontend dependencies
└── README.md                # This file
```

---

## 🔧 Configuration

### Backend Environment (.env)
```env
PORT=3001
NODE_ENV=development

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=heduschka_service

# JWT
JWT_SECRET=change-this-in-production
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Frontend Proxy (vite.config.js)
Already configured to proxy `/api` requests to `http://localhost:3001`

---

## 🧪 Testing

### Manual Testing
```bash
# Health check
curl http://localhost:3001/health

# Login test
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"userId":"KUNDE_001","password":"demo123"}'
```

### Automated Tests
```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

### Offline Testing
1. Open DevTools (F12)
2. Network tab → Offline
3. Submit service request
4. Go back online
5. Watch auto-sync

---

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/validate` - Validate token
- `GET /api/auth/me` - Get current user

### Service Requests
- `GET /api/serviceanfragen` - List requests
- `POST /api/serviceanfragen` - Create request
- `PATCH /api/serviceanfragen/:id/status` - Update status
- `POST /api/serviceanfragen/sync` - Sync offline requests

### Customers
- `GET /api/kunden/me` - Current profile
- `GET /api/kunden` - List all (admin)
- `POST /api/kunden` - Create (admin)
- `PUT /api/kunden/:id` - Update
- `DELETE /api/kunden/:id` - Delete (admin)

### Anlagen (Assets)
- `GET /api/anlagen` - List anlagen
- `GET /api/anlagen/qr/:code` - Get by QR code
- `POST /api/anlagen` - Create (admin)
- `PUT /api/anlagen/:id` - Update (admin)
- `DELETE /api/anlagen/:id` - Delete (admin)

**Full API documentation**: `Backend/README.md`

---

## 🚀 Features

### Frontend
- ✅ **Offline-First**: Full functionality without internet
- 🔐 **Secure Auth**: Token-based authentication
- 📱 **PWA**: Installable on all devices
- 🔄 **Auto-Sync**: Automatic synchronization
- 🛡️ **DSGVO**: Privacy compliance
- 📊 **Performance**: Optimized loading

### Backend
- 🔒 **JWT Auth**: Secure token authentication
- 🗄️ **MySQL**: Relational database
- 🛡️ **Security**: Helmet, CORS, rate limiting
- 📊 **RESTful**: Clean API design
- 🔄 **Sync Support**: Offline sync endpoint
- 👥 **Role-Based**: Customer/Admin permissions

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### Database Connection Failed
- Check MySQL is running
- Verify credentials in `Backend/.env`
- Ensure database exists

### CORS Errors
- Verify Backend is on port 3001
- Check `CORS_ORIGIN` in `.env`
- Ensure Frontend proxy is configured

### Dependencies Issues
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

cd Backend
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Documentation

- **Setup Guide**: `SETUP.md`
- **Backend API**: `Backend/README.md`
- **Frontend Features**: Main `README.md` (this file)
- **Testing Guide**: `TESTING.md`

---

## 🔐 Security

- JWT token authentication
- Bcrypt password hashing
- Rate limiting (100 req/15min)
- SQL injection protection
- XSS protection
- HTTPS enforcement (production)
- DSGVO compliance

---

## 📈 Performance

### Target Metrics
- First Contentful Paint < 1.5s
- Largest Contentful Paint < 2.5s
- Time to Interactive < 3.5s
- PWA Score: 100%

### Optimizations
- Code splitting
- Service worker caching
- IndexedDB optimization
- React memoization
- Mobile-first design

---

## 🚀 Production Deployment

### Build
```bash
# Frontend
npm run build

# Backend
cd Backend
NODE_ENV=production npm start
```

### Checklist
- [ ] Set strong `JWT_SECRET`
- [ ] Configure production database
- [ ] Enable HTTPS
- [ ] Update `CORS_ORIGIN`
- [ ] Set up database backups
- [ ] Configure logging
- [ ] Run security audit

---

## 📞 Support

For issues or questions:
1. Check `SETUP.md` for detailed setup
2. Review `Backend/README.md` for API docs
3. Run tests: `npm test`
4. Check browser DevTools for errors

---

**© 2024 Heduschka GmbH** • 🔐 Secure • 🛡️ DSGVO-compliant • 📱 PWA

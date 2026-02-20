# Heduschka Backend API

🔒 **Secure REST API for Heduschka Service Platform**

Node.js/Express backend with MySQL database, JWT authentication, and offline sync support.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- MySQL 8.0+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your database credentials
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=heduschka_service
# JWT_SECRET=your-secret-key
```

### Database Setup

```bash
# Create database and tables
mysql -u root -p < database/schema.sql

# Generate password hashes
node utils/hashPassword.js

# Update seed.sql with generated hashes, then seed data
mysql -u root -p heduschka_service < database/seed.sql
```

### Start Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server runs on `http://localhost:3001`

## 📋 API Endpoints

### Authentication

#### POST `/api/auth/login`
Login with customer credentials
```json
{
  "userId": "KUNDE_001",
  "password": "demo123"
}
```

Response:
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "KUNDE_001",
    "name": "Max Mustermann",
    "company": "Mustermann GmbH",
    "email": "max@mustermann.de",
    "phone": "+49 123 456789",
    "role": "customer"
  }
}
```

#### POST `/api/auth/validate`
Validate JWT token
```json
{
  "token": "jwt_token_here"
}
```

#### GET `/api/auth/me`
Get current user profile (requires Bearer token)

### Service Requests

All endpoints require `Authorization: Bearer <token>` header

#### GET `/api/serviceanfragen`
Get all service requests (filtered by customer for non-admins)

#### POST `/api/serviceanfragen`
Create new service request
```json
{
  "anlagenId": "FA_001",
  "standort": "Halle 1",
  "filtertyp": "Filteranlage Typ A",
  "serviceart": "Wartung",
  "dringlichkeit": "normal",
  "wunschtermin": "2024-02-15",
  "zeitfenster": "vormittags",
  "bemerkungen": "Routinewartung"
}
```

#### PATCH `/api/serviceanfragen/:id/status`
Update service request status (admin only)
```json
{
  "status": "bearbeitet"
}
```

#### POST `/api/serviceanfragen/sync`
Sync multiple offline requests
```json
{
  "requests": [
    {
      "anlagenId": "FA_001",
      "standort": "Halle 1",
      "serviceart": "Wartung",
      ...
    }
  ]
}
```

### Customers

#### GET `/api/kunden/me`
Get current customer profile

#### GET `/api/kunden`
Get all customers (admin only)

#### GET `/api/kunden/:kundennummer`
Get customer by ID (admin only)

#### POST `/api/kunden`
Create new customer (admin only)
```json
{
  "kundennummer": "KUNDE_004",
  "firmenname": "New Company GmbH",
  "ansprechpartner": "John Doe",
  "email": "john@company.de",
  "telefon": "+49 123 456789",
  "password": "secure_password",
  "role": "customer"
}
```

#### PUT `/api/kunden/:kundennummer`
Update customer (own profile or admin)

#### DELETE `/api/kunden/:kundennummer`
Delete customer (admin only)

### Anlagen (Assets)

#### GET `/api/anlagen`
Get all anlagen (filtered by customer for non-admins)

#### GET `/api/anlagen/qr/:qr_code`
Get anlage by QR code

#### POST `/api/anlagen`
Create new anlage (admin only)
```json
{
  "anlagen_id": "FA_004",
  "kunden_id": "KUNDE_001",
  "standort": "Halle 3",
  "filtertyp": "Filteranlage Typ D",
  "qr_code_id": "QR_FA004"
}
```

#### PUT `/api/anlagen/:id`
Update anlage (admin only)

#### DELETE `/api/anlagen/:id`
Delete anlage (admin only)

### Arbeitsauftrag (Work Orders)

#### GET `/api/arbeitsauftrag`
Get all work orders (filtered by customer for non-admins)

#### GET `/api/arbeitsauftrag/:id`
Get work order by ID or nummer

#### POST `/api/arbeitsauftrag`
Create new work order
```json
{
  "service_anfrage_id": "uuid-here",
  "anlagen_id": "FA_001",
  "techniker": "Hans Müller",
  "geplanter_termin": "2024-02-15",
  "durchgefuehrte_arbeiten": "Filter gewechselt",
  "verwendete_materialien": [{"name": "Filter", "menge": 2}],
  "bemerkungen": "Alles OK",
  "status": "geplant"
}
```

#### PUT `/api/arbeitsauftrag/:id`
Update work order

#### DELETE `/api/arbeitsauftrag/:id`
Delete work order (admin only)

### Pruefprotokoll (Inspection Protocols)

#### GET `/api/pruefprotokoll`
Get all inspection protocols (filtered by customer for non-admins)

#### GET `/api/pruefprotokoll/:id`
Get inspection protocol by ID or nummer

#### POST `/api/pruefprotokoll`
Create new inspection protocol
```json
{
  "service_anfrage_id": "uuid-here",
  "anlagen_id": "FA_001",
  "pruefdatum": "2024-02-15",
  "naechste_pruefung": "2025-02-15",
  "pruefart": "DGUV 201-004",
  "pruefergebnis": "bestanden",
  "pruefpunkte": [{"punkt": "Sichtprüfung", "ergebnis": "OK"}],
  "maengel": [],
  "pruefer_name": "Max Mustermann",
  "pruefer_qualifikation": "Sachkundiger",
  "status": "freigegeben"
}
```

#### PUT `/api/pruefprotokoll/:id`
Update inspection protocol

#### DELETE `/api/pruefprotokoll/:id`
Delete inspection protocol (admin only)

## 🔒 Security Features

- **JWT Authentication**: Token-based auth with configurable expiration
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Helmet.js**: Security headers
- **CORS**: Configurable origins
- **Role-Based Access**: Customer vs Admin permissions
- **SQL Injection Protection**: Parameterized queries

## 🗄️ Database Schema

### customers
- id (UUID)
- kundennummer (unique)
- firmenname
- ansprechpartner
- email
- telefon
- password (hashed)
- role (customer/admin)
- created_at, updated_at

### anlagen
- id (UUID)
- anlagen_id (unique)
- kunden_id (FK to customers)
- standort
- filtertyp
- qr_code_id (unique)
- created_at, updated_at

### service_requests
- id (UUID)
- nummer (unique)
- kunden_id (FK to customers)
- anlagen_id
- standort
- filtertyp
- serviceart
- dringlichkeit (normal/dringend)
- wunschtermin
- zeitfenster
- bemerkungen
- status (neu/bearbeitet/abgeschlossen/storniert)
- created_at, updated_at

### arbeitsauftrag
- id (UUID)
- nummer (unique)
- kunden_id (FK to customers)
- service_anfrage_id (FK to service_requests)
- anlagen_id
- techniker
- geplanter_termin
- tatsaechlicher_termin
- arbeitszeit_stunden
- durchgefuehrte_arbeiten
- verwendete_materialien (JSON)
- bemerkungen
- status (geplant/in_bearbeitung/abgeschlossen/storniert)
- created_at, updated_at

### pruefprotokoll
- id (UUID)
- nummer (unique)
- kunden_id (FK to customers)
- service_anfrage_id (FK to service_requests)
- anlagen_id
- pruefdatum
- naechste_pruefung
- pruefart
- pruefergebnis (bestanden/nicht_bestanden/bedingt_bestanden)
- pruefpunkte (JSON)
- maengel (JSON)
- bemerkungen
- pruefer_name
- pruefer_qualifikation
- status (entwurf/freigegeben/archiviert)
- created_at, updated_at

## 🧪 Testing

```bash
# Test database connection
curl http://localhost:3001/health

# Test login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"userId":"KUNDE_001","password":"demo123"}'

# Test authenticated endpoint
curl http://localhost:3001/api/serviceanfragen \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📦 Demo Credentials

### Customer
- **ID**: KUNDE_001
- **Password**: demo123

### Admin
- **ID**: ADMIN_001
- **Password**: admin123

## 🔧 Environment Variables

```env
PORT=3001
NODE_ENV=development

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=heduschka_service

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3000
```

## 📊 Project Structure

```
Backend/
├── config/
│   └── database.js          # MySQL connection pool
├── middleware/
│   ├── auth.js              # JWT authentication
│   └── errorHandler.js      # Global error handler
├── routes/
│   ├── auth.js              # Authentication endpoints
│   ├── service.js           # Service request endpoints
│   ├── customer.js          # Customer management
│   ├── anlagen.js           # Asset management
│   ├── arbeitsauftrag.js    # Work order endpoints
│   ├── pruefprotokoll.js    # Inspection protocol endpoints
│   ├── offers.js            # Offers management
│   └── invoices.js          # Invoices management
├── database/
│   ├── schema.sql           # Database schema
│   └── seed.sql             # Demo data
├── utils/
│   └── hashPassword.js      # Password hashing utility
├── .env.example             # Environment template
├── server.js                # Express app entry point
└── package.json
```

## 🚀 Deployment

### Production Checklist

- [ ] Set strong JWT_SECRET
- [ ] Configure production database
- [ ] Enable HTTPS
- [ ] Set NODE_ENV=production
- [ ] Configure CORS for production domain
- [ ] Set up database backups
- [ ] Configure logging
- [ ] Set up monitoring

### Docker (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["node", "server.js"]
```

## 🐛 Troubleshooting

**Database connection failed**
- Check MySQL is running
- Verify credentials in .env
- Ensure database exists

**JWT errors**
- Check JWT_SECRET is set
- Verify token format: `Bearer <token>`
- Check token expiration

**CORS errors**
- Add frontend URL to CORS_ORIGIN
- Check credentials: true in frontend

---

**© 2024 Heduschka GmbH** • 🔐 Secure API • 🛡️ DSGVO-compliant

# Heduschka Backend API

## Setup

```bash
cd Backend
npm install
npm run dev
```

Server runs on `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with user ID
- `POST /api/auth/validate` - Validate token

### Service Requests
- `GET /api/service/requests` - Get service requests
- `POST /api/service/requests` - Create service request
- `PATCH /api/service/requests/:id/status` - Update status (admin only)
- `POST /api/service/sync` - Sync offline requests

### Customer
- `GET /api/customer/profile` - Get customer profile
- `GET /api/customer/anlagen` - Get customer assets
- `GET /api/customer/anlagen/:id` - Get specific asset

## Mock Users
- Customer: `KUNDE_001` (token: `token_kunde_001`)
- Admin: `ADMIN_001` (token: `token_admin_001`)

## Headers
```
Authorization: Bearer <token>
Content-Type: application/json
```
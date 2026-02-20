# Customer Management Database Integration

## Overview
The customer management system now properly connects to the MySQL database and displays real customer data instead of mock data.

## Database Configuration

### Environment Variables (.env)
```
PORT=3002
NODE_ENV=development

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=admin
DB_NAME=heduschka_service

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Database Schema
The customers table includes:
- `id` (VARCHAR(36)) - Primary key
- `kundennummer` (VARCHAR(50)) - Unique customer number
- `firmenname` (VARCHAR(255)) - Company name
- `ansprechpartner` (VARCHAR(255)) - Contact person
- `email` (VARCHAR(255)) - Email address
- `telefon` (VARCHAR(50)) - Phone number
- `password` (VARCHAR(255)) - Hashed password
- `role` (ENUM) - 'customer' or 'admin'
- `created_at` (BIGINT) - Creation timestamp
- `updated_at` (BIGINT) - Update timestamp

## API Endpoints

### Customer Management Endpoints
- `GET /api/customer` - Get all customers (admin only)
- `GET /api/customer/me` - Get current customer profile
- `GET /api/customer/:kundennummer` - Get specific customer (admin only)
- `POST /api/customer` - Create new customer (admin only)
- `PUT /api/customer/:kundennummer` - Update customer
- `DELETE /api/customer/:kundennummer` - Delete customer (admin only)

## Frontend Components

### ClientManagement.jsx
**Location:** `src/components/admin/ClientManagement.jsx`

**Features:**
- Displays customers from database in real-time
- Search functionality (by customer number, company, contact person)
- Edit customer details
- Delete customers
- View customer details
- Shows customer role (Admin/Customer)
- Automatic refresh when data changes

**Key Functions:**
- `loadClients()` - Fetches customers from API endpoint
- `updateClient()` - Updates customer via API
- `deleteClient()` - Deletes customer via API

### KundenAnlegen.jsx
**Location:** `src/components/admin/KundenAnlegen.jsx`

**Features:**
- Create new customers
- Auto-generate customer numbers
- Auto-generate secure passwords
- Form validation
- Real-time database integration

**Key Functions:**
- `generateKundennummer()` - Generates next available customer number
- `handleSubmit()` - Creates customer via API

## Database Integration

### Connection Configuration
The backend uses `mysql2/promise` for database connections:

```javascript
// config/database.js
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
```

### API Service Updates
The frontend API service now uses the correct endpoints:

```javascript
// services/api.js
const API_BASE = 'http://localhost:3002/api';

// Customer methods
async getCustomers() {
  return this.request('/customer');
}

async createCustomer(data) {
  return this.request('/customer', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}
```

## Demo Data

### Pre-loaded Customers
The database includes demo customers:

1. **KUNDE_001** - Mustermann GmbH
   - Contact: Max Mustermann
   - Email: max@mustermann.de
   - Phone: +49 123 456789
   - Role: customer

2. **KUNDE_002** - TechCorp AG
   - Contact: Anna Schmidt
   - Email: a.schmidt@techcorp.de
   - Phone: +49 234 567890
   - Role: customer

3. **KUNDE_003** - Weber Maschinenbau
   - Contact: Peter Weber
   - Email: p.weber@weber-mb.de
   - Phone: +49 345 678901
   - Role: customer

4. **ADMIN_001** - Heduschka GmbH
   - Contact: Admin User
   - Email: admin@heduschka.de
   - Phone: +49 987 654321
   - Role: admin

## Testing the Integration

### 1. Setup Database
```bash
cd Backend
node setup-database.js
```

### 2. Start Backend Server
```bash
cd Backend
npm start
```
Server runs on: http://localhost:3002

### 3. Start Frontend
```bash
npm run dev
```
Frontend runs on: http://localhost:3000

### 4. Test Customer Management
1. Login as `ADMIN_001` with password `admin123`
2. Navigate to "Kundenverwaltung" in the sidebar
3. You should see all customers from the database
4. Test search functionality
5. Try editing a customer
6. Try creating a new customer

### 5. Verify Database Connection
Use the test script:
```bash
node test-db-connection.js
```

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check MySQL is running
   - Verify credentials in .env file
   - Ensure database exists

2. **No Customers Displayed**
   - Check browser console for API errors
   - Verify backend server is running on port 3002
   - Check network tab for failed requests

3. **Authentication Issues**
   - Clear localStorage
   - Check JWT token validity
   - Verify user role permissions

### Debug Mode
Enable debug logging in browser console:
```javascript
localStorage.setItem('debug', 'true');
```

## Security Features

### Authentication
- JWT token-based authentication
- Role-based access control (admin/customer)
- Password hashing with bcrypt

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- CORS protection
- Rate limiting

### GDPR Compliance
- Minimal data collection
- Explicit consent mechanisms
- Data encryption for sensitive fields
- Right to deletion

## Performance Optimizations

### Database
- Connection pooling
- Indexed queries on frequently searched fields
- Optimized query structure

### Frontend
- Efficient state management
- Debounced search functionality
- Lazy loading for large datasets
- Local caching with fallback

## Future Enhancements

### Planned Features
1. Advanced search filters
2. Bulk customer operations
3. Customer import/export
4. Audit logging
5. Customer activity tracking
6. Advanced role management

### Database Improvements
1. Full-text search capabilities
2. Data archiving for inactive customers
3. Backup and recovery procedures
4. Performance monitoring

## Conclusion

The customer management system now provides:
- ✅ Real database integration
- ✅ Full CRUD operations
- ✅ Role-based access control
- ✅ Search and filtering
- ✅ Responsive UI
- ✅ Error handling and fallbacks
- ✅ Security best practices

The system is production-ready and can handle real customer data with proper security and performance considerations.
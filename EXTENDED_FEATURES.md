# Heduschka PWA - Extended Features Documentation

## 🆕 New Features (Admin Dashboard & Customer Portal)

### Admin Dashboard
- **Role-based routing**: `/admin/dashboard` for administrators
- **Zoho Forms-inspired UI**: Clean, minimal, table-based views
- **Comprehensive management**: Service requests, offers, invoices, DATEV export

### Customer Portal  
- **Customer-specific views**: `/customer/portal` for customers
- **Read-only access**: View submitted forms, offers, and invoices
- **Digital acceptance**: Accept/reject offers directly in portal

### Angebotsmodul (Offers Module)
- **Auto-generation**: Create offers from service requests or manually
- **Position management**: Articles, services, working time, travel, filters, flat rates
- **Pricing logic**: Discount/VAT calculation, PDF generation
- **Version history**: Track offer changes and versions
- **Digital acceptance**: Customer can accept/reject offers online

### Rechnungsmodul (Invoicing Module)
- **Auto-creation**: Generate invoices from accepted offers
- **Status tracking**: Open, paid, overdue, cancelled
- **Payment terms**: Configurable payment conditions
- **PDF generation**: Professional invoices with Heduschka layout

### DATEV-Schnittstelle (DATEV Interface)
- **CSV Export**: Standard CSV format for accounting
- **ASCII Export**: DATEV-compatible ASCII format
- **Data validation**: Ensure export data integrity
- **Batch processing**: Export multiple invoices at once

## 🏗️ Architecture

### Component Structure
```
src/
├── components/
│   ├── admin/
│   │   ├── AdminDashboard.jsx      # Main admin interface
│   │   ├── angebot/
│   │   │   └── AngebotForm.jsx     # Offer creation/editing
│   │   └── rechnung/
│   │       └── RechnungForm.jsx    # Invoice creation/editing
│   ├── customer/
│   │   └── CustomerPortal.jsx      # Customer interface
│   └── layout/
│       └── Sidebar.jsx             # Navigation sidebar
├── services/
│   ├── datevService.ts             # DATEV export functionality
│   ├── pdfService.ts               # PDF generation with jsPDF
│   └── enhancedDB.js               # Extended database operations
└── models/
    └── types.ts                    # TypeScript interfaces
```

### Database Schema
- **angebote**: Offers with positions, pricing, status
- **rechnungen**: Invoices with payment tracking
- **drafts**: Offline support for unsaved changes
- **Enhanced indexing**: Optimized queries by customer, status, date

### Role-Based Access Control
- **Admin routes**: Full access to all modules
- **Customer routes**: Limited to own data, read-only access
- **JWT-like token validation**: Secure role checking

## 🚀 Usage

### Admin Workflow
1. **Service Requests**: View incoming customer requests
2. **Create Offers**: Generate offers from requests or manually
3. **Manage Offers**: Track status, create versions, PDF export
4. **Generate Invoices**: Convert accepted offers to invoices
5. **DATEV Export**: Export paid invoices for accounting

### Customer Workflow
1. **Portal Overview**: View statistics and recent activity
2. **Service Requests**: Track submitted requests
3. **Review Offers**: View, accept, or reject offers
4. **Invoice Access**: Download invoice PDFs
5. **Digital Acceptance**: One-click offer acceptance

## 📊 Features

### Offline Support
- **Draft storage**: Save incomplete offers/invoices locally
- **Auto-sync**: Synchronize when connection restored
- **Conflict resolution**: Handle offline/online data conflicts

### PDF Generation
- **Heduschka branding**: Professional company layout
- **Detailed positions**: Itemized services and costs
- **Legal compliance**: VAT, terms, company details
- **Multi-language**: German business format

### Performance Optimizations
- **Lazy loading**: Components loaded on demand
- **IndexedDB**: Efficient local data storage
- **Caching**: Service worker for offline functionality
- **Responsive design**: Mobile-first approach

## 🔧 Configuration

### Environment Setup
```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build
```

### Database Initialization
The enhanced database automatically creates required tables:
- Submissions (existing)
- Angebote (offers)
- Rechnungen (invoices)  
- Drafts (offline support)
- Templates (form templates)

### DATEV Configuration
Export formats support standard German accounting:
- **CSV**: Simple comma-separated format
- **ASCII**: Full DATEV-compatible format
- **Field mapping**: Debitor, invoice number, amounts, accounts

## 🛡️ Security

### Enhanced Security Measures
- **Role validation**: Server-side role checking
- **Data isolation**: Customers see only their data
- **Audit trails**: Track all offer/invoice changes
- **Secure exports**: Validated data before DATEV export

### DSGVO Compliance
- **Data minimization**: Store only necessary information
- **Access controls**: Role-based data access
- **Audit logging**: Track data access and changes
- **Data retention**: Automatic cleanup of old records

## 📱 Mobile Support

### Responsive Design
- **Sidebar navigation**: Collapsible on mobile
- **Touch-friendly**: Optimized for mobile interaction
- **Offline-first**: Full functionality without connection
- **PWA features**: Installable, app-like experience

## 🧪 Testing

### New Test Coverage
```bash
# Test admin functionality
npm run test:admin

# Test customer portal
npm run test:customer

# Test DATEV export
npm run test:datev

# Integration tests
npm run test:integration
```

## 📈 Performance Metrics

### Target Performance
- **First Load**: < 2s on 3G
- **Navigation**: < 500ms between views
- **PDF Generation**: < 3s for complex invoices
- **DATEV Export**: < 5s for 100 invoices
- **Offline Sync**: < 10s for pending data

## 🔄 Migration

### Existing Data
- **Backward compatible**: Existing service requests preserved
- **Auto-upgrade**: Database schema updated automatically
- **Data integrity**: Validation during migration
- **Rollback support**: Safe upgrade process

## 📞 Support

### Troubleshooting
- **Clear cache**: Browser DevTools → Application → Storage
- **Reset database**: Delete IndexedDB and reload
- **Check roles**: Verify token format (ADMIN_xxx/KUNDE_xxx)
- **Network issues**: Check offline indicator

### Common Issues
- **PDF not generating**: Check jsPDF library loading
- **DATEV export fails**: Validate invoice data completeness
- **Sidebar not showing**: Check screen width and CSS
- **Offers not saving**: Verify database initialization

---

**© 2024 Heduschka GmbH** • Enhanced PWA with full business workflow support
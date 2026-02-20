# Fix Summary: 404 Errors for arbeitsauftrag and pruefprotokoll

## Problem
The frontend was trying to fetch data from `/api/arbeitsauftrag` and `/api/pruefprotokoll` endpoints, but these routes didn't exist in the backend, resulting in 404 errors.

## Solution Implemented

### 1. Created New API Routes

#### `Backend/routes/arbeitsauftrag.js`
- GET `/api/arbeitsauftrag` - Get all work orders
- GET `/api/arbeitsauftrag/:id` - Get single work order
- POST `/api/arbeitsauftrag` - Create work order
- PUT `/api/arbeitsauftrag/:id` - Update work order
- DELETE `/api/arbeitsauftrag/:id` - Delete work order (admin only)

#### `Backend/routes/pruefprotokoll.js`
- GET `/api/pruefprotokoll` - Get all inspection protocols
- GET `/api/pruefprotokoll/:id` - Get single inspection protocol
- POST `/api/pruefprotokoll` - Create inspection protocol
- PUT `/api/pruefprotokoll/:id` - Update inspection protocol
- DELETE `/api/pruefprotokoll/:id` - Delete inspection protocol (admin only)

### 2. Created Database Tables

#### `arbeitsauftrag` (Work Orders)
- Stores work order information
- Links to service requests and customers
- Tracks technician, dates, work performed, materials used
- Status: geplant, in_bearbeitung, abgeschlossen, storniert

#### `pruefprotokoll` (Inspection Protocols - DGUV 201-004)
- Stores inspection protocol data
- Links to service requests and customers
- Tracks inspection dates, results, defects, inspector info
- Status: entwurf, freigegeben, archiviert

### 3. Updated Server Configuration

Modified `Backend/server.js` to register the new routes:
```javascript
app.use('/api/arbeitsauftrag', authMiddleware, arbeitsauftragRoutes);
app.use('/api/pruefprotokoll', authMiddleware, pruefprotokollRoutes);
```

### 4. Created Migration

Created `Backend/migrations/create_arbeitsauftrag_pruefprotokoll.sql` with table definitions.

Updated `Backend/run-migration.js` to run multiple migrations automatically.

### 5. Updated Documentation

Updated `Backend/README.md` with:
- New endpoint documentation
- Request/response examples
- Database schema information

## Files Created/Modified

### Created:
- `Backend/routes/arbeitsauftrag.js`
- `Backend/routes/pruefprotokoll.js`
- `Backend/migrations/create_arbeitsauftrag_pruefprotokoll.sql`
- `Backend/verify-setup.js`

### Modified:
- `Backend/server.js` - Added route registrations
- `Backend/run-migration.js` - Support multiple migrations
- `Backend/README.md` - Added documentation

## Next Steps

### ⚠️ IMPORTANT: Restart Backend Server

The backend server needs to be restarted to load the new routes:

1. **Stop the current server** (Ctrl+C in the terminal running the backend)
2. **Restart the server**:
   ```bash
   cd Backend
   npm start
   # or for development mode:
   npm run dev
   ```

### Verify the Fix

After restarting the backend:

1. The frontend should no longer show 404 errors
2. The `/api/arbeitsauftrag` endpoint should return an empty array `[]`
3. The `/api/pruefprotokoll` endpoint should return an empty array `[]`

### Test the Endpoints

You can test with curl:

```bash
# Get work orders (requires auth token)
curl http://localhost:3002/api/arbeitsauftrag \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get inspection protocols (requires auth token)
curl http://localhost:3002/api/pruefprotokoll \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Features

Both endpoints support:
- ✅ Customer filtering (non-admin users only see their own data)
- ✅ Full CRUD operations
- ✅ JWT authentication
- ✅ Offline support (frontend handles localStorage fallback)
- ✅ Foreign key relationships to service_requests and customers

## Database Schema

### arbeitsauftrag
```sql
- id (UUID, Primary Key)
- nummer (Unique work order number)
- kunden_id (Foreign Key → customers)
- service_anfrage_id (Foreign Key → service_requests)
- anlagen_id
- techniker
- geplanter_termin, tatsaechlicher_termin
- arbeitszeit_stunden
- durchgefuehrte_arbeiten (TEXT)
- verwendete_materialien (JSON)
- bemerkungen
- status (ENUM)
- created_at, updated_at
```

### pruefprotokoll
```sql
- id (UUID, Primary Key)
- nummer (Unique protocol number)
- kunden_id (Foreign Key → customers)
- service_anfrage_id (Foreign Key → service_requests)
- anlagen_id
- pruefdatum, naechste_pruefung
- pruefart
- pruefergebnis (ENUM)
- pruefpunkte (JSON)
- maengel (JSON)
- bemerkungen
- pruefer_name, pruefer_qualifikation
- status (ENUM)
- created_at, updated_at
```

---

**Status**: ✅ Implementation Complete
**Action Required**: 🔄 Restart Backend Server

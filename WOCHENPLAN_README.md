# Wochenplan Module - Technical Documentation

## Overview
Enterprise-grade weekly technician planning module for German field service operations. Digitizes paper-based Wochenplan with full offline support, validation, and PDF printing.

## Architecture

### Files Created
```
src/
├── types/
│   └── wochenplan.ts                    # TypeScript interfaces
├── utils/
│   └── wochenplanValidation.ts          # Validation logic
├── services/
│   └── wochenplanService.ts             # API service layer
└── components/
    └── admin/
        └── WochenplanModule.tsx         # Main component
```

## Data Model

### WochenplanRow
```typescript
{
  id: string;
  wochentag: 'Mo' | 'Di' | 'Mi' | 'Do' | 'Fr';
  datum: string;                          // ISO date
  geplante_zeit: string;                  // HH:mm
  firma: string;
  standort: string;
  auftrag: string;
  filter: string;
  hotel_name: string;
  adresse: string;
  storno_bis: string;                     // ISO date
  preis: number;                          // decimal
  inkl_fs: boolean;                       // checkbox
  geb: boolean;                           // checkbox
  bez: boolean;                           // checkbox
}
```

### Wochenplan
```typescript
{
  id: string;
  service_anfrage_id: string;             // Links to service request
  kalenderwoche: number;                  // 1-53
  servicetechniker: string;
  rows: WochenplanRow[];                  // Multiple rows per day allowed
  information: string;
  geld_mitgeben: number;
  km_ca: number;
  tanken: number;
  puffer: number;
  hotel_kosten: number;
  unterschrift_monteur: string;
  unterschrift_service: string;
  zurueck_datum: string;
  created_at: number;
  updated_at: number;
}
```

## Features Implemented

### ✅ Core Functionality
- [x] Linked to service request via `service_anfrage_id`
- [x] Multiple rows per weekday support
- [x] Inline editable table rows
- [x] Toggleable checkbox columns (inkl_fs, geb, bez)
- [x] Add/Delete row functionality
- [x] Optimistic UI updates

### ✅ Calculations
- [x] Daily totals per weekday
- [x] Weekly total cost (sum of all row prices)
- [x] Real-time calculation updates

### ✅ Validation
- [x] Numeric validation (preis, geld_mitgeben, km_ca, tanken, puffer, hotel_kosten)
- [x] Date validation
- [x] Storno bis >= Datum validation
- [x] Kalenderwoche range (1-53)
- [x] Required field validation

### ✅ API Integration
- [x] GET `/api/wochenplan/{service_anfrage_id}`
- [x] POST `/api/wochenplan`
- [x] PUT `/api/wochenplan/{id}`
- [x] DELETE `/api/wochenplan/{id}/row/{rowId}`
- [x] Offline fallback with localStorage
- [x] Optimistic updates

### ✅ Print/PDF
- [x] Print-friendly CSS
- [x] Hides action buttons in print mode
- [x] Maintains table layout
- [x] Professional paper-like format

## Usage

### Basic Integration
```tsx
import WochenplanModule from './components/admin/WochenplanModule';

<WochenplanModule serviceAnfrageId="SR-2024-001" />
```

### API Service Usage
```typescript
import { wochenplanService } from './services/wochenplanService';

// Load existing plan
const plan = await wochenplanService.getByServiceRequest('SR-2024-001');

// Create new plan
const newPlan = await wochenplanService.create({
  service_anfrage_id: 'SR-2024-001',
  kalenderwoche: 42,
  servicetechniker: 'Max Mustermann',
  rows: [],
  // ... other fields
});

// Update plan
await wochenplanService.update(plan.id, { kalenderwoche: 43 });

// Delete row
await wochenplanService.deleteRow(plan.id, row.id);
```

### Validation Usage
```typescript
import { validateRow, validateWochenplan } from './utils/wochenplanValidation';

const rowErrors = validateRow(row);
const planErrors = validateWochenplan(plan);
```

## Technical Details

### State Management
- React hooks (useState, useEffect)
- Optimistic UI updates
- Local state with server sync

### Offline Support
- localStorage caching
- Pending operations queue
- Automatic retry on reconnect (ready for implementation)

### Type Safety
- Full TypeScript coverage
- Strict type checking
- Interface-driven development

### Performance
- Inline editing (no modal overhead)
- Minimal re-renders
- Efficient calculation updates

### Print Layout
- CSS media queries for print
- Hides interactive elements
- Maintains table structure
- Professional formatting

## Validation Rules

### Numeric Fields
- `preis`: Must be valid decimal
- `geld_mitgeben`: Must be valid decimal
- `km_ca`: Must be valid integer
- `tanken`: Must be valid decimal
- `puffer`: Must be valid decimal
- `hotel_kosten`: Must be valid decimal

### Date Fields
- `datum`: Must be valid ISO date
- `storno_bis`: Must be >= datum (if provided)
- `zurueck_datum`: Must be valid ISO date

### Required Fields
- `kalenderwoche`: 1-53
- `servicetechniker`: Non-empty string
- `wochentag`: One of Mo, Di, Mi, Do, Fr
- `datum`: Valid date

## API Endpoints

### GET /api/wochenplan/{service_anfrage_id}
Returns existing Wochenplan for service request or null.

**Response:**
```json
{
  "id": "uuid",
  "service_anfrage_id": "SR-2024-001",
  "kalenderwoche": 42,
  "servicetechniker": "Max Mustermann",
  "rows": [...],
  "created_at": 1234567890,
  "updated_at": 1234567890
}
```

### POST /api/wochenplan
Creates new Wochenplan.

**Request Body:** Full Wochenplan object (without id, created_at, updated_at)

### PUT /api/wochenplan/{id}
Updates existing Wochenplan.

**Request Body:** Partial Wochenplan object

### DELETE /api/wochenplan/{id}/row/{rowId}
Deletes specific row from Wochenplan.

## Future Enhancements

### Ready for Implementation
- [ ] Automatic sync service for offline operations
- [ ] Row duplication feature
- [ ] Template management
- [ ] Export to Excel
- [ ] Email PDF functionality
- [ ] Multi-week view
- [ ] Technician assignment from user database
- [ ] Cost center allocation
- [ ] Approval workflow

## Browser Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Print functionality: All modern browsers

## Dependencies
- React 18+
- TypeScript 4.5+
- Existing authService for authentication

## Testing Checklist
- [ ] Add row functionality
- [ ] Delete row with confirmation
- [ ] Inline editing all fields
- [ ] Checkbox toggling
- [ ] Numeric validation
- [ ] Date validation
- [ ] Storno bis >= Datum validation
- [ ] Weekly total calculation
- [ ] Save functionality
- [ ] Print layout
- [ ] Offline mode
- [ ] API error handling

## Notes
- Component uses inline styles for simplicity and print compatibility
- All monetary values in EUR
- Week starts Monday (German standard)
- Time format: 24-hour (HH:mm)
- Date format: ISO 8601 (YYYY-MM-DD)

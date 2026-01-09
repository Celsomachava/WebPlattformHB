# Prüfprotokoll DGUV 201-004 - Database Schema

## Table: pruefprotokoll_atemluft

### Schema Definition

```sql
CREATE TABLE pruefprotokoll_atemluft (
  id VARCHAR(36) PRIMARY KEY,
  service_anfrage_id VARCHAR(36) NOT NULL,
  
  -- Additional Filter / Monitoring
  kontrollanzeige_aktivkohlefilter BOOLEAN DEFAULT FALSE,
  kontrollanzeige_partikelfilter BOOLEAN DEFAULT FALSE,
  betriebsstundenzaehler_vorhanden BOOLEAN DEFAULT FALSE,
  betriebsanzeige_gruen_sichtbar BOOLEAN DEFAULT FALSE,
  
  -- Sicherheitsmaßnahmen Fahrerkabine
  auto_einschaltung_hauptmotor VARCHAR(10),  -- 'ja', 'nein', 'n/a'
  hinweisschild_frischluft VARCHAR(10),
  fluchtfiltergeraet_vorhanden VARCHAR(10),
  funkverkehr_vorhanden VARCHAR(10),
  notausstieg_blockiert VARCHAR(10),
  notausstieg_nothammer VARCHAR(10),
  laermgrenzwert_unter_85db VARCHAR(10),
  
  -- Kabinenabdichtung
  kabine_abdichtung_ok VARCHAR(10),
  hebeschiebefenster_blockiert VARCHAR(10),
  aussenluft_heizung_abgedichtet VARCHAR(10),
  durchfuehrungen_abgedichtet VARCHAR(10),
  
  -- Klimaanlage
  klima_typ_hersteller VARCHAR(255),
  klima_kondensator VARCHAR(10),
  klima_verdampfer VARCHAR(10),
  klima_umluftwirkung VARCHAR(10),
  
  -- Heizung
  heizung_typ_hersteller VARCHAR(255),
  heizung_umluftbetrieb VARCHAR(10),
  
  -- Luftzufuhr / Kälteanlage
  luftzufuhr_vorhanden VARCHAR(10),
  kaeltemittel VARCHAR(255),
  kompressor VARCHAR(10),
  kaelteanlage_vorhanden VARCHAR(10),
  
  -- Abschluss
  maengel_bemerkungen TEXT,
  nachkontrolle_erforderlich BOOLEAN DEFAULT FALSE,
  ort VARCHAR(255) NOT NULL,
  protokoll_datum DATE NOT NULL,
  auftraggeber_unterschrift VARCHAR(255),
  servicetechniker_unterschrift VARCHAR(255) NOT NULL,
  
  created_at BIGINT NOT NULL,
  updated_at BIGINT NOT NULL,
  
  FOREIGN KEY (service_anfrage_id) REFERENCES serviceanfragen(id),
  INDEX idx_service_anfrage (service_anfrage_id)
);
```

## Field Mapping

### Section: Additional Filter / Monitoring
| UI Field | Database Column | Type | Default |
|----------|----------------|------|---------|
| Kontrollanzeige Aktivkohlefilter | kontrollanzeige_aktivkohlefilter | BOOLEAN | FALSE |
| Kontrollanzeige Partikelfilter | kontrollanzeige_partikelfilter | BOOLEAN | FALSE |
| Betriebsstundenzähler vorhanden | betriebsstundenzaehler_vorhanden | BOOLEAN | FALSE |
| Betriebsanzeige grün sichtbar | betriebsanzeige_gruen_sichtbar | BOOLEAN | FALSE |

### Section: Sicherheitsmaßnahmen Fahrerkabine
| UI Field | Database Column | Type | Values |
|----------|----------------|------|--------|
| Auto-Einschaltung Hauptmotor | auto_einschaltung_hauptmotor | VARCHAR(10) | 'ja', 'nein', 'n/a' |
| Hinweisschild Frischluft | hinweisschild_frischluft | VARCHAR(10) | 'ja', 'nein', 'n/a' |
| Fluchtfiltergerät vorhanden | fluchtfiltergeraet_vorhanden | VARCHAR(10) | 'ja', 'nein', 'n/a' |
| Funkverkehr vorhanden | funkverkehr_vorhanden | VARCHAR(10) | 'ja', 'nein', 'n/a' |
| Notausstieg blockiert | notausstieg_blockiert | VARCHAR(10) | 'ja', 'nein', 'n/a' |
| Notausstieg Nothammer | notausstieg_nothammer | VARCHAR(10) | 'ja', 'nein', 'n/a' |
| Lärmgrenzwert unter 85dB | laermgrenzwert_unter_85db | VARCHAR(10) | 'ja', 'nein', 'n/a' |

### Section: Kabinenabdichtung
| UI Field | Database Column | Type | Values |
|----------|----------------|------|--------|
| Kabine Abdichtung OK | kabine_abdichtung_ok | VARCHAR(10) | 'ja', 'nein', 'n/a' |
| Hebeschiebefenster blockiert | hebeschiebefenster_blockiert | VARCHAR(10) | 'ja', 'nein', 'n/a' |
| Außenluft Heizung abgedichtet | aussenluft_heizung_abgedichtet | VARCHAR(10) | 'ja', 'nein', 'n/a' |
| Durchführungen abgedichtet | durchfuehrungen_abgedichtet | VARCHAR(10) | 'ja', 'nein', 'n/a' |

### Section: Klimaanlage
| UI Field | Database Column | Type |
|----------|----------------|------|
| Typ / Hersteller | klima_typ_hersteller | VARCHAR(255) |
| Kondensator | klima_kondensator | VARCHAR(10) |
| Verdampfer | klima_verdampfer | VARCHAR(10) |
| Umluftwirkung | klima_umluftwirkung | VARCHAR(10) |

### Section: Heizung
| UI Field | Database Column | Type |
|----------|----------------|------|
| Typ / Hersteller | heizung_typ_hersteller | VARCHAR(255) |
| Umluftbetrieb | heizung_umluftbetrieb | VARCHAR(10) |

### Section: Luftzufuhr / Kälteanlage
| UI Field | Database Column | Type |
|----------|----------------|------|
| Luftzufuhr vorhanden | luftzufuhr_vorhanden | VARCHAR(10) |
| Kältemittel | kaeltemittel | VARCHAR(255) |
| Kompressor | kompressor | VARCHAR(10) |
| Kälteanlage vorhanden | kaelteanlage_vorhanden | VARCHAR(10) |

### Section: Abschluss
| UI Field | Database Column | Type | Required |
|----------|----------------|------|----------|
| Mängel / Bemerkungen | maengel_bemerkungen | TEXT | No |
| Nachkontrolle erforderlich | nachkontrolle_erforderlich | BOOLEAN | No |
| Ort | ort | VARCHAR(255) | Yes |
| Protokoll Datum | protokoll_datum | DATE | Yes |
| Auftraggeber Unterschrift | auftraggeber_unterschrift | VARCHAR(255) | No |
| Servicetechniker Unterschrift | servicetechniker_unterschrift | VARCHAR(255) | Yes |

## API Endpoints

### GET /api/pruefprotokoll/{service_anfrage_id}
Returns existing Prüfprotokoll for service request.

**Response:**
```json
{
  "id": "uuid",
  "service_anfrage_id": "SR-2024-001",
  "kontrollanzeige_aktivkohlefilter": true,
  "auto_einschaltung_hauptmotor": "ja",
  "ort": "Berlin",
  "protokoll_datum": "2024-01-15",
  "created_at": 1234567890,
  "updated_at": 1234567890
}
```

### POST /api/pruefprotokoll
Creates new Prüfprotokoll.

**Request Body:** Full PruefprotokollDGUV201004 object

### PUT /api/pruefprotokoll/{id}
Updates existing Prüfprotokoll.

**Request Body:** Partial PruefprotokollDGUV201004 object

## Validation Rules

### Required Fields
- `ort` (Ort)
- `protokoll_datum` (Protokoll Datum)
- `servicetechniker_unterschrift` (Servicetechniker Unterschrift)

### Field Constraints
- Yes/No/N/A fields: Must be one of 'ja', 'nein', 'n/a' or empty
- Boolean fields: true or false
- Date fields: Valid ISO date format (YYYY-MM-DD)
- Text fields: Max 255 characters (except bemerkungen: TEXT)

## Integration Notes

### Compatibility
- ✅ Save and Edit compatible with existing records
- ✅ API integration unchanged from existing patterns
- ✅ Offline support via localStorage
- ✅ Print layout matches paper format

### Migration
If extending existing table, use:
```sql
ALTER TABLE pruefprotokoll_atemluft
ADD COLUMN kontrollanzeige_aktivkohlefilter BOOLEAN DEFAULT FALSE,
ADD COLUMN kontrollanzeige_partikelfilter BOOLEAN DEFAULT FALSE,
-- ... add all new columns
```

## Usage Example

```typescript
import PruefprotokollDGUV201004Module from './components/admin/PruefprotokollDGUV201004Module';

// In admin panel
<PruefprotokollDGUV201004Module serviceAnfrageId="SR-2024-001" />
```

## Print Layout
- All sections print in order
- Yes/No/N/A radio buttons show selected value
- Checkboxes show checked/unchecked state
- Signatures display as text
- Professional paper-like formatting
- No action buttons in print mode

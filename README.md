# Heduschka Service Platform

🔒 **Digitale Plattform für Serviceanfragen, Angebote und Rechnungen**

Vollständige Geschäftslösung für Heduschka GmbH mit Kundenportal und Admin-Dashboard zur Verwaltung von Serviceanfragen, Angeboten, Rechnungen und DATEV-Export.

## 🚀 Features

### Kundenportal
- 📋 **Serviceanfragen**: Digitale Erfassung von Filter-Serviceanfragen
- 📄 **Angebote**: Anzeige und Annahme/Ablehnung von Angeboten
- 🧾 **Rechnungen**: Übersicht aller Rechnungen mit Gesamtkosten
- 👤 **Profileinstellungen**: Anzeige Kundendaten und Passwort ändern

### Admin-Dashboard
- 📊 **Übersicht**: Dashboard mit Statistiken und Kennzahlen
- 📝 **Serviceanfragen**: Verwaltung eingehender Anfragen
- 💼 **Angebote**: Erstellung und Verwaltung von Angeboten
- 💰 **Rechnungen**: Rechnungserstellung aus angenommenen Angeboten
- 📤 **DATEV Export**: Export für Buchhaltungssoftware
- 🔧 **Arbeitsaufträge**: Verwaltung von Arbeitsaufträgen

### Sicherheit & Compliance
- 🔐 **Token-basierte Authentifizierung**
- 🛡️ **DSGVO-konform**: Datenschutz-Einverständnis
- 🔒 **Sichere Datenübertragung**: HTTPS

## 🛠️ Setup & Installation

### Voraussetzungen
- Node.js 16+ 
- npm oder yarn
- MySQL Datenbank
- Moderner Browser

### Installation

```bash
# Repository klonen
git clone <repository-url>
cd WebPlattformHB

# Frontend Dependencies installieren
npm install

# Backend Dependencies installieren
cd Backend
npm install
cd ..

# Backend starten (Port 3002)
cd Backend
node server.js

# Frontend starten (Port 3000)
npm run dev
```

- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:3002`

### Anmeldung

- **Kunde**: Kundennummer (z.B. `K001`)
- **Admin**: `ADMIN_001`

## 🧪 Testing

### Manuelle Tests

#### Kundenportal testen
1. Mit Kundennummer anmelden
2. Serviceanfrage erstellen
3. Angebote anzeigen und annehmen/ablehnen
4. Rechnungen überprüfen
5. Profileinstellungen öffnen

#### Admin-Dashboard testen
1. Mit ADMIN_001 anmelden
2. Serviceanfragen verwalten
3. Angebot erstellen
4. Rechnung aus angenommenem Angebot erstellen
5. DATEV Export durchführen

## 🏗️ Build & Deployment

### Production Build

```bash
# Build für Production
npm run build

# Build testen
npm run preview
```

### Deployment Checklist

- [ ] 🚀 Build erfolgreich (`npm run build`)
- [ ] 🔒 HTTPS konfiguriert
- [ ] 🛡️ Security Headers gesetzt
- [ ] 💾 Datenbank-Backup erstellt

## 🔧 Entwicklung

### Projektstruktur

```
WebPlattformHB/
├── src/
│   ├── components/
│   │   ├── admin/              # Admin-Dashboard Komponenten
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── InvoiceModule.jsx
│   │   │   ├── OfferModule.jsx
│   │   │   └── ArbeitsauftragModule.tsx
│   │   ├── customer/           # Kundenportal Komponenten
│   │   │   ├── CustomerPortal.jsx
│   │   │   ├── CustomerOfferView.jsx
│   │   │   ├── CustomerInvoiceView.jsx
│   │   │   └── form/
│   │   │       └── ServiceRequestForm.jsx
│   │   ├── profile/            # Profileinstellungen
│   │   │   └── ProfileSettings.jsx
│   │   └── auth/               # Authentifizierung
│   ├── services/               # Business Logic
│   │   ├── authService.js
│   │   └── arbeitsauftragService.ts
│   └── utils/                  # Hilfsfunktionen
├── Backend/
│   ├── server.js               # Express Server
│   ├── routes/
│   │   ├── offers.js           # Angebote API
│   │   ├── invoices.js         # Rechnungen API
│   │   └── serviceanfragen.js  # Serviceanfragen API
│   └── db.js                   # MySQL Datenbankverbindung
└── README.md
```

### Backend API Endpoints

#### Angebote
- `GET /api/angebote` - Alle Angebote
- `GET /api/angebote/kunde/:kundenId` - Angebote eines Kunden
- `POST /api/angebote/:id/accept` - Angebot annehmen
- `POST /api/angebote/:id/reject` - Angebot ablehnen

#### Rechnungen
- `GET /api/rechnungen` - Alle Rechnungen
- `GET /api/rechnungen/kunde/:kundenId` - Rechnungen eines Kunden
- `POST /api/rechnungen` - Rechnung erstellen

#### Kunden
- `GET /api/kunden/:kundenId` - Kundendaten abrufen

### Wichtige Hinweise

- **Dezimalwerte**: MySQL gibt Dezimalwerte als Strings zurück → `parseFloat()` verwenden
- **Datumsformate**: ISO-Daten mit `new Date().toLocaleDateString('de-DE')` formatieren
- **Rechnungsnummern**: Sequentielle Generierung basierend auf existierenden Rechnungen

## 📋 Datenmodell

### Kunden (customers)
- `kundennummer` - Eindeutige Kundennummer
- `firmenname` - Firmenname
- `ansprechpartner` - Kontaktperson
- `email` - E-Mail-Adresse
- `telefon` - Telefonnummer

### Angebote (angebote)
- `angebots_nummer` - Eindeutige Angebotsnummer
- `kunden_id` - Referenz zum Kunden
- `netto`, `mwst`, `brutto` - Preise (DECIMAL)
- `gueltig_bis` - Gültigkeitsdatum
- `status` - offen/angenommen/abgelehnt

### Rechnungen (invoices)
- `rechnungs_nummer` - Eindeutige Rechnungsnummer
- `kunden_id` - Referenz zum Kunden
- `netto`, `mwst_betrag`, `brutto` - Beträge (DECIMAL)
- `faellig_am` - Fälligkeitsdatum
- `status` - offen/bezahlt/überfällig

## 🔒 Sicherheit

- 🔐 **Token-basierte Authentifizierung**
- 👤 **Benutzer-Validierung** (Kundennummer/Admin-ID)
- 🛡️ **HTTPS-Erzwingung** (Production)
- 📋 **DSGVO-Compliance**

## 🎨 Design-Prinzipien

- ✨ **Minimalistisch**: Klare, aufgeräumte Benutzeroberfläche
- 📊 **Datenorientiert**: Label-Value Card Layouts für Read-Only Daten
- 🎯 **Funktional**: Fokus auf Benutzerfreundlichkeit statt Dekoration
- 📱 **Responsive**: Optimiert für Desktop und Mobile

## 🐛 Troubleshooting

### Häufige Probleme

**❌ Backend-Verbindung fehlgeschlagen**
```bash
# Backend-Server prüfen
cd Backend
node server.js
# Sollte auf Port 3002 laufen
```

**❌ Dezimalwerte werden falsch angezeigt**
- MySQL gibt DECIMAL als String zurück
- Lösung: `parseFloat(value).toFixed(2)` verwenden

**❌ Datum im falschen Format**
- ISO-Format von DB: `2026-03-20T18:30:00.000Z`
- Lösung: `new Date(date).toLocaleDateString('de-DE')`

**❌ Doppelte Rechnungsnummern**
- Sequentielle Generierung prüfen
- Existierende Rechnungen vor Erstellung laden

## 📞 Support

Bei Fragen oder Problemen:

1. 📖 Diese Dokumentation prüfen
2. 🔍 Browser-DevTools → Console für Fehleranalyse
3. 🌐 Network-Tab für API-Calls überprüfen
4. 💾 Backend-Logs in Terminal kontrollieren

---

**© 2024 Heduschka GmbH** • 🛡️ DSGVO-konform • 🔐 SSL-verschlüsselt

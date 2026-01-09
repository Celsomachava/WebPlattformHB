# Heduschka PWA Architecture

## Overview
Progressive Web Application for Heduschka GmbH digital filter service requests, replacing native apps with offline-first browser-based solution.

## Architecture Principles
- **Offline-First**: IndexedDB + Service Worker for complete offline functionality
- **Mobile-First**: Responsive design optimized for mobile devices
- **Minimal UI**: Clean, Zoho Forms-inspired interface
- **Auto-Sync**: Background synchronization when connectivity restored

## Technology Stack
- **Frontend**: React 18 with Vite build system
- **Offline Storage**: IndexedDB via `idb` library
- **PWA Features**: Workbox for service worker management
- **Routing**: React Router for SPA navigation
- **Styling**: Vanilla CSS with mobile-first responsive design

## Core Services

### StorageService (`src/services/storage.js`)
- IndexedDB wrapper for offline data persistence
- Stores: submissions (queue), templates, session data
- Handles form structure: Kundendaten, Anlagendaten, Serviceangaben, Zusatzinformationen, Rechtliches

### ApiService (`src/services/api.js`)
- REST API communication with Heduschka backend
- Endpoints: POST /api/serviceanfrage, GET /api/form-template
- Token-based authentication
- Photo upload support

### SyncService (`src/services/sync.js`)
- Background synchronization of offline submissions
- Network status monitoring
- Push notifications for sync status
- Automatic retry mechanism

## Form Structure (Based on Heduschka Documentation)
1. **Kundendaten**: Auto-filled customer data
2. **Anlagendaten**: Equipment data with dropdown/QR scan
3. **Serviceangaben**: Service request details
4. **Zusatzinformationen**: Additional info + photo uploads (max 5)
5. **Rechtliches**: DSGVO consent and terms

## Security & Compliance
- HTTPS enforcement
- Token-based authentication
- DSGVO-compliant local storage
- No sensitive data persistence beyond necessity
- Client-side validation for required fields

## PWA Features
- Installable on mobile/desktop
- Offline form completion
- Background sync
- Push notifications
- App-like experience without app store

## Next Steps
1. Implement ServiceForm component with section-based navigation
2. Add photo upload functionality
3. Implement QR code scanning for equipment data
4. Add form validation and error handling
5. Create admin interface for form template management
# Heduschka PWA Testing Guide

## Manual Testing Procedures

### 1. Offline Functionality Testing

#### Test Offline Form Submission
1. Open browser DevTools (F12)
2. Go to Network tab → Check "Offline"
3. Fill out service form completely
4. Submit form
5. ✅ Should show success message
6. Uncheck "Offline" to go online
7. ✅ Should automatically sync pending submissions

#### Test Offline Storage
1. Go offline using DevTools
2. Submit multiple forms
3. Check Application → IndexedDB → heduschkaForms
4. ✅ Should see stored submissions with status: 'pending'

### 2. Role-Based Access Testing

#### Admin Portal (ADMIN_001)
1. Login with token: `ADMIN_001`
2. ✅ Should see dashboard with statistics
3. ✅ Should see table of all service requests
4. ✅ Should show request counts and status

#### Customer Portal (KUNDE_001)
1. Login with token: `KUNDE_001`
2. ✅ Should see service request form
3. ✅ Should NOT see admin dashboard
4. ✅ Customer data should be read-only

### 3. Form Validation Testing

#### Required Fields
- Anlagentyp: Must be selected
- Anlagen-ID: Must be filled
- Standort: Must be filled
- Serviceart: Must be selected
- Beschreibung: Must be filled
- DSGVO checkboxes: Both must be checked

#### DSGVO Compliance
1. Try to submit without checking DSGVO boxes
2. ✅ Should show error message
3. Check both boxes and submit
4. ✅ Should submit successfully

### 4. PWA Installation Testing

#### Desktop Installation
1. Open app in Chrome/Edge
2. Look for install icon in address bar
3. Click install
4. ✅ Should install as desktop app

#### Mobile Installation
1. Open app on mobile browser
2. Look for "Add to Home Screen" prompt
3. ✅ Should install as mobile app

### 5. Performance Testing

#### Lighthouse Audit
```bash
npm run audit
```
Target scores:
- Performance: >90
- Accessibility: >90
- Best Practices: >90
- SEO: >90
- PWA: 100

#### Load Time Testing
- First Contentful Paint: <1.5s
- Largest Contentful Paint: <2.5s
- Time to Interactive: <3.5s

### 6. Security Testing

#### Input Sanitization
1. Try entering `<script>alert('xss')</script>` in text fields
2. ✅ Should be sanitized and not execute

#### Authentication
1. Try accessing app without token
2. ✅ Should show login screen
3. Try invalid token
4. ✅ Should show error message

## Automated Testing

### Unit Tests
```bash
npm test
```

### E2E Tests
```bash
npm run test:e2e
```

### Coverage Report
```bash
npm run test:coverage
```

## Browser Compatibility

### Supported Browsers
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### PWA Features Support
- Service Workers: ✅
- IndexedDB: ✅
- Web App Manifest: ✅
- Offline functionality: ✅

## Troubleshooting

### Common Issues
1. **White screen**: Clear cache and reload
2. **Sync not working**: Check IndexedDB in DevTools
3. **PWA not installing**: Ensure HTTPS and valid manifest

### Debug Commands
```javascript
// Browser console
import { performanceMonitor, runOfflineTests } from './src/utils/performance';
performanceMonitor.getMetrics();
runOfflineTests();
```
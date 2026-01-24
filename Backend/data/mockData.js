export const mockUsers = [
  {
    id: 'KUNDE_001',
    name: 'Max Mustermann',
    role: 'customer',
    token: 'token_kunde_001',
    company: 'Mustermann GmbH',
    password: 'demo123'
  },
  {
    id: 'ADMIN_001',
    name: 'Admin User',
    role: 'admin',
    token: 'token_admin_001',
    company: 'Heduschka GmbH',
    password: 'admin123'
  }
];

export const mockCustomers = [
  {
    id: 'KUNDE_001',
    name: 'Max Mustermann',
    company: 'Mustermann GmbH',
    email: 'max@mustermann.de',
    phone: '+49 123 456789',
    address: 'Musterstraße 1, 12345 Musterstadt',
    password: 'demo123',
    registeredSince: '2023-01-15'
  }
];

export const mockServiceRequests = [
  {
    id: 'SR_001',
    customerId: 'KUNDE_001',
    anlagentyp: 'Filteranlage',
    anlagenId: 'FA_001',
    standort: 'Halle 1',
    serviceart: 'Wartung',
    dringlichkeit: 'normal',
    beschreibung: 'Routinewartung Filter',
    wunschtermin: '2024-01-15',
    status: 'pending',
    createdAt: '2024-01-10T10:00:00Z'
  }
];

export const mockAnlagen = [
  {
    id: 'FA_001',
    typ: 'Filteranlage',
    standort: 'Halle 1',
    customerId: 'KUNDE_001'
  },
  {
    id: 'FA_002',
    typ: 'Absauganlage',
    standort: 'Halle 2',
    customerId: 'KUNDE_001'
  }
];
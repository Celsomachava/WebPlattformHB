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
    id: 'KUNDE_002',
    name: 'Anna Schmidt',
    role: 'customer',
    token: 'token_kunde_002',
    company: 'TechCorp AG',
    password: 'demo123'
  },
  {
    id: 'KUNDE_003',
    name: 'Peter Weber',
    role: 'customer',
    token: 'token_kunde_003',
    company: 'Weber Maschinenbau',
    password: 'demo123'
  },
  {
    id: 'KUNDE_004',
    name: 'Lisa Müller',
    role: 'customer',
    token: 'token_kunde_004',
    company: 'Chemie Solutions GmbH',
    password: 'demo123'
  },
  {
    id: 'KUNDE_005',
    name: 'Thomas Klein',
    role: 'customer',
    token: 'token_kunde_005',
    company: 'AutoParts Industries',
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
  },
  {
    id: 'KUNDE_002',
    name: 'Anna Schmidt',
    company: 'TechCorp AG',
    email: 'a.schmidt@techcorp.de',
    phone: '+49 234 567890',
    address: 'Industrieweg 15, 67890 Techstadt',
    password: 'demo123',
    registeredSince: '2023-03-22'
  },
  {
    id: 'KUNDE_003',
    name: 'Peter Weber',
    company: 'Weber Maschinenbau',
    email: 'p.weber@weber-mb.de',
    phone: '+49 345 678901',
    address: 'Fabrikstraße 8, 54321 Maschinenhausen',
    password: 'demo123',
    registeredSince: '2023-05-10'
  },
  {
    id: 'KUNDE_004',
    name: 'Lisa Müller',
    company: 'Chemie Solutions GmbH',
    email: 'l.mueller@chemie-sol.de',
    phone: '+49 456 789012',
    address: 'Chemiepark 3, 98765 Reaktorstadt',
    password: 'demo123',
    registeredSince: '2023-07-18'
  },
  {
    id: 'KUNDE_005',
    name: 'Thomas Klein',
    company: 'AutoParts Industries',
    email: 't.klein@autoparts.de',
    phone: '+49 567 890123',
    address: 'Autobahnring 42, 13579 Motorstadt',
    password: 'demo123',
    registeredSince: '2023-09-05'
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
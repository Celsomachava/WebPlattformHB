-- Seed data for Heduschka Service Platform
USE heduschka_service;

-- Insert demo customers (passwords: demo123 and admin123)
INSERT INTO customers (id, kundennummer, firmenname, ansprechpartner, email, telefon, password, role, created_at) VALUES
('c1', 'KUNDE_001', 'Mustermann GmbH', 'Max Mustermann', 'max@mustermann.de', '+49 123 456789', '$2a$10$dv.b8vopTF4FSjApZ0fIu.1hKhJyQ976Uedhsfjk9OpBdqPzVicFO', 'customer', UNIX_TIMESTAMP() * 1000),
('c2', 'KUNDE_002', 'TechCorp AG', 'Anna Schmidt', 'a.schmidt@techcorp.de', '+49 234 567890', '$2a$10$dv.b8vopTF4FSjApZ0fIu.1hKhJyQ976Uedhsfjk9OpBdqPzVicFO', 'customer', UNIX_TIMESTAMP() * 1000),
('c3', 'KUNDE_003', 'Weber Maschinenbau', 'Peter Weber', 'p.weber@weber-mb.de', '+49 345 678901', '$2a$10$dv.b8vopTF4FSjApZ0fIu.1hKhJyQ976Uedhsfjk9OpBdqPzVicFO', 'customer', UNIX_TIMESTAMP() * 1000),
('a1', 'ADMIN_001', 'Heduschka GmbH', 'Admin User', 'admin@heduschka.de', '+49 987 654321', '$2a$10$..LAcoWFCIzYDZOaOKnw1.9aO3vAt.Sn2lTQbntxnRUmKW0Ol9ZXG', 'admin', UNIX_TIMESTAMP() * 1000);

-- Insert demo anlagen
INSERT INTO anlagen (id, anlagen_id, kunden_id, standort, filtertyp, qr_code_id, created_at) VALUES
('a1', 'FA_001', 'KUNDE_001', 'Halle 1', 'Filteranlage Typ A', 'QR_FA001', UNIX_TIMESTAMP() * 1000),
('a2', 'FA_002', 'KUNDE_001', 'Halle 2', 'Absauganlage Typ B', 'QR_FA002', UNIX_TIMESTAMP() * 1000),
('a3', 'FA_003', 'KUNDE_002', 'Produktionshalle', 'Filteranlage Typ C', 'QR_FA003', UNIX_TIMESTAMP() * 1000);

-- Insert demo service requests
INSERT INTO service_requests (id, nummer, kunden_id, anlagen_id, standort, filtertyp, serviceart, dringlichkeit, wunschtermin, bemerkungen, status, created_at, updated_at) VALUES
('sr1', 'SR_001', 'KUNDE_001', 'FA_001', 'Halle 1', 'Filteranlage Typ A', 'Wartung', 'normal', '2024-02-15', 'Routinewartung', 'neu', UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000),
('sr2', 'SR_002', 'KUNDE_002', 'FA_003', 'Produktionshalle', 'Filteranlage Typ C', 'Reparatur', 'dringend', '2024-02-10', 'Filter defekt', 'bearbeitet', UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000);

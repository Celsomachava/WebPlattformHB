-- Manual Database Setup for Heduschka Service
-- Run this in MySQL Workbench or command line

CREATE DATABASE IF NOT EXISTS heduschka_service;
USE heduschka_service;

-- Drop existing table
DROP TABLE IF EXISTS customers;

-- Create customers table
CREATE TABLE customers (
  id VARCHAR(36) PRIMARY KEY,
  kundennummer VARCHAR(50) UNIQUE NOT NULL,
  firmenname VARCHAR(255) NOT NULL,
  ansprechpartner VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  telefon VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('customer', 'admin') DEFAULT 'customer',
  created_at BIGINT NOT NULL,
  updated_at BIGINT
);

-- Insert demo users with bcrypt hashed passwords
-- Password for admin123: $2a$10$dv.b8vopTF4FSjApZ0fIu.1hKhJyQ976Uedhsfjk9OpBdqPzVicFO
-- Password for demo123: $2a$10$dv.b8vopTF4FSjApZ0fIu.1hKhJyQ976Uedhsfjk9OpBdqPzVicFO

INSERT INTO customers (id, kundennummer, firmenname, ansprechpartner, email, telefon, password, role, created_at) VALUES
('admin1', 'ADMIN_001', 'Heduschka GmbH', 'Admin User', 'admin@heduschka.de', '+49 987 654321', '$2a$10$..LAcoWFCIzYDZOaOKnw1.9aO3vAt.Sn2lTQbntxnRUmKW0Ol9ZXG', 'admin', UNIX_TIMESTAMP() * 1000),
('kunde1', 'KUNDE_001', 'Mustermann GmbH', 'Max Mustermann', 'max@mustermann.de', '+49 123 456789', '$2a$10$dv.b8vopTF4FSjApZ0fIu.1hKhJyQ976Uedhsfjk9OpBdqPzVicFO', 'customer', UNIX_TIMESTAMP() * 1000),
('kunde2', 'KUNDE_002', 'TechCorp AG', 'Anna Schmidt', 'a.schmidt@techcorp.de', '+49 234 567890', '$2a$10$dv.b8vopTF4FSjApZ0fIu.1hKhJyQ976Uedhsfjk9OpBdqPzVicFO', 'customer', UNIX_TIMESTAMP() * 1000),
('kunde3', 'KUNDE_003', 'Weber Maschinenbau', 'Peter Weber', 'p.weber@weber-mb.de', '+49 345 678901', '$2a$10$dv.b8vopTF4FSjApZ0fIu.1hKhJyQ976Uedhsfjk9OpBdqPzVicFO', 'customer', UNIX_TIMESTAMP() * 1000);

-- Verify data
SELECT kundennummer, firmenname, ansprechpartner, role FROM customers;

-- Test login credentials:
-- ADMIN_001 / admin123
-- KUNDE_001 / demo123
-- KUNDE_002 / demo123
-- KUNDE_003 / demo123
-- Heduschka Service Platform Database Schema

CREATE DATABASE IF NOT EXISTS heduschka_service;
USE heduschka_service;

-- Customers Table
CREATE TABLE IF NOT EXISTS customers (
  id VARCHAR(36) PRIMARY KEY,
  kundennummer VARCHAR(50) UNIQUE NOT NULL,
  firmenname VARCHAR(255) NOT NULL,
  ansprechpartner VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  telefon VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('customer', 'admin') DEFAULT 'customer',
  created_at BIGINT NOT NULL,
  updated_at BIGINT,
  INDEX idx_kundennummer (kundennummer),
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Assets/Installations Table
CREATE TABLE IF NOT EXISTS anlagen (
  id VARCHAR(36) PRIMARY KEY,
  anlagen_id VARCHAR(50) UNIQUE NOT NULL,
  kunden_id VARCHAR(50) NOT NULL,
  standort VARCHAR(255) NOT NULL,
  filtertyp VARCHAR(255) NOT NULL,
  qr_code_id VARCHAR(100) UNIQUE NOT NULL,
  created_at BIGINT NOT NULL,
  updated_at BIGINT,
  INDEX idx_kunden_id (kunden_id),
  INDEX idx_qr_code (qr_code_id),
  FOREIGN KEY (kunden_id) REFERENCES customers(kundennummer) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Service Requests Table
CREATE TABLE IF NOT EXISTS service_requests (
  id VARCHAR(36) PRIMARY KEY,
  nummer VARCHAR(50) UNIQUE NOT NULL,
  kunden_id VARCHAR(50) NOT NULL,
  anlagen_id VARCHAR(50),
  standort VARCHAR(255),
  filtertyp VARCHAR(255),
  qr_code VARCHAR(100),
  serviceart VARCHAR(100) NOT NULL,
  dringlichkeit ENUM('normal', 'dringend') DEFAULT 'normal',
  wunschtermin DATE,
  zeitfenster VARCHAR(50),
  bemerkungen TEXT,
  status ENUM('neu', 'bearbeitet', 'abgeschlossen', 'storniert') DEFAULT 'neu',
  created_at BIGINT NOT NULL,
  updated_at BIGINT,
  INDEX idx_kunden_id (kunden_id),
  INDEX idx_status (status),
  INDEX idx_nummer (nummer),
  FOREIGN KEY (kunden_id) REFERENCES customers(kundennummer) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Offers Table
CREATE TABLE IF NOT EXISTS angebote (
  id VARCHAR(36) PRIMARY KEY,
  nummer VARCHAR(50) UNIQUE NOT NULL,
  kunden_id VARCHAR(50) NOT NULL,
  gueltig_bis DATE,
  bemerkungen TEXT,
  netto DECIMAL(10, 2) DEFAULT 0,
  mwst DECIMAL(10, 2) DEFAULT 0,
  brutto DECIMAL(10, 2) DEFAULT 0,
  status ENUM('entwurf', 'versendet', 'angenommen', 'abgelehnt') DEFAULT 'entwurf',
  created_at BIGINT NOT NULL,
  updated_at BIGINT,
  INDEX idx_kunden_id (kunden_id),
  INDEX idx_nummer (nummer),
  FOREIGN KEY (kunden_id) REFERENCES customers(kundennummer) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Offer Positions Table
CREATE TABLE IF NOT EXISTS offer_positions (
  id VARCHAR(36) PRIMARY KEY,
  offer_id VARCHAR(36) NOT NULL,
  position_nr INT NOT NULL,
  name VARCHAR(255),
  beschreibung TEXT NOT NULL,
  menge INT NOT NULL DEFAULT 1,
  einzelpreis DECIMAL(10, 2) NOT NULL,
  gesamtpreis DECIMAL(10, 2) NOT NULL,
  INDEX idx_offer_id (offer_id),
  FOREIGN KEY (offer_id) REFERENCES angebote(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Invoices Table
CREATE TABLE IF NOT EXISTS invoices (
  id VARCHAR(36) PRIMARY KEY,
  nummer VARCHAR(50) UNIQUE NOT NULL,
  kunden_id VARCHAR(50) NOT NULL,
  faellig_am DATE,
  bemerkungen TEXT,
  netto DECIMAL(10, 2) DEFAULT 0,
  mwst DECIMAL(10, 2) DEFAULT 0,
  brutto DECIMAL(10, 2) DEFAULT 0,
  status ENUM('offen', 'bezahlt', 'ueberfaellig', 'storniert') DEFAULT 'offen',
  created_at BIGINT NOT NULL,
  updated_at BIGINT,
  INDEX idx_kunden_id (kunden_id),
  INDEX idx_nummer (nummer),
  FOREIGN KEY (kunden_id) REFERENCES customers(kundennummer) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Invoice Positions Table
CREATE TABLE IF NOT EXISTS invoice_positions (
  id VARCHAR(36) PRIMARY KEY,
  invoice_id VARCHAR(36) NOT NULL,
  position_nr INT NOT NULL,
  name VARCHAR(255),
  beschreibung TEXT NOT NULL,
  menge INT NOT NULL DEFAULT 1,
  einzelpreis DECIMAL(10, 2) NOT NULL,
  gesamtpreis DECIMAL(10, 2) NOT NULL,
  INDEX idx_invoice_id (invoice_id),
  FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

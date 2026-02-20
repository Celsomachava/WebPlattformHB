-- Create angebote (offers) table
CREATE TABLE IF NOT EXISTS angebote (
  id VARCHAR(36) PRIMARY KEY,
  nummer VARCHAR(50) UNIQUE NOT NULL,
  kunden_id VARCHAR(50) NOT NULL,
  service_anfrage_id VARCHAR(36),
  anlagen_id VARCHAR(50),
  positionen JSON,
  rabatt_prozent DECIMAL(5,2) DEFAULT 0,
  mwst_prozent DECIMAL(5,2) DEFAULT 19,
  netto DECIMAL(10,2),
  mwst_betrag DECIMAL(10,2),
  brutto DECIMAL(10,2),
  gueltig_bis DATE,
  bemerkungen TEXT,
  status ENUM('entwurf', 'versendet', 'angenommen', 'abgelehnt', 'abgelaufen') DEFAULT 'entwurf',
  invoiced BOOLEAN DEFAULT FALSE,
  created_at BIGINT,
  updated_at BIGINT,
  sent_at BIGINT,
  INDEX idx_kunden_id (kunden_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
);

-- Create rechnungen (invoices) table
CREATE TABLE IF NOT EXISTS rechnungen (
  id VARCHAR(36) PRIMARY KEY,
  nummer VARCHAR(50) UNIQUE NOT NULL,
  kunden_id VARCHAR(50) NOT NULL,
  angebot_id VARCHAR(36),
  positionen JSON,
  mwst_prozent DECIMAL(5,2) DEFAULT 19,
  netto DECIMAL(10,2),
  mwst_betrag DECIMAL(10,2),
  brutto DECIMAL(10,2),
  zahlungsbedingungen TEXT,
  faellig_am DATE,
  bemerkungen TEXT,
  status ENUM('offen', 'bezahlt', 'ueberfaellig', 'storniert') DEFAULT 'offen',
  created_at BIGINT,
  updated_at BIGINT,
  INDEX idx_kunden_id (kunden_id),
  INDEX idx_status (status),
  INDEX idx_faellig_am (faellig_am)
);

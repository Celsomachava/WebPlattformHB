-- Migration: Add Wochenplan table

CREATE TABLE IF NOT EXISTS wochenplan (
  id VARCHAR(36) PRIMARY KEY,
  nummer VARCHAR(50) UNIQUE NOT NULL,
  kunden_id VARCHAR(50) NOT NULL,
  kalenderwoche INT NOT NULL,
  jahr INT NOT NULL,
  plan_rows TEXT,
  status ENUM('entwurf', 'freigegeben', 'archiviert') DEFAULT 'entwurf',
  created_at BIGINT NOT NULL,
  updated_at BIGINT,
  INDEX idx_kunden_id (kunden_id),
  INDEX idx_nummer (nummer),
  INDEX idx_kw_jahr (kalenderwoche, jahr),
  FOREIGN KEY (kunden_id) REFERENCES customers(kundennummer) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Migration: Add Arbeitsauftrag and Pruefprotokoll tables

-- Work Orders Table (Arbeitsauftrag)
CREATE TABLE IF NOT EXISTS arbeitsauftrag (
  id VARCHAR(36) PRIMARY KEY,
  nummer VARCHAR(50) UNIQUE NOT NULL,
  kunden_id VARCHAR(50) NOT NULL,
  service_anfrage_id VARCHAR(36),
  anlagen_id VARCHAR(50),
  techniker VARCHAR(255),
  geplanter_termin DATE,
  tatsaechlicher_termin DATE,
  arbeitszeit_stunden DECIMAL(5, 2) DEFAULT 0,
  durchgefuehrte_arbeiten TEXT,
  verwendete_materialien TEXT,
  bemerkungen TEXT,
  status ENUM('geplant', 'in_bearbeitung', 'abgeschlossen', 'storniert') DEFAULT 'geplant',
  created_at BIGINT NOT NULL,
  updated_at BIGINT,
  INDEX idx_kunden_id (kunden_id),
  INDEX idx_nummer (nummer),
  INDEX idx_service_anfrage (service_anfrage_id),
  FOREIGN KEY (kunden_id) REFERENCES customers(kundennummer) ON DELETE CASCADE,
  FOREIGN KEY (service_anfrage_id) REFERENCES service_requests(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Inspection Protocols Table (Pruefprotokoll DGUV 201-004)
CREATE TABLE IF NOT EXISTS pruefprotokoll (
  id VARCHAR(36) PRIMARY KEY,
  nummer VARCHAR(50) UNIQUE NOT NULL,
  kunden_id VARCHAR(50) NOT NULL,
  service_anfrage_id VARCHAR(36),
  anlagen_id VARCHAR(50),
  pruefdatum DATE NOT NULL,
  naechste_pruefung DATE,
  pruefart VARCHAR(100),
  pruefergebnis ENUM('bestanden', 'nicht_bestanden', 'bedingt_bestanden') DEFAULT 'bestanden',
  pruefpunkte TEXT,
  maengel TEXT,
  bemerkungen TEXT,
  pruefer_name VARCHAR(255),
  pruefer_qualifikation VARCHAR(255),
  status ENUM('entwurf', 'freigegeben', 'archiviert') DEFAULT 'entwurf',
  created_at BIGINT NOT NULL,
  updated_at BIGINT,
  INDEX idx_kunden_id (kunden_id),
  INDEX idx_nummer (nummer),
  INDEX idx_service_anfrage (service_anfrage_id),
  FOREIGN KEY (kunden_id) REFERENCES customers(kundennummer) ON DELETE CASCADE,
  FOREIGN KEY (service_anfrage_id) REFERENCES service_requests(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

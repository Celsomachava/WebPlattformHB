-- Migration: Rename offers table to angebote

USE heduschka_service;

-- Rename the table
RENAME TABLE offers TO angebote;

-- Rename the foreign key in offer_positions
ALTER TABLE offer_positions DROP FOREIGN KEY offer_positions_ibfk_1;
ALTER TABLE offer_positions ADD CONSTRAINT offer_positions_ibfk_1 
  FOREIGN KEY (offer_id) REFERENCES angebote(id) ON DELETE CASCADE;

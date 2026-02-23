-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: heduschka_service
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `angebote`
--

DROP TABLE IF EXISTS `angebote`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `angebote` (
  `id` varchar(36) NOT NULL,
  `nummer` varchar(50) NOT NULL,
  `kunden_id` varchar(50) NOT NULL,
  `service_anfrage_id` varchar(36) DEFAULT NULL,
  `anlagen_id` varchar(50) DEFAULT NULL,
  `positionen` json DEFAULT NULL,
  `rabatt_prozent` decimal(5,2) DEFAULT '0.00',
  `mwst_prozent` decimal(5,2) DEFAULT '19.00',
  `netto` decimal(10,2) DEFAULT NULL,
  `mwst_betrag` decimal(10,2) DEFAULT NULL,
  `brutto` decimal(10,2) DEFAULT NULL,
  `gueltig_bis` date DEFAULT NULL,
  `bemerkungen` text,
  `status` enum('entwurf','versendet','angenommen','abgelehnt','abgelaufen') DEFAULT 'entwurf',
  `invoiced` tinyint(1) DEFAULT '0',
  `created_at` bigint DEFAULT NULL,
  `updated_at` bigint DEFAULT NULL,
  `sent_at` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nummer` (`nummer`),
  KEY `idx_kunden_id` (`kunden_id`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `angebote`
--

LOCK TABLES `angebote` WRITE;
/*!40000 ALTER TABLE `angebote` DISABLE KEYS */;
INSERT INTO `angebote` VALUES ('44e04f0c-4581-451e-b74f-8ff4ffb85c83','ANG-2026-0001','KUNDE_001','sr1','FA_001','[{\"id\": \"079002be-b8cb-4f44-a49c-fda9a6308e17\", \"ust\": 20, \"type\": \"leistung\", \"menge\": 1, \"einzelpreis\": 200, \"gesamtpreis\": 200, \"beschreibung\": \"Wartung - Routinewartung\"}]',0.00,19.00,200.00,38.00,238.00,'2026-03-22','Angebot basierend auf Serviceanfrage SR_001','entwurf',0,1771600521521,NULL,NULL),('5279e56d-aa85-482b-9ee9-5923cd80f280','ANG-2026-0002','KUNDE_002','ea664e95-5542-477a-bfa5-c15ecd8d906c','a1','[{\"id\": \"7e06a87d-9acf-452c-8520-9cad52de5bc9\", \"type\": \"leistung\", \"menge\": 1, \"einzelpreis\": 200, \"gesamtpreis\": 200, \"beschreibung\": \"Wartung - sdfhge\"}]',0.00,19.00,200.00,38.00,238.00,'2026-03-22','Angebot basierend auf Serviceanfrage SR_1771599140729','entwurf',0,1771600673814,NULL,NULL),('a5487c15-4497-4e6e-85dd-c71240d000d8','ANG-2026-0004','KUNDE_006','229424c0-3429-4904-bebf-ebbb224328b2','ca13f8e4-64bf-41ec-8e86-eca242184c55','[{\"id\": \"4beb6900-c156-4533-9b18-e680b0516346\", \"type\": \"leistung\", \"menge\": 1, \"einzelpreis\": 700, \"gesamtpreis\": 700, \"beschreibung\": \"Wartung - descricao\"}]',0.00,19.00,700.00,133.00,833.00,'2026-03-21','Angebot basierend auf Serviceanfrage SR_1771602120818','versendet',0,1771602522439,1771608374007,1771608373993),('f14562f9-26d2-4148-b4cb-005ed03c16c5','ANG-2026-0003','KUNDE_001','ea664e95-5542-477a-bfa5-c15ecd8d906c','a1','[{\"id\": \"9c8c1711-2675-4b82-82c0-2fe72a5f8673\", \"type\": \"leistung\", \"menge\": 1, \"einzelpreis\": 300, \"gesamtpreis\": 300, \"beschreibung\": \"Wartung - sdfhge\"}]',0.00,19.00,300.00,57.00,357.00,'2026-03-21','Angebot basierend auf Serviceanfrage SR_1771599140729','angenommen',0,1771600700357,1771609384204,1771608331657);
/*!40000 ALTER TABLE `angebote` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `anlagen`
--

DROP TABLE IF EXISTS `anlagen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `anlagen` (
  `id` varchar(36) NOT NULL,
  `anlagen_id` varchar(50) NOT NULL,
  `kunden_id` varchar(50) NOT NULL,
  `standort` varchar(255) NOT NULL,
  `filtertyp` varchar(255) NOT NULL,
  `qr_code_id` varchar(100) NOT NULL,
  `created_at` bigint NOT NULL,
  `updated_at` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `anlagen_id` (`anlagen_id`),
  UNIQUE KEY `qr_code_id` (`qr_code_id`),
  KEY `idx_kunden_id` (`kunden_id`),
  KEY `idx_qr_code` (`qr_code_id`),
  CONSTRAINT `anlagen_ibfk_1` FOREIGN KEY (`kunden_id`) REFERENCES `customers` (`kundennummer`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `anlagen`
--

LOCK TABLES `anlagen` WRITE;
/*!40000 ALTER TABLE `anlagen` DISABLE KEYS */;
INSERT INTO `anlagen` VALUES ('a1','FA_001','KUNDE_001','Halle 1','Filteranlage Typ A','QR_FA001',1771590702000,NULL),('a2','FA_002','KUNDE_001','Halle 2','Absauganlage Typ B','QR_FA002',1771590702000,NULL),('a3','FA_003','KUNDE_002','Produktionshalle','Filteranlage Typ C','QR_FA003',1771590702000,NULL),('ca13f8e4-64bf-41ec-8e86-eca242184c55','ANL-3','KUNDE_006','Maputo','MTP','12345',1771601768541,NULL);
/*!40000 ALTER TABLE `anlagen` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `arbeitsauftrag`
--

DROP TABLE IF EXISTS `arbeitsauftrag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `arbeitsauftrag` (
  `id` varchar(36) NOT NULL,
  `nummer` varchar(50) NOT NULL,
  `kunden_id` varchar(50) NOT NULL,
  `service_anfrage_id` varchar(36) DEFAULT NULL,
  `anlagen_id` varchar(50) DEFAULT NULL,
  `techniker` varchar(255) DEFAULT NULL,
  `geplanter_termin` date DEFAULT NULL,
  `tatsaechlicher_termin` date DEFAULT NULL,
  `arbeitszeit_stunden` decimal(5,2) DEFAULT '0.00',
  `durchgefuehrte_arbeiten` text,
  `verwendete_materialien` text,
  `bemerkungen` text,
  `status` enum('geplant','in_bearbeitung','abgeschlossen','storniert') DEFAULT 'geplant',
  `created_at` bigint NOT NULL,
  `updated_at` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nummer` (`nummer`),
  KEY `idx_kunden_id` (`kunden_id`),
  KEY `idx_nummer` (`nummer`),
  KEY `idx_service_anfrage` (`service_anfrage_id`),
  CONSTRAINT `arbeitsauftrag_ibfk_1` FOREIGN KEY (`kunden_id`) REFERENCES `customers` (`kundennummer`) ON DELETE CASCADE,
  CONSTRAINT `arbeitsauftrag_ibfk_2` FOREIGN KEY (`service_anfrage_id`) REFERENCES `service_requests` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `arbeitsauftrag`
--

LOCK TABLES `arbeitsauftrag` WRITE;
/*!40000 ALTER TABLE `arbeitsauftrag` DISABLE KEYS */;
/*!40000 ALTER TABLE `arbeitsauftrag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `id` varchar(36) NOT NULL,
  `kundennummer` varchar(50) NOT NULL,
  `firmenname` varchar(255) NOT NULL,
  `ansprechpartner` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `telefon` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('customer','admin') DEFAULT 'customer',
  `created_at` bigint NOT NULL,
  `updated_at` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `kundennummer` (`kundennummer`),
  KEY `idx_kundennummer` (`kundennummer`),
  KEY `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES ('1791a3f6-05c3-4f0d-a0c5-ba01ec9954bc','KUNDE_006','Joaquim Magode','Celso Machava','joaquimcesarmagode@gmail.com','+918141192607','$2a$10$IaL/IAasONcXFoU3cZs91OKZmQRq3v2D7VLOvmU/vcLl/cHgiLkK2','customer',1771601628182,NULL),('88a6d13c-90fd-427a-9977-54bbeea8c95e','KUNDE_005','a','a','jmagode67@gnail.com','+258849493642','$2a$10$e4L/Nv2Hq7igKn8e0jo.6OZSG6siuo6puJxzI34TmPLQiCEgi8olC','customer',1771598167554,NULL),('a1','ADMIN_001','Heduschka GmbH','Admin User','admin@heduschka.de','+49 987 654321','$2a$10$jST/XLz5CtEqqZT4ZC37Ke3dnqBkP/j4EdKDtG4ruhVdUAf.QobPK','admin',1771590699000,NULL),('c1','KUNDE_001','Mustermann GmbH','Max Mustermann','max@mustermann.de','+49 123 456789','$2a$10$BqusEQgghpGUak5uwdvy..mbXJt9yX9UEhS6/.AfvpfOJ2nmPZibG','customer',1771590699000,NULL),('c2','KUNDE_002','Kernup','Anna Schmidt','a.schmidt@techcorp.de','+49 234 567890','$2a$10$BqusEQgghpGUak5uwdvy..mbXJt9yX9UEhS6/.AfvpfOJ2nmPZibG','customer',1771590699000,NULL),('c3','KUNDE_003','Weber Maschinenbau','Peter Weber','p.weber@weber-mb.de','+49 345 678901','$2a$10$rKZvVqVqVqVqVqVqVqVqVuO8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K','customer',1771590699000,NULL),('f5cdc260-fa43-492c-8593-95a0e391ff92','KUNDE_004','Parul University','dsg','joaquimcesarmagode@gmail.com','+918141192607','$2a$10$uN8aL.iOjfXXnAXs4xyeDeOAzcwQniNYh0GUQmn56KfrRtCLJauiy','customer',1771594984488,NULL);
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoice_positions`
--

DROP TABLE IF EXISTS `invoice_positions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoice_positions` (
  `id` varchar(36) NOT NULL,
  `invoice_id` varchar(36) NOT NULL,
  `position_nr` int NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `beschreibung` text NOT NULL,
  `menge` int NOT NULL DEFAULT '1',
  `einzelpreis` decimal(10,2) NOT NULL,
  `gesamtpreis` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_invoice_id` (`invoice_id`),
  CONSTRAINT `invoice_positions_ibfk_1` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoice_positions`
--

LOCK TABLES `invoice_positions` WRITE;
/*!40000 ALTER TABLE `invoice_positions` DISABLE KEYS */;
/*!40000 ALTER TABLE `invoice_positions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoices`
--

DROP TABLE IF EXISTS `invoices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoices` (
  `id` varchar(36) NOT NULL,
  `nummer` varchar(50) NOT NULL,
  `kunden_id` varchar(50) NOT NULL,
  `faellig_am` date DEFAULT NULL,
  `bemerkungen` text,
  `netto` decimal(10,2) DEFAULT '0.00',
  `mwst` decimal(10,2) DEFAULT '0.00',
  `brutto` decimal(10,2) DEFAULT '0.00',
  `status` enum('offen','bezahlt','ueberfaellig','storniert') DEFAULT 'offen',
  `created_at` bigint NOT NULL,
  `updated_at` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nummer` (`nummer`),
  KEY `idx_kunden_id` (`kunden_id`),
  KEY `idx_nummer` (`nummer`),
  CONSTRAINT `invoices_ibfk_1` FOREIGN KEY (`kunden_id`) REFERENCES `customers` (`kundennummer`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoices`
--

LOCK TABLES `invoices` WRITE;
/*!40000 ALTER TABLE `invoices` DISABLE KEYS */;
/*!40000 ALTER TABLE `invoices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `offer_positions`
--

DROP TABLE IF EXISTS `offer_positions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `offer_positions` (
  `id` varchar(36) NOT NULL,
  `offer_id` varchar(36) NOT NULL,
  `position_nr` int NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `beschreibung` text NOT NULL,
  `menge` int NOT NULL DEFAULT '1',
  `einzelpreis` decimal(10,2) NOT NULL,
  `gesamtpreis` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_offer_id` (`offer_id`),
  CONSTRAINT `offer_positions_ibfk_1` FOREIGN KEY (`offer_id`) REFERENCES `offers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `offer_positions`
--

LOCK TABLES `offer_positions` WRITE;
/*!40000 ALTER TABLE `offer_positions` DISABLE KEYS */;
/*!40000 ALTER TABLE `offer_positions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `offers`
--

DROP TABLE IF EXISTS `offers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `offers` (
  `id` varchar(36) NOT NULL,
  `nummer` varchar(50) NOT NULL,
  `kunden_id` varchar(50) NOT NULL,
  `gueltig_bis` date DEFAULT NULL,
  `bemerkungen` text,
  `netto` decimal(10,2) DEFAULT '0.00',
  `mwst` decimal(10,2) DEFAULT '0.00',
  `brutto` decimal(10,2) DEFAULT '0.00',
  `status` enum('entwurf','versendet','angenommen','abgelehnt') DEFAULT 'entwurf',
  `created_at` bigint NOT NULL,
  `updated_at` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nummer` (`nummer`),
  KEY `idx_kunden_id` (`kunden_id`),
  KEY `idx_nummer` (`nummer`),
  CONSTRAINT `offers_ibfk_1` FOREIGN KEY (`kunden_id`) REFERENCES `customers` (`kundennummer`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `offers`
--

LOCK TABLES `offers` WRITE;
/*!40000 ALTER TABLE `offers` DISABLE KEYS */;
/*!40000 ALTER TABLE `offers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pruefprotokoll`
--

DROP TABLE IF EXISTS `pruefprotokoll`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pruefprotokoll` (
  `id` varchar(36) NOT NULL,
  `nummer` varchar(50) NOT NULL,
  `kunden_id` varchar(50) NOT NULL,
  `service_anfrage_id` varchar(36) DEFAULT NULL,
  `anlagen_id` varchar(50) DEFAULT NULL,
  `pruefdatum` date NOT NULL,
  `naechste_pruefung` date DEFAULT NULL,
  `pruefart` varchar(100) DEFAULT NULL,
  `pruefergebnis` enum('bestanden','nicht_bestanden','bedingt_bestanden') DEFAULT 'bestanden',
  `pruefpunkte` text,
  `maengel` text,
  `bemerkungen` text,
  `pruefer_name` varchar(255) DEFAULT NULL,
  `pruefer_qualifikation` varchar(255) DEFAULT NULL,
  `status` enum('entwurf','freigegeben','archiviert') DEFAULT 'entwurf',
  `created_at` bigint NOT NULL,
  `updated_at` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nummer` (`nummer`),
  KEY `idx_kunden_id` (`kunden_id`),
  KEY `idx_nummer` (`nummer`),
  KEY `idx_service_anfrage` (`service_anfrage_id`),
  CONSTRAINT `pruefprotokoll_ibfk_1` FOREIGN KEY (`kunden_id`) REFERENCES `customers` (`kundennummer`) ON DELETE CASCADE,
  CONSTRAINT `pruefprotokoll_ibfk_2` FOREIGN KEY (`service_anfrage_id`) REFERENCES `service_requests` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pruefprotokoll`
--

LOCK TABLES `pruefprotokoll` WRITE;
/*!40000 ALTER TABLE `pruefprotokoll` DISABLE KEYS */;
/*!40000 ALTER TABLE `pruefprotokoll` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rechnungen`
--

DROP TABLE IF EXISTS `rechnungen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rechnungen` (
  `id` varchar(36) NOT NULL,
  `nummer` varchar(50) NOT NULL,
  `kunden_id` varchar(50) NOT NULL,
  `angebot_id` varchar(36) DEFAULT NULL,
  `positionen` json DEFAULT NULL,
  `mwst_prozent` decimal(5,2) DEFAULT '19.00',
  `netto` decimal(10,2) DEFAULT NULL,
  `mwst_betrag` decimal(10,2) DEFAULT NULL,
  `brutto` decimal(10,2) DEFAULT NULL,
  `zahlungsbedingungen` text,
  `faellig_am` date DEFAULT NULL,
  `bemerkungen` text,
  `status` enum('offen','bezahlt','ueberfaellig','storniert') DEFAULT 'offen',
  `created_at` bigint DEFAULT NULL,
  `updated_at` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nummer` (`nummer`),
  KEY `idx_kunden_id` (`kunden_id`),
  KEY `idx_status` (`status`),
  KEY `idx_faellig_am` (`faellig_am`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rechnungen`
--

LOCK TABLES `rechnungen` WRITE;
/*!40000 ALTER TABLE `rechnungen` DISABLE KEYS */;
INSERT INTO `rechnungen` VALUES ('106ae9ea-c2be-46a8-97db-e146446d507d','RE-2026-0001','KUNDE_001','f14562f9-26d2-4148-b4cb-005ed03c16c5','[{\"id\": \"9c8c1711-2675-4b82-82c0-2fe72a5f8673\", \"type\": \"leistung\", \"menge\": 1, \"einzelpreis\": 300, \"gesamtpreis\": 300, \"beschreibung\": \"Wartung - sdfhge\"}]',19.00,300.00,57.00,357.00,'Zahlbar innerhalb 14 Tagen ohne Abzug','2026-03-06','Rechnung basierend auf Angebot ANG-2026-0003','offen',1771609491083,1771609860330);
/*!40000 ALTER TABLE `rechnungen` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `service_requests`
--

DROP TABLE IF EXISTS `service_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `service_requests` (
  `id` varchar(36) NOT NULL,
  `nummer` varchar(50) NOT NULL,
  `kunden_id` varchar(50) NOT NULL,
  `anlagen_id` varchar(50) DEFAULT NULL,
  `standort` varchar(255) DEFAULT NULL,
  `filtertyp` varchar(255) DEFAULT NULL,
  `qr_code` varchar(100) DEFAULT NULL,
  `serviceart` varchar(100) NOT NULL,
  `dringlichkeit` enum('normal','dringend') DEFAULT 'normal',
  `wunschtermin` date DEFAULT NULL,
  `zeitfenster` varchar(50) DEFAULT NULL,
  `bemerkungen` text,
  `status` enum('neu','bearbeitet','abgeschlossen','storniert') DEFAULT 'neu',
  `created_at` bigint NOT NULL,
  `updated_at` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nummer` (`nummer`),
  KEY `idx_kunden_id` (`kunden_id`),
  KEY `idx_status` (`status`),
  KEY `idx_nummer` (`nummer`),
  CONSTRAINT `service_requests_ibfk_1` FOREIGN KEY (`kunden_id`) REFERENCES `customers` (`kundennummer`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service_requests`
--

LOCK TABLES `service_requests` WRITE;
/*!40000 ALTER TABLE `service_requests` DISABLE KEYS */;
INSERT INTO `service_requests` VALUES ('229424c0-3429-4904-bebf-ebbb224328b2','SR_1771602120818','KUNDE_006','ca13f8e4-64bf-41ec-8e86-eca242184c55',NULL,NULL,NULL,'Wartung','dringend','2026-02-21','08:00-12:00','descricao','neu',1771602120818,1771602120818),('ea664e95-5542-477a-bfa5-c15ecd8d906c','SR_1771599140729','KUNDE_001','a1',NULL,NULL,NULL,'Wartung','dringend','2026-02-21','08:00-12:00','sdfhge','neu',1771599140729,1771599140729),('sr1','SR_001','KUNDE_001','FA_001','Halle 1','Filteranlage Typ A',NULL,'Wartung','normal','2024-02-15',NULL,'Routinewartung','neu',1771590705000,1771590705000),('sr2','SR_002','KUNDE_002','FA_003','Produktionshalle','Filteranlage Typ C',NULL,'Reparatur','dringend','2024-02-10',NULL,'Filter defekt','bearbeitet',1771590705000,1771590705000);
/*!40000 ALTER TABLE `service_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wochenplan`
--

DROP TABLE IF EXISTS `wochenplan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wochenplan` (
  `id` varchar(36) NOT NULL,
  `nummer` varchar(50) NOT NULL,
  `kunden_id` varchar(50) NOT NULL,
  `kalenderwoche` int NOT NULL,
  `jahr` int NOT NULL,
  `plan_rows` text,
  `status` enum('entwurf','freigegeben','archiviert') DEFAULT 'entwurf',
  `created_at` bigint NOT NULL,
  `updated_at` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nummer` (`nummer`),
  KEY `idx_kunden_id` (`kunden_id`),
  KEY `idx_nummer` (`nummer`),
  KEY `idx_kw_jahr` (`kalenderwoche`,`jahr`),
  CONSTRAINT `wochenplan_ibfk_1` FOREIGN KEY (`kunden_id`) REFERENCES `customers` (`kundennummer`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wochenplan`
--

LOCK TABLES `wochenplan` WRITE;
/*!40000 ALTER TABLE `wochenplan` DISABLE KEYS */;
/*!40000 ALTER TABLE `wochenplan` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-21  0:23:39

import 'dotenv/config';
import mysql from 'mysql2/promise';

async function setupDatabase() {
  let connection;
  
  try {
    console.log('🔄 Connecting to MySQL...');
    
    // Connect without database first
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'admin',
      multipleStatements: true
    });
    
    console.log('✅ Connected to MySQL');
    
    // Create database
    console.log('🔄 Creating database...');
    await connection.query(`CREATE DATABASE IF NOT EXISTS heduschka_service`);
    await connection.query(`USE heduschka_service`);
    console.log('✅ Database created/selected');
    
    // Create customers table
    console.log('🔄 Creating customers table...');
    await connection.query(`
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
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    
    // Create anlagen table
    console.log('🔄 Creating anlagen table...');
    await connection.query(`
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
        INDEX idx_qr_code (qr_code_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    
    // Create service_requests table
    console.log('🔄 Creating service_requests table...');
    await connection.query(`
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
        INDEX idx_nummer (nummer)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    
    console.log('✅ Tables created');
    
    // Insert demo data
    console.log('🔄 Inserting demo data...');
    
    // Insert customers (passwords are hashed for demo123 and admin123)
    await connection.query(`
      INSERT IGNORE INTO customers (id, kundennummer, firmenname, ansprechpartner, email, telefon, password, role, created_at) VALUES
      ('c1', 'KUNDE_001', 'Mustermann GmbH', 'Max Mustermann', 'max@mustermann.de', '+49 123 456789', '$2a$10$dv.b8vopTF4FSjApZ0fIu.1hKhJyQ976Uedhsfjk9OpBdqPzVicFO', 'customer', ${Date.now()}),
      ('c2', 'KUNDE_002', 'TechCorp AG', 'Anna Schmidt', 'a.schmidt@techcorp.de', '+49 234 567890', '$2a$10$dv.b8vopTF4FSjApZ0fIu.1hKhJyQ976Uedhsfjk9OpBdqPzVicFO', 'customer', ${Date.now()}),
      ('a1', 'ADMIN_001', 'Heduschka GmbH', 'Admin User', 'admin@heduschka.de', '+49 987 654321', '$2a$10$..LAcoWFCIzYDZOaOKnw1.9aO3vAt.Sn2lTQbntxnRUmKW0Ol9ZXG', 'admin', ${Date.now()})
    `);
    
    // Insert anlagen
    await connection.query(`
      INSERT IGNORE INTO anlagen (id, anlagen_id, kunden_id, standort, filtertyp, qr_code_id, created_at) VALUES
      ('a1', 'FA_001', 'KUNDE_001', 'Halle 1', 'Filteranlage Typ A', 'QR_FA001', ${Date.now()}),
      ('a2', 'FA_002', 'KUNDE_001', 'Halle 2', 'Absauganlage Typ B', 'QR_FA002', ${Date.now()}),
      ('a3', 'FA_003', 'KUNDE_002', 'Produktionshalle', 'Filteranlage Typ C', 'QR_FA003', ${Date.now()})
    `);
    
    console.log('✅ Demo data inserted');
    
    console.log('\n🎉 Database setup complete!');
    console.log('\n📋 Demo Accounts:');
    console.log('- Customer: KUNDE_001 / demo123');
    console.log('- Admin:    ADMIN_001 / admin123');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();
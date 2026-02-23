import 'dotenv/config';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

async function setupDatabase() {
  let connection;
  
  try {
    console.log('🔄 Connecting to MySQL...');
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'admin'
    });
    
    console.log('✅ Connected to MySQL');
    
    // Create database
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'heduschka_service'}`);
    await connection.execute(`USE ${process.env.DB_NAME || 'heduschka_service'}`);
    console.log('✅ Database created/selected');
    
    // Create customers table
    await connection.execute(`
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
    console.log('✅ Customers table created');
    
    // Hash passwords
    const adminPassword = await bcrypt.hash('admin123', 10);
    const customerPassword = await bcrypt.hash('demo123', 10);
    
    // Insert demo users
    await connection.execute(`
      INSERT IGNORE INTO customers (id, kundennummer, firmenname, ansprechpartner, email, telefon, password, role, created_at) VALUES
      ('c1', 'ADMIN_001', 'Heduschka GmbH', 'Admin User', 'admin@heduschka.de', '+49 987 654321', ?, 'admin', ?),
      ('c2', 'KUNDE_001', 'Mustermann GmbH', 'Max Mustermann', 'max@mustermann.de', '+49 123 456789', ?, 'customer', ?),
      ('c3', 'KUNDE_002', 'TechCorp AG', 'Anna Schmidt', 'a.schmidt@techcorp.de', '+49 234 567890', ?, 'customer', ?),
      ('c4', 'KUNDE_003', 'Weber Maschinenbau', 'Peter Weber', 'p.weber@weber-mb.de', '+49 345 678901', ?, 'customer', ?)
    `, [adminPassword, Date.now(), customerPassword, Date.now(), customerPassword, Date.now(), customerPassword, Date.now()]);
    
    console.log('✅ Demo users inserted');
    
    // Test login
    const [users] = await connection.execute('SELECT * FROM customers WHERE kundennummer = ?', ['ADMIN_001']);
    if (users.length > 0) {
      const isValid = await bcrypt.compare('admin123', users[0].password);
      console.log('✅ Password test:', isValid ? 'PASS' : 'FAIL');
    }
    
    console.log('\n🎉 Database setup complete!');
    console.log('\n📋 Demo Accounts:');
    console.log('- Admin:    ADMIN_001 / admin123');
    console.log('- Customer: KUNDE_001 / demo123');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();
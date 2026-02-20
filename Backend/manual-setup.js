import 'dotenv/config';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

async function manualSetup() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'admin'
    });
    
    console.log('✅ Connected to MySQL');
    
    // Create database
    await connection.execute(`CREATE DATABASE IF NOT EXISTS heduschka_service`);
    console.log('✅ Database created');
    
    await connection.execute(`USE heduschka_service`);
    console.log('✅ Using database');
    
    // Drop and recreate table
    await connection.execute(`DROP TABLE IF EXISTS customers`);
    console.log('✅ Dropped old table');
    
    await connection.execute(`
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
      )
    `);
    console.log('✅ Table created');
    
    // Hash passwords
    const adminHash = await bcrypt.hash('admin123', 10);
    const customerHash = await bcrypt.hash('demo123', 10);
    
    // Insert admin
    await connection.execute(`
      INSERT INTO customers (id, kundennummer, firmenname, ansprechpartner, email, telefon, password, role, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, ['admin1', 'ADMIN_001', 'Heduschka GmbH', 'Admin User', 'admin@heduschka.de', '+49 987 654321', adminHash, 'admin', Date.now()]);
    
    // Insert customers
    await connection.execute(`
      INSERT INTO customers (id, kundennummer, firmenname, ansprechpartner, email, telefon, password, role, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, ['kunde1', 'KUNDE_001', 'Mustermann GmbH', 'Max Mustermann', 'max@mustermann.de', '+49 123 456789', customerHash, 'customer', Date.now()]);
    
    await connection.execute(`
      INSERT INTO customers (id, kundennummer, firmenname, ansprechpartner, email, telefon, password, role, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, ['kunde2', 'KUNDE_002', 'TechCorp AG', 'Anna Schmidt', 'a.schmidt@techcorp.de', '+49 234 567890', customerHash, 'customer', Date.now()]);
    
    console.log('✅ Users inserted');
    
    // Test query
    const [users] = await connection.execute('SELECT kundennummer, role FROM customers');
    console.log('✅ Users in database:', users);
    
    console.log('\n🎉 Setup complete!');
    console.log('Login with: ADMIN_001 / admin123');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

manualSetup();
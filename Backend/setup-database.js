import 'dotenv/config';
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

async function setupDatabase() {
  let connection;
  
  try {
    console.log('🔄 Connecting to MySQL...');
    
    // Connect without database first to create it
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'admin'
    });
    
    console.log('✅ Connected to MySQL');
    
    // Create database
    console.log('🔄 Creating database...');
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'heduschka_service'}`);
    await connection.execute(`USE ${process.env.DB_NAME || 'heduschka_service'}`);
    console.log('✅ Database created/selected');
    
    // Read and execute schema
    console.log('🔄 Creating tables...');
    const schemaSQL = fs.readFileSync(path.join(process.cwd(), 'database', 'schema.sql'), 'utf8');
    const schemaStatements = schemaSQL.split(';').filter(stmt => stmt.trim() && !stmt.trim().startsWith('--'));
    
    for (const statement of schemaStatements) {
      if (statement.trim()) {
        try {
          await connection.query(statement);
        } catch (err) {
          if (!err.message.includes('already exists')) {
            console.warn('Warning:', err.message);
          }
        }
      }
    }
    console.log('✅ Tables created');
    
    // Read and execute seed data
    console.log('🔄 Inserting demo data...');
    const seedSQL = fs.readFileSync(path.join(process.cwd(), 'database', 'seed.sql'), 'utf8');
    const seedStatements = seedSQL.split(';').filter(stmt => stmt.trim() && !stmt.trim().startsWith('--'));
    
    for (const statement of seedStatements) {
      if (statement.trim()) {
        try {
          await connection.query(statement);
        } catch (err) {
          if (!err.message.includes('Duplicate entry')) {
            console.warn('Warning:', err.message);
          }
        }
      }
    }
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
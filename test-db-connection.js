// Simple test script to verify database connection and customer data
import mysql from 'mysql2/promise';
import 'dotenv/config';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'admin',
  database: process.env.DB_NAME || 'heduschka_service'
};

async function testConnection() {
  try {
    console.log('🔌 Testing database connection...');
    console.log('Config:', { ...dbConfig, password: '***' });
    
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ Database connected successfully!');
    
    // Test customer query
    const [customers] = await connection.query(
      'SELECT id, kundennummer, firmenname, ansprechpartner, email, telefon, role, created_at FROM customers'
    );
    
    console.log(`📊 Found ${customers.length} customers in database:`);
    customers.forEach(customer => {
      console.log(`  - ${customer.kundennummer}: ${customer.firmenname} (${customer.role})`);
    });
    
    await connection.end();
    console.log('🔌 Connection closed');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
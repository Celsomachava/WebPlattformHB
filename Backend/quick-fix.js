import 'dotenv/config';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

async function fixPasswords() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });
  
  const adminPwd = await bcrypt.hash('admin123', 10);
  const customerPwd = await bcrypt.hash('demo123', 10);
  
  await connection.execute('UPDATE customers SET password = ? WHERE kundennummer = ?', [adminPwd, 'ADMIN_001']);
  await connection.execute('UPDATE customers SET password = ? WHERE kundennummer = ?', [customerPwd, 'KUNDE_001']);
  
  console.log('✅ Passwords updated');
  console.log('ADMIN_001: admin123');
  console.log('KUNDE_001: demo123');
  
  await connection.end();
}

fixPasswords();

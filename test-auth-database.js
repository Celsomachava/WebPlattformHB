// Test database-only authentication
import 'dotenv/config';
import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3002';

async function testAuth() {
  console.log('🔐 Testing Database-Only Authentication\n');
  
  // Test 1: Valid credentials from database
  console.log('1. Testing valid credentials (ADMIN_001/admin123)...');
  try {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'ADMIN_001', password: 'admin123' })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Login successful');
      console.log(`   User: ${data.user.name} (${data.user.role})`);
      console.log(`   Company: ${data.user.company}`);
      
      // Test token validation
      console.log('\n2. Testing token validation...');
      const validateResponse = await fetch(`${API_BASE}/api/auth/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: data.token })
      });
      
      if (validateResponse.ok) {
        console.log('✅ Token validation successful');
      } else {
        console.log('❌ Token validation failed');
      }
    } else {
      console.log('❌ Login failed');
    }
  } catch (error) {
    console.log('❌ Connection error:', error.message);
  }
  
  // Test 2: Invalid credentials
  console.log('\n3. Testing invalid credentials...');
  try {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'INVALID_USER', password: 'wrong' })
    });
    
    if (response.ok) {
      console.log('❌ Login should have failed but succeeded');
    } else {
      console.log('✅ Invalid credentials correctly rejected');
    }
  } catch (error) {
    console.log('❌ Connection error:', error.message);
  }
  
  // Test 3: Customer login
  console.log('\n4. Testing customer login (KUNDE_001/demo123)...');
  try {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'KUNDE_001', password: 'demo123' })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Customer login successful');
      console.log(`   User: ${data.user.name} (${data.user.role})`);
      console.log(`   Company: ${data.user.company}`);
    } else {
      console.log('❌ Customer login failed');
    }
  } catch (error) {
    console.log('❌ Connection error:', error.message);
  }
  
  console.log('\n🎯 Authentication test complete!');
  console.log('\nTo test in browser:');
  console.log('1. Start backend: cd Backend && npm start');
  console.log('2. Start frontend: npm run dev');
  console.log('3. Login with ADMIN_001/admin123 or KUNDE_001/demo123');
}

testAuth();
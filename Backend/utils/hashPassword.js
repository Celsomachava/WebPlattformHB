import bcrypt from 'bcryptjs';

const passwords = {
  'demo123': await bcrypt.hash('demo123', 10),
  'admin123': await bcrypt.hash('admin123', 10)
};

console.log('Password Hashes:');
console.log('demo123:', passwords['demo123']);
console.log('admin123:', passwords['admin123']);

import 'dotenv/config';
import db from './config/database.js';
import fs from 'fs';

async function runMigration() {
  try {
    const migrations = [
      './migrations/create_angebote_rechnungen.sql',
      './migrations/create_arbeitsauftrag_pruefprotokoll.sql',
      './migrations/create_wochenplan.sql'
    ];
    
    for (const migrationFile of migrations) {
      if (!fs.existsSync(migrationFile)) {
        console.log(`⚠️  Skipping ${migrationFile} (not found)`);
        continue;
      }
      
      console.log(`\n📄 Running ${migrationFile}...`);
      const sql = fs.readFileSync(migrationFile, 'utf8');
      const statements = sql.split(';').filter(s => s.trim());
      
      for (const statement of statements) {
        if (statement.trim()) {
          await db.query(statement);
          console.log('✓ Executed statement');
        }
      }
      console.log(`✅ ${migrationFile} completed`);
    }
    
    console.log('\n✅ All migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();

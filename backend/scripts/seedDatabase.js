import bcrypt from 'bcryptjs';
import { Chance } from 'chance';
import { runQuery } from '../database/init.js';

const chance = new Chance();

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    await runQuery(`
      INSERT OR IGNORE INTO users (email, password, firstname, lastname, role)
      VALUES (?, ?, ?, ?, ?)
    `, ['admin@praktik.com', adminPassword, 'Admin', 'User', 'admin']);

    // Create test user
    const testPassword = await bcrypt.hash('test123', 12);
    await runQuery(`
      INSERT OR IGNORE INTO users (email, password, firstname, lastname, role)
      VALUES (?, ?, ?, ?, ?)
    `, ['test@praktik.com', testPassword, 'Test', 'User', 'user']);

    console.log('✅ Users seeded');

    // Seed some sample blog posts
    for (let i = 0; i < 5; i++) {
      await runQuery(`
        INSERT INTO blog_posts (title, content, author_id, category, view_count)
        VALUES (?, ?, ?, ?, ?)
      `, [
        chance.sentence({ words: 5 }),
        chance.paragraph({ sentences: 5 }),
        1, // admin user
        chance.pickone(['Technology', 'Business', 'Design', 'Development']),
        chance.integer({ min: 10, max: 1000 })
      ]);
    }

    console.log('✅ Blog posts seeded');

    // Seed some sample contacts for test user (id: 2)
    for (let i = 0; i < 10; i++) {
      await runQuery(`
        INSERT INTO contacts (
          user_id, firstname, lastname, department, company, 
          phone, email, frequently_contacted, starred
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        2, // test user
        chance.first(),
        chance.last(),
        chance.pickone(['Sales', 'Marketing', 'Engineering', 'Support']),
        chance.company(),
        chance.phone(),
        chance.email(),
        chance.bool({ likelihood: 20 }),
        chance.bool({ likelihood: 15 })
      ]);
    }

    console.log('✅ Contacts seeded');

    console.log('🎉 Database seeding completed!');
    console.log('📝 Login credentials:');
    console.log('   Admin: admin@praktik.com / admin123');
    console.log('   Test User: test@praktik.com / test123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to seed database:', error);
    process.exit(1);
  }
}

seedDatabase();

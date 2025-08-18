// Quick script to add test data
import { runQuery, getAll } from '../database/init.js';

const addTestData = async () => {
  try {
    console.log('Adding test data...');
    
    // First, add some test companies and internships if they don't exist
    const companies = await getAll('SELECT * FROM companies LIMIT 1');
    if (companies.length === 0) {
      await runQuery(`
        INSERT INTO companies (name, description, location, website) 
        VALUES 
        ('TechCorp AB', 'Leading tech company', 'Stockholm', 'https://techcorp.se'),
        ('DataSoft Solutions', 'Data analytics specialists', 'Göteborg', 'https://datasoft.se')
      `);
    }
    
    const internships = await getAll('SELECT * FROM internships LIMIT 1');
    if (internships.length === 0) {
      await runQuery(`
        INSERT INTO internships (company_id, title, description, location, duration_weeks, start_date, application_deadline, status)
        VALUES 
        (1, 'Frontend Developer Intern', 'Learn React and modern web development', 'Stockholm', 12, '2025-09-01', '2025-08-25', 'active'),
        (2, 'Data Analyst Intern', 'Work with big data and analytics', 'Göteborg', 10, '2025-09-15', '2025-09-01', 'active')
      `);
    }
    
    // Add test applications
    await runQuery('DELETE FROM applications');
    
    await runQuery(`
      INSERT INTO applications (internship_id, student_name, student_email, student_phone, cover_letter, status, applied_at)
      VALUES 
      (1, 'Anna Andersson', 'anna@student.se', '070-123-4567', 'Jag är intresserad av frontend utveckling.', 'pending', '2025-08-01 10:00:00'),
      (1, 'Erik Johansson', 'erik@student.se', '070-234-5678', 'React är min passion!', 'accepted', '2025-08-05 14:30:00'),
      (2, 'Maria Lindqvist', 'maria@student.se', '070-345-6789', 'Data analys är framtiden.', 'reviewing', '2025-08-08 09:15:00'),
      (1, 'David Nilsson', 'david@student.se', '070-456-7890', 'Vill lära mig mer om modern webbutveckling.', 'rejected', '2025-07-28 16:45:00'),
      (2, 'Sara Karlsson', 'sara@student.se', '070-567-8901', 'Statistik och programmering är mina intressen.', 'pending', '2025-08-10 11:20:00')
    `);
    
    console.log('✅ Test data added successfully!');
    
    // Verify the data
    const apps = await getAll(`
      SELECT a.*, i.title as internship_title, c.name as company_name
      FROM applications a
      JOIN internships i ON a.internship_id = i.id
      LEFT JOIN companies c ON i.company_id = c.id
      LIMIT 3
    `);
    
    console.log('Sample applications:', apps);
    
  } catch (error) {
    console.error('Error:', error);
  }
  
  process.exit(0);
};

addTestData();

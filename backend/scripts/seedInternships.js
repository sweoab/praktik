import { runQuery } from '../database/init.js';

async function seedInternshipData() {
  try {
    console.log('🌱 Starting to seed internship data...');

    // Create some test companies first
    const companies = [
      {
        user_id: 1, // Assuming admin user
        name: 'Tech Innovations AB',
        description: 'Ett ledande teknologiföretag inom AI och machine learning',
        industry: 'Teknologi',
        location: 'Stockholm',
        website: 'https://techinnovations.se',
        contact_email: 'praktik@techinnovations.se',
        contact_phone: '+46 8 123 456 78',
        employee_count: '50-100',
        founded_year: 2015
      },
      {
        user_id: 1,
        name: 'Green Solutions Nordic',
        description: 'Hållbara lösningar för en grönare framtid',
        industry: 'Miljö & Hållbarhet',
        location: 'Göteborg',
        website: 'https://greensolutions.se',
        contact_email: 'careers@greensolutions.se',
        contact_phone: '+46 31 987 654 32',
        employee_count: '20-50',
        founded_year: 2018
      },
      {
        user_id: 1,
        name: 'Digital Design Studio',
        description: 'Kreativ design och digital marknadsföring',
        industry: 'Design & Media',
        location: 'Malmö',
        website: 'https://digitaldesign.se',
        contact_email: 'internships@digitaldesign.se',
        contact_phone: '+46 40 555 777 99',
        employee_count: '10-20',
        founded_year: 2020
      }
    ];

    // Insert companies
    const companyIds = [];
    for (const company of companies) {
      const result = await runQuery(`
        INSERT INTO companies (
          user_id, name, description, industry, location,
          website, contact_email, contact_phone, employee_count, founded_year
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        company.user_id, company.name, company.description, company.industry,
        company.location, company.website, company.contact_email,
        company.contact_phone, company.employee_count, company.founded_year
      ]);
      companyIds.push(result.id);
      console.log(`✅ Created company: ${company.name}`);
    }

    // Create internships
    const internships = [
      {
        company_id: companyIds[0],
        title: 'Frontend Developer Praktikant',
        description: 'Arbeta med React, TypeScript och moderna webteknologier. Du kommer att vara en del av vårt utvecklingsteam och bidra till spännande projekt inom AI och machine learning.',
        requirements: 'Grundläggande kunskaper i HTML, CSS, JavaScript. Erfarenhet av React är meriterande.',
        location: 'Stockholm',
        duration_weeks: 16,
        start_date: '2025-09-01',
        end_date: '2025-12-20',
        application_deadline: '2025-08-20',
        compensation: 12000,
        remote_allowed: 1,
        field_of_study: 'Datavetenskap',
        required_skills: JSON.stringify(['JavaScript', 'HTML', 'CSS']),
        preferred_skills: JSON.stringify(['React', 'TypeScript', 'Git']),
        spots_available: 2
      },
      {
        company_id: companyIds[0],
        title: 'Backend Developer Praktikant',
        description: 'Utveckla robusta API:er och microservices med Node.js och Python. Perfekt möjlighet att lära sig om skalbar backend-arkitektur.',
        requirements: 'Programmeringskunskaper i något av följande: Node.js, Python, Java. Grundläggande databaskunskaper.',
        location: 'Stockholm',
        duration_weeks: 20,
        start_date: '2025-09-15',
        end_date: '2026-02-06',
        application_deadline: '2025-08-25',
        compensation: 13000,
        remote_allowed: 1,
        field_of_study: 'Datavetenskap',
        required_skills: JSON.stringify(['Python', 'Node.js', 'SQL']),
        preferred_skills: JSON.stringify(['Docker', 'AWS', 'MongoDB']),
        spots_available: 1
      },
      {
        company_id: companyIds[1],
        title: 'Miljöingenjör Praktikant',
        description: 'Arbeta med hållbarhetsprojekt och miljöanalys. Du får möjlighet att bidra till verkliga miljölösningar och lära dig om grön teknologi.',
        requirements: 'Studerar miljöingenjörsvetenskap, kemiteknik eller liknande. Intresse för hållbarhet och miljöfrågor.',
        location: 'Göteborg',
        duration_weeks: 12,
        start_date: '2025-06-01',
        end_date: '2025-08-24',
        application_deadline: '2025-05-15',
        compensation: 11000,
        remote_allowed: 0,
        field_of_study: 'Miljöingenjörsvetenskap',
        required_skills: JSON.stringify(['Miljöanalys', 'Projektledning']),
        preferred_skills: JSON.stringify(['GIS', 'AutoCAD', 'Excel']),
        spots_available: 3
      },
      {
        company_id: companyIds[2],
        title: 'UX/UI Designer Praktikant',
        description: 'Skapa användarvänliga och visuellt tilltalande digitala upplevelser. Arbeta med kundprojekt och lär dig hela designprocessen från idé till implementering.',
        requirements: 'Studerar grafisk design, interaction design eller liknande. Portfolio som visar designkunskaper.',
        location: 'Malmö',
        duration_weeks: 14,
        start_date: '2025-08-18',
        end_date: '2025-11-21',
        application_deadline: '2025-08-01',
        compensation: 10000,
        remote_allowed: 1,
        field_of_study: 'Design',
        required_skills: JSON.stringify(['Figma', 'Adobe Creative Suite', 'UX Research']),
        preferred_skills: JSON.stringify(['Prototyping', 'User Testing', 'HTML/CSS']),
        spots_available: 2
      },
      {
        company_id: companyIds[2],
        title: 'Digital Marknadsföring Praktikant',
        description: 'Lär dig digital marknadsföring, social media-strategier och innehållsskapande. Perfekt för dig som vill förstå hur man bygger varumärken online.',
        requirements: 'Studerar marknadsföring, kommunikation eller liknande. Starkt intresse för digitala medier.',
        location: 'Malmö',
        duration_weeks: 10,
        start_date: '2025-09-01',
        end_date: '2025-11-07',
        application_deadline: '2025-08-15',
        compensation: 9000,
        remote_allowed: 1,
        field_of_study: 'Marknadsföring',
        required_skills: JSON.stringify(['Social Media', 'Innehållsskapande']),
        preferred_skills: JSON.stringify(['Google Analytics', 'SEO', 'Photoshop']),
        spots_available: 1
      }
    ];

    // Insert internships
    for (const internship of internships) {
      await runQuery(`
        INSERT INTO internships (
          company_id, title, description, requirements, location,
          duration_weeks, start_date, end_date, application_deadline,
          compensation, remote_allowed, field_of_study, required_skills,
          preferred_skills, spots_available
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        internship.company_id, internship.title, internship.description,
        internship.requirements, internship.location, internship.duration_weeks,
        internship.start_date, internship.end_date, internship.application_deadline,
        internship.compensation, internship.remote_allowed, internship.field_of_study,
        internship.required_skills, internship.preferred_skills, internship.spots_available
      ]);
      console.log(`✅ Created internship: ${internship.title}`);
    }

    console.log('🎉 Internship data seeding completed successfully!');
    console.log(`📊 Created ${companies.length} companies and ${internships.length} internships`);

  } catch (error) {
    console.error('❌ Error seeding internship data:', error);
  }
}

// Run the seeding
seedInternshipData();

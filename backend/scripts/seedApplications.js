import { initializeDatabase, runQuery } from '../database/init.js';

async function seedApplications() {
  try {
    await initializeDatabase();
    console.log('🌱 Seeding applications...');

    const testApplications = [
      {
        internship_id: 1,
        student_name: 'Anna Andersson',
        student_email: 'anna.andersson@student.se',
        student_phone: '070-123-4567',
        cover_letter: 'Jag är mycket intresserad av denna praktikplats eftersom jag vill utveckla mina färdigheter inom frontend-utveckling.',
        resume_url: 'https://example.com/anna-cv.pdf',
        additional_info: JSON.stringify({
          education: {
            school: 'KTH Royal Institute of Technology',
            program: 'Civilingenjör Datateknik',
            year: '3',
            expectedGraduation: '2026-06-15'
          },
          experience: {
            skills: 'React, JavaScript, HTML, CSS, Node.js',
            languages: 'Svenska (modersmål), Engelska (flyt)'
          }
        }),
        status: 'pending'
      },
      {
        internship_id: 1,
        student_name: 'Erik Eriksson',
        student_email: 'erik.eriksson@student.se',
        student_phone: '070-234-5678',
        cover_letter: 'Som student inom datavetenskap ser jag fram emot att bidra till era projekt.',
        resume_url: 'https://example.com/erik-cv.pdf',
        additional_info: JSON.stringify({
          education: {
            school: 'Stockholms Universitet',
            program: 'Kandidat Datavetenskap',
            year: '2',
            expectedGraduation: '2025-12-20'
          },
          experience: {
            skills: 'Python, Java, SQL, Git',
            languages: 'Svenska (modersmål), Engelska (bra)'
          }
        }),
        status: 'accepted'
      },
      {
        internship_id: 2,
        student_name: 'Sara Svensson',
        student_email: 'sara.svensson@student.se',
        student_phone: '070-345-6789',
        cover_letter: 'Jag är passionerad för backend-utveckling och vill lära mig mer om skalbar systemarkitektur.',
        resume_url: 'https://example.com/sara-cv.pdf',
        additional_info: JSON.stringify({
          education: {
            school: 'Chalmers tekniska högskola',
            program: 'Civilingenjör Software Engineering',
            year: '4',
            expectedGraduation: '2025-06-15'
          },
          experience: {
            skills: 'Java, Spring Boot, Docker, Kubernetes',
            languages: 'Svenska (modersmål), Engelska (flyt), Tyska (grundläggande)'
          }
        }),
        status: 'reviewing'
      },
      {
        internship_id: 3,
        student_name: 'Marcus Nilsson',
        student_email: 'marcus.nilsson@student.se',
        student_phone: '070-456-7890',
        cover_letter: 'Som UX/UI-designer vill jag bidra till att skapa användarcentrerade lösningar.',
        resume_url: 'https://example.com/marcus-cv.pdf',
        additional_info: JSON.stringify({
          education: {
            school: 'Malmö universitet',
            program: 'Kandidat Interaktionsdesign',
            year: '3',
            expectedGraduation: '2025-12-20'
          },
          experience: {
            skills: 'Figma, Adobe XD, Sketch, HTML, CSS',
            languages: 'Svenska (modersmål), Engelska (flyt)'
          }
        }),
        status: 'pending'
      },
      {
        internship_id: 4,
        student_name: 'Lisa Larsson',
        student_email: 'lisa.larsson@student.se',
        student_phone: '070-567-8901',
        cover_letter: 'Jag är mycket intresserad av DevOps och molnteknologier.',
        resume_url: 'https://example.com/lisa-cv.pdf',
        additional_info: JSON.stringify({
          education: {
            school: 'Linköpings universitet',
            program: 'Civilingenjör Informationsteknologi',
            year: '4',
            expectedGraduation: '2025-06-15'
          },
          experience: {
            skills: 'AWS, Azure, Terraform, Jenkins, Docker',
            languages: 'Svenska (modersmål), Engelska (flyt), Franska (grundläggande)'
          }
        }),
        status: 'rejected'
      },
      {
        internship_id: 5,
        student_name: 'Johan Johansson',
        student_email: 'johan.johansson@student.se',
        student_phone: '070-678-9012',
        cover_letter: 'Som dataanalytiker vill jag arbeta med AI och maskininlärning.',
        resume_url: 'https://example.com/johan-cv.pdf',
        additional_info: JSON.stringify({
          education: {
            school: 'Uppsala universitet',
            program: 'Kandidat Statistik och dataanalys',
            year: '3',
            expectedGraduation: '2025-12-20'
          },
          experience: {
            skills: 'Python, R, SQL, TensorFlow, Pandas',
            languages: 'Svenska (modersmål), Engelska (flyt)'
          }
        }),
        status: 'accepted'
      }
    ];

    // Add applications with different dates for monthly stats
    const dates = [
      '2025-07-01',
      '2025-07-15',
      '2025-08-01',
      '2025-08-05',
      '2025-08-08',
      '2025-08-10'
    ];

    for (let i = 0; i < testApplications.length; i++) {
      const app = testApplications[i];
      const appliedAt = dates[i] || '2025-08-11';
      
      await runQuery(`
        INSERT INTO applications (
          internship_id, student_name, student_email, student_phone,
          cover_letter, resume_url, additional_info, status, applied_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        app.internship_id, app.student_name, app.student_email, app.student_phone,
        app.cover_letter, app.resume_url, app.additional_info, app.status, appliedAt
      ]);
      
      console.log(`✅ Added application from ${app.student_name}`);
    }

    console.log('🎉 Application seeding completed successfully!');
    console.log(`📊 Added ${testApplications.length} test applications`);
    
  } catch (error) {
    console.error('❌ Error seeding applications:', error);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedApplications().then(() => process.exit(0));
}

export { seedApplications };

/**
 * Testsvit för CV PDF Export Funktionalitet
 * 
 * Detta är en omfattande testning av PDF-exportfunktionaliteten
 * för CV-generatorn med fokus på svenska tecken och hög kvalitet.
 */

import { exportCVToHighQualityPDF } from './pdfExporter';

/**
 * Test-data för CV med svenska tecken
 */
const testCVData = {
  personalInfo: {
    firstName: 'Åsa',
    lastName: 'Öberg',
    email: 'asa.oberg@exempel.se',
    phone: '070-123 45 67',
    address: 'Götgatan 12, 118 46 Stockholm',
    summary: 'Erfaren mjukvaruutvecklare med specialisering inom webbutveckling och användargränssnitt. Har arbetat med React, JavaScript och moderna utvecklingsverktyg i över 5 år.',
    profilePicture: null,
  },
  workExperience: [
    {
      id: 1,
      company: 'Innovativ Teknik AB',
      position: 'Senior Mjukvaruutvecklare',
      startDate: '2020-03-01',
      endDate: '',
      current: true,
      description: 'Utvecklar moderna webbapplikationer med React och TypeScript. Ansvarig för användarupplevelse och prestationsoptimering.',
    },
    {
      id: 2,
      company: 'Startup Lösningar HB',
      position: 'Frontend Utvecklare',
      startDate: '2018-06-01',
      endDate: '2020-02-28',
      current: false,
      description: 'Skapade responsiva användargränssnitt och implementerade nya funktioner. Arbetade nära designers för att säkerställa pixelperfekt implementation.',
    }
  ],
  education: [
    {
      id: 1,
      institution: 'Kungliga Tekniska Högskolan (KTH)',
      degree: 'Civilingenjör i Datateknik',
      startDate: '2014-09-01',
      endDate: '2018-06-01',
      description: 'Specialisering inom mjukvaruteknik och algoritmer. Examensarbete om webbprestanda och användargränssnitt.',
    }
  ],
  skills: [
    { id: 1, name: 'JavaScript', level: 90 },
    { id: 2, name: 'React', level: 85 },
    { id: 3, name: 'TypeScript', level: 80 },
    { id: 4, name: 'Node.js', level: 75 },
    { id: 5, name: 'CSS/Sass', level: 85 },
    { id: 6, name: 'Git', level: 90 },
  ],
  languages: [
    { id: 1, name: 'Svenska', level: 'Modersmål' },
    { id: 2, name: 'Engelska', level: 'Flyt' },
    { id: 3, name: 'Tyska', level: 'Grundläggande' },
  ]
};

/**
 * Skapar ett test-HTML element för CV:t
 */
export const createTestCVElement = () => {
  const testDiv = document.createElement('div');
  testDiv.setAttribute('data-pdf-target', 'true');
  testDiv.style.cssText = `
    width: 800px;
    padding: 40px;
    background: white;
    font-family: 'Roboto', Arial, sans-serif;
    line-height: 1.6;
    color: #333;
  `;
  
  testDiv.innerHTML = `
    <div style="margin-bottom: 30px;">
      <h1 style="font-size: 28px; margin-bottom: 10px; color: #1976d2;">
        ${testCVData.personalInfo.firstName} ${testCVData.personalInfo.lastName}
      </h1>
      <div style="font-size: 14px; color: #666;">
        <p>${testCVData.personalInfo.email} | ${testCVData.personalInfo.phone}</p>
        <p>${testCVData.personalInfo.address}</p>
      </div>
    </div>
    
    <div style="margin-bottom: 30px;">
      <h2 style="font-size: 18px; color: #1976d2; border-bottom: 2px solid #1976d2; padding-bottom: 5px;">
        Profil
      </h2>
      <p>${testCVData.personalInfo.summary}</p>
    </div>
    
    <div style="margin-bottom: 30px;">
      <h2 style="font-size: 18px; color: #1976d2; border-bottom: 2px solid #1976d2; padding-bottom: 5px;">
        Arbetslivserfarenhet
      </h2>
      ${testCVData.workExperience.map(exp => `
        <div style="margin-bottom: 20px;">
          <h3 style="font-size: 16px; margin-bottom: 5px;">${exp.position}</h3>
          <p style="font-weight: bold; color: #666; margin-bottom: 5px;">
            ${exp.company} | ${exp.startDate} - ${exp.current ? 'Pågående' : exp.endDate}
          </p>
          <p>${exp.description}</p>
        </div>
      `).join('')}
    </div>
    
    <div style="margin-bottom: 30px;">
      <h2 style="font-size: 18px; color: #1976d2; border-bottom: 2px solid #1976d2; padding-bottom: 5px;">
        Utbildning
      </h2>
      ${testCVData.education.map(edu => `
        <div style="margin-bottom: 20px;">
          <h3 style="font-size: 16px; margin-bottom: 5px;">${edu.degree}</h3>
          <p style="font-weight: bold; color: #666; margin-bottom: 5px;">
            ${edu.institution} | ${edu.startDate} - ${edu.endDate}
          </p>
          <p>${edu.description}</p>
        </div>
      `).join('')}
    </div>
    
    <div style="margin-bottom: 30px;">
      <h2 style="font-size: 18px; color: #1976d2; border-bottom: 2px solid #1976d2; padding-bottom: 5px;">
        Tekniska Färdigheter
      </h2>
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
        ${testCVData.skills.map(skill => `
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span>${skill.name}</span>
            <div style="width: 100px; height: 8px; background: #f0f0f0; border-radius: 4px; margin-left: 10px;">
              <div style="width: ${skill.level}%; height: 100%; background: #1976d2; border-radius: 4px;"></div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
    
    <div>
      <h2 style="font-size: 18px; color: #1976d2; border-bottom: 2px solid #1976d2; padding-bottom: 5px;">
        Språkkunskaper
      </h2>
      ${testCVData.languages.map(lang => `
        <p style="margin-bottom: 8px;">
          <strong>${lang.name}:</strong> ${lang.level}
        </p>
      `).join('')}
    </div>
  `;
  
  return testDiv;
};

/**
 * Testar PDF-export med komplett CV-data
 */
export const testFullCVPDFExport = async () => {
  try {
    console.log('🧪 Startar komplett CV PDF export test...');
    
    // Skapa test-element
    const testElement = createTestCVElement();
    
    // Lägg till temporärt i DOM (utanför vyport)
    testElement.style.position = 'absolute';
    testElement.style.left = '-9999px';
    testElement.style.top = '0';
    document.body.appendChild(testElement);
    
    // Exportera till PDF
    const fileName = `Test_CV_${testCVData.personalInfo.firstName}_${testCVData.personalInfo.lastName}`;
    
    console.log('📄 Exporterar CV till PDF...');
    const result = await exportCVToHighQualityPDF(testElement, fileName);
    
    // Ta bort test-element
    document.body.removeChild(testElement);
    
    console.log('✅ CV PDF export lyckades!');
    console.log('📁 Filnamn:', result.fileName);
    console.log('📊 Filstorlek:', result.fileSize || 'Okänd');
    
    return {
      success: true,
      fileName: result.fileName,
      message: 'CV PDF export test lyckades!',
      testData: testCVData
    };
    
  } catch (error) {
    console.error('❌ CV PDF export test misslyckades:', error);
    
    // Rensa upp om något gick fel
    const testElement = document.querySelector('[data-pdf-target="true"]');
    if (testElement && testElement.style.position === 'absolute') {
      document.body.removeChild(testElement);
    }
    
    return {
      success: false,
      error: error.message,
      message: 'CV PDF export test misslyckades!',
      testData: testCVData
    };
  }
};

/**
 * Kör alla PDF-tester
 */
export const runAllPDFTests = async () => {
  console.log('🚀 Startar alla PDF export tester...');
  
  const results = {
    libraryTest: false,
    basicPDFTest: false,
    fullCVTest: false,
    errors: []
  };
  
  try {
    // Test 1: Bibliotek laddning
    console.log('\n📚 Test 1: Kontrollerar PDF bibliotek...');
    const { testPDFLibraries, createTestPDF } = await import('./testPDFExport');
    results.libraryTest = testPDFLibraries();
    
    // Test 2: Grundläggande PDF skapande
    console.log('\n📝 Test 2: Skapar grundläggande test PDF...');
    const basicPDFResult = createTestPDF();
    results.basicPDFTest = !!basicPDFResult;
    
    // Test 3: Komplett CV export
    console.log('\n📋 Test 3: Testar komplett CV PDF export...');
    const fullTestResult = await testFullCVPDFExport();
    results.fullCVTest = fullTestResult.success;
    
    if (!fullTestResult.success) {
      results.errors.push(fullTestResult.error);
    }
    
  } catch (error) {
    console.error('❌ Fel under PDF tester:', error);
    results.errors.push(error.message);
  }
  
  // Sammanfattning
  console.log('\n📊 Test Sammanfattning:');
  console.log('  📚 Bibliotek test:', results.libraryTest ? '✅' : '❌');
  console.log('  📝 Grundläggande PDF:', results.basicPDFTest ? '✅' : '❌');
  console.log('  📋 Komplett CV export:', results.fullCVTest ? '✅' : '❌');
  
  if (results.errors.length > 0) {
    console.log('\n❌ Fel som upptäcktes:');
    results.errors.forEach((error, index) => {
      console.log(`  ${index + 1}. ${error}`);
    });
  }
  
  const allTestsPassed = results.libraryTest && results.basicPDFTest && results.fullCVTest;
  console.log(`\n${allTestsPassed ? '🎉' : '⚠️'} Alla tester: ${allTestsPassed ? 'KLARADE' : 'MISSLYCKADES'}`);
  
  return results;
};

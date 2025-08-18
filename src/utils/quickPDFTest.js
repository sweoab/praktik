/**
 * Snabb test för att verifiera PDF Export
 */

import { exportCVToHighQualityPDF } from './robustPDFExporter';

/**
 * Skapar ett enkelt test-element för PDF export
 */
export const createSimpleTestElement = () => {
  const testDiv = document.createElement('div');
  testDiv.style.cssText = `
    width: 800px;
    padding: 40px;
    background: white;
    font-family: Arial, sans-serif;
    line-height: 1.6;
  `;
  
  testDiv.innerHTML = `
    <h1 style="color: #1976d2; margin-bottom: 20px;">Test CV - Åsa Öberg</h1>
    
    <div style="margin-bottom: 20px;">
      <strong>E-post:</strong> asa.oberg@exempel.se<br>
      <strong>Telefon:</strong> 070-123 45 67<br>
      <strong>Adress:</strong> Stockholm, Sverige
    </div>
    
    <h2 style="color: #1976d2; border-bottom: 2px solid #ccc; padding-bottom: 5px;">
      Profil
    </h2>
    <p>
      Erfaren mjukvaruutvecklare med passion för webbutveckling och användarupplevelse. 
      Har arbetat med moderna teknologier som React, JavaScript och TypeScript.
    </p>
    
    <h2 style="color: #1976d2; border-bottom: 2px solid #ccc; padding-bottom: 5px;">
      Arbetslivserfarenhet
    </h2>
    <div style="margin-bottom: 15px;">
      <h3>Senior Utvecklare - Tech AB (2020-Pågående)</h3>
      <p>Utvecklar webbapplikationer med React och Node.js. Ansvarig för teknisk arkitektur och kodkvalitet.</p>
    </div>
    
    <h2 style="color: #1976d2; border-bottom: 2px solid #ccc; padding-bottom: 5px;">
      Utbildning
    </h2>
    <div>
      <h3>Civilingenjör Datateknik - KTH (2015-2019)</h3>
      <p>Specialisering inom mjukvaruteknik och algoritmer.</p>
    </div>
    
    <h2 style="color: #1976d2; border-bottom: 2px solid #ccc; padding-bottom: 5px;">
      Språkkunskaper
    </h2>
    <p>
      <strong>Svenska:</strong> Modersmål<br>
      <strong>Engelska:</strong> Flyt<br>
      <strong>Tyska:</strong> Grundläggande
    </p>
  `;
  
  return testDiv;
};

/**
 * Kör en snabb PDF export test
 */
export const quickPDFTest = async () => {
  try {
    console.log('🚀 Startar snabb PDF test...');
    
    // Skapa test element
    const testElement = createSimpleTestElement();
    
    // Lägg till i DOM temporärt
    testElement.style.position = 'absolute';
    testElement.style.left = '-9999px';
    document.body.appendChild(testElement);
    
    // Vänta lite för CSS att ladda
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Exportera till PDF
    const result = await exportCVToHighQualityPDF(testElement, 'Snabb_Test_CV');
    
    // Rensa upp
    document.body.removeChild(testElement);
    
    console.log('✅ Snabb PDF test lyckades!');
    console.log('📁 Fil:', result.fileName);
    
    return {
      success: true,
      fileName: result.fileName,
      message: 'Snabb PDF test lyckades!'
    };
    
  } catch (error) {
    console.error('❌ Snabb PDF test misslyckades:', error);
    
    // Rensa upp vid fel
    const testElement = document.querySelector('[style*="position: absolute"][style*="left: -9999px"]');
    if (testElement && testElement.parentNode) {
      testElement.parentNode.removeChild(testElement);
    }
    
    return {
      success: false,
      error: error.message,
      message: `Snabb PDF test misslyckades: ${error.message}`
    };
  }
};

/**
 * Testar PDF export med olika innehållsstorlekar
 */
export const testPDFWithDifferentSizes = async () => {
  const tests = [
    { name: 'Liten', size: 'small' },
    { name: 'Medel', size: 'medium' },
    { name: 'Stor', size: 'large' }
  ];
  
  const results = [];
  
  for (const test of tests) {
    try {
      console.log(`📏 Testar ${test.name} storlek...`);
      
      const testElement = createSimpleTestElement();
      
      // Justera innehåll baserat på storlek
      if (test.size === 'large') {
        // Lägg till extra innehåll för stora tester
        testElement.innerHTML += `
          <h2 style="color: #1976d2; border-bottom: 2px solid #ccc; padding-bottom: 5px;">
            Projekt
          </h2>
          <div style="margin-bottom: 15px;">
            <h3>E-handelsplattform</h3>
            <p>Utvecklade en komplett e-handelsplattform med React, Node.js och MongoDB. Implementerade betalningsintegration, användarhantering och administratörspanel.</p>
          </div>
          <div style="margin-bottom: 15px;">
            <h3>Mobilapp för bokning</h3>
            <p>Skapade en React Native app för bokningssystem. Inkluderade realtidsuppdateringar, push-notiser och integration med extern kalender-API.</p>
          </div>
          <div style="margin-bottom: 15px;">
            <h3>AI-driven chattbot</h3>
            <p>Byggde en intelligent chattbot med Natural Language Processing för kundservice. Använde Python, TensorFlow och integrerade med företagets CRM-system.</p>
          </div>
        `;
      }
      
      testElement.style.position = 'absolute';
      testElement.style.left = '-9999px';
      document.body.appendChild(testElement);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const result = await exportCVToHighQualityPDF(testElement, `Test_${test.name}_CV`);
      
      document.body.removeChild(testElement);
      
      results.push({
        size: test.name,
        success: true,
        fileName: result.fileName
      });
      
      console.log(`✅ ${test.name} test lyckades: ${result.fileName}`);
      
    } catch (error) {
      console.error(`❌ ${test.name} test misslyckades:`, error);
      results.push({
        size: test.name,
        success: false,
        error: error.message
      });
    }
  }
  
  console.log('📊 Storlekstest sammanfattning:');
  results.forEach(result => {
    console.log(`  ${result.size}: ${result.success ? '✅' : '❌'} ${result.fileName || result.error}`);
  });
  
  return results;
};

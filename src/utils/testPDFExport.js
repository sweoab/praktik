// Test för PDF export funktionalitet
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Testar att PDF-biblioteken fungerar korrekt
 */
export const testPDFLibraries = () => {
  try {
    // Testa jsPDF
    const pdf = new jsPDF();
    pdf.text('Test PDF med svenska tecken: åäö ÅÄÖ', 10, 10);
    
    // Testa html2canvas
    const testElement = document.createElement('div');
    testElement.innerHTML = '<p>Test element med svenska tecken: åäö ÅÄÖ</p>';
    testElement.style.position = 'absolute';
    testElement.style.left = '-9999px';
    document.body.appendChild(testElement);
    
    html2canvas(testElement).then(() => {
      document.body.removeChild(testElement);
      console.log('✅ PDF bibliotek fungerar korrekt');
    }).catch(error => {
      document.body.removeChild(testElement);
      console.error('❌ html2canvas fel:', error);
    });
    
    console.log('✅ jsPDF bibliotek laddat korrekt');
    return true;
    
  } catch (error) {
    console.error('❌ PDF bibliotek fel:', error);
    return false;
  }
};

/**
 * Skapar ett enkelt test-PDF för att verifiera export
 */
export const createTestPDF = () => {
  try {
    const pdf = new jsPDF();
    
    // Lägg till text med svenska tecken
    pdf.setFontSize(16);
    pdf.text('Test CV för Svenska Tecken', 20, 30);
    
    pdf.setFontSize(12);
    pdf.text('Namn: Åsa Öberg', 20, 50);
    pdf.text('E-post: asa.oberg@exempel.se', 20, 70);
    pdf.text('Telefon: 070-123 45 67', 20, 90);
    
    pdf.text('Arbetslivserfarenhet:', 20, 120);
    pdf.text('• Mjukvaruutvecklare på Företaget AB (2020-2025)', 25, 140);
    pdf.text('• Praktikant på Startup XYZ (2019-2020)', 25, 160);
    
    pdf.text('Utbildning:', 20, 190);
    pdf.text('• Civilingenjör i Datateknik - KTH (2015-2019)', 25, 210);
    
    // Spara PDF
    const fileName = 'Test_CV_Svenska_Tecken.pdf';
    pdf.save(fileName);
    
    console.log(`✅ Test PDF skapad: ${fileName}`);
    return fileName;
    
  } catch (error) {
    console.error('❌ Kunde inte skapa test PDF:', error);
    return null;
  }
};

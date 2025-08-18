import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Robust PDF Exporter med omfattande felhantering
 */
export class RobustPDFExporter {
  constructor() {
    this.isInitialized = false;
    this.isExporting = false;
    this.defaultOptions = {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      logging: false,
      width: 210 * 3.78,
      height: 297 * 3.78,
      windowWidth: 1200,
      windowHeight: 800,
      timeout: 30000, // 30 sekunder timeout
    };
  }

  /**
   * Kontrollerar om PDF export är möjlig
   */
  async validateEnvironment() {
    // Kontrollera webbläsarstöd
    const checks = {
      canvas: !!document.createElement('canvas').getContext,
      blob: !!window.Blob,
      url: !!window.URL,
      downloadAttribute: 'download' in document.createElement('a'),
      fileReader: !!window.FileReader,
    };

    const failedChecks = Object.entries(checks)
      .filter(([key, value]) => !value)
      .map(([key]) => key);

    if (failedChecks.length > 0) {
      throw new Error(`Webbläsaren saknar stöd för: ${failedChecks.join(', ')}`);
    }

    // Kontrollera bibliotek
    try {
      const testPDF = new jsPDF();
      testPDF.text('Test', 10, 10);
      console.log('✅ jsPDF fungerar');
    } catch (error) {
      throw new Error(`jsPDF fel: ${error.message}`);
    }

    try {
      const testCanvas = document.createElement('canvas');
      const ctx = testCanvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context inte tillgänglig');
      console.log('✅ Canvas fungerar');
    } catch (error) {
      throw new Error(`Canvas fel: ${error.message}`);
    }

    this.isInitialized = true;
    return true;
  }

  /**
   * Förbereder element för PDF export
   */
  prepareElementForPDF(element) {
    if (!element) {
      throw new Error('Inget element att exportera');
    }

    // Klona elementet för att inte påverka originalet
    const clone = element.cloneNode(true);
    clone.style.cssText = `
      position: absolute;
      left: -9999px;
      top: 0;
      width: 800px;
      background: white;
      font-family: 'Roboto', 'Arial', sans-serif;
      font-size: 14px;
      line-height: 1.5;
      color: #333;
      padding: 40px;
      box-sizing: border-box;
    `;

    // Lägg till i DOM temporärt
    document.body.appendChild(clone);
    
    // Vänta på att alla stilar ska appliceras
    return new Promise(resolve => {
      setTimeout(() => resolve(clone), 100);
    });
  }

  /**
   * Skapar PDF med timeout och felhantering
   */
  async createPDFWithTimeout(element, fileName, timeoutMs = 30000) {
    return new Promise(async (resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error('PDF export timeout - försöket tog för lång tid'));
      }, timeoutMs);

      try {
        const result = await this.performPDFExport(element, fileName);
        clearTimeout(timeoutId);
        resolve(result);
      } catch (error) {
        clearTimeout(timeoutId);
        reject(error);
      }
    });
  }

  /**
   * Utför faktisk PDF export
   */
  async performPDFExport(element, fileName) {
    try {
      console.log('📸 Skapar canvas från HTML...');
      
      // Förberedda element
      const preparedElement = await this.prepareElementForPDF(element);
      
      // Skapa canvas med förbättrade inställningar
      const canvas = await html2canvas(preparedElement, {
        ...this.defaultOptions,
        onclone: (clonedDoc) => {
          // Säkerställ att alla stilar är tillgängliga
          const clonedBody = clonedDoc.body;
          clonedBody.style.webkitPrintColorAdjust = 'exact';
          clonedBody.style.printColorAdjust = 'exact';
        }
      });

      console.log('📄 Skapar PDF dokument...');
      
      // Beräkna dimensioner
      const imgWidth = 210; // A4 bredd i mm
      const pageHeight = 295; // A4 höjd i mm minus marginaler
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Skapa PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      if (imgHeight <= pageHeight) {
        // Enkelsidigt dokument
        pdf.addImage(canvas, 'PNG', 0, 0, imgWidth, imgHeight);
      } else {
        // Flersidigt dokument
        let heightLeft = imgHeight;
        let position = 0;
        
        pdf.addImage(canvas, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(canvas, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
      }

      console.log('💾 Sparar PDF fil...');
      
      // Sanifiera filnamn
      const safeFileName = this.sanitizeFileName(fileName);
      const fullFileName = `${safeFileName}.pdf`;
      
      // Spara PDF
      pdf.save(fullFileName);
      
      // Rensa upp
      if (preparedElement && preparedElement.parentNode) {
        document.body.removeChild(preparedElement);
      }

      console.log('✅ PDF export klar!');
      
      return {
        success: true,
        fileName: fullFileName,
        message: 'PDF skapad framgångsrikt'
      };

    } catch (error) {
      console.error('❌ PDF export fel:', error);
      
      // Rensa upp vid fel
      const tempElement = document.querySelector('[style*="position: absolute"][style*="left: -9999px"]');
      if (tempElement) {
        document.body.removeChild(tempElement);
      }
      
      throw new Error(`PDF skapande misslyckades: ${error.message}`);
    }
  }

  /**
   * Huvudfunktion för PDF export
   */
  async exportToPDF(element, fileName = 'document') {
    if (this.isExporting) {
      throw new Error('PDF export pågår redan');
    }

    this.isExporting = true;

    try {
      // Validera miljö
      await this.validateEnvironment();
      
      // Exportera med timeout
      const result = await this.createPDFWithTimeout(element, fileName);
      
      return result;
      
    } catch (error) {
      console.error('PDF Export misslyckades:', error);
      
      // Ge användarvänliga felmeddelanden
      let userMessage = 'PDF export misslyckades. ';
      
      if (error.message.includes('timeout')) {
        userMessage += 'Försöket tog för lång tid. Försök med mindre innehåll.';
      } else if (error.message.includes('Canvas')) {
        userMessage += 'Webbläsaren stöder inte denna funktion.';
      } else if (error.message.includes('Webbläsaren saknar')) {
        userMessage += 'Din webbläsare är inte kompatibel. Försök med en nyare version.';
      } else if (error.message.includes('Inget element')) {
        userMessage += 'Inget innehåll att exportera.';
      } else {
        userMessage += 'Tekniskt fel inträffade. Försök igen.';
      }
      
      throw new Error(userMessage);
      
    } finally {
      this.isExporting = false;
    }
  }

  /**
   * Säkert filnamn
   */
  sanitizeFileName(fileName) {
    return fileName
      .replace(/[<>:"/\\|?*]/g, '')
      .replace(/\s+/g, '_')
      .replace(/[åÅ]/g, 'a')
      .replace(/[äÄ]/g, 'a')
      .replace(/[öÖ]/g, 'o')
      .replace(/_{2,}/g, '_')
      .replace(/^_|_$/g, '')
      .substring(0, 100) || 'document';
  }
}

// Singleton instans för enkel användning
const pdfExporter = new RobustPDFExporter();

/**
 * Enkel funktion för CV export
 */
export const exportCVToHighQualityPDF = async (element, fileName = 'CV') => {
  try {
    return await pdfExporter.exportToPDF(element, fileName);
  } catch (error) {
    console.error('CV PDF Export fel:', error);
    throw error;
  }
};

export default pdfExporter;

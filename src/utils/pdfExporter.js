import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * PDF Export utility för CV Generator
 * Konverterar CV preview till PDF och laddar ner den automatiskt
 */
export class PDFExporter {
  constructor() {
    this.defaultOptions = {
      scale: 2, // Högre skala för bättre kvalitet
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: 210 * 3.78, // A4 bredd i pixlar (210mm * 3.78 pixels/mm)
      height: 297 * 3.78, // A4 höjd i pixlar (297mm * 3.78 pixels/mm)
    };
  }

  /**
   * Exporterar CV som PDF
   * @param {HTMLElement} element - CV preview element att konvertera
   * @param {string} fileName - Filnamn för PDF:en
   * @param {Object} options - Ytterligare alternativ
   */
  async exportToPDF(element, fileName = 'CV', options = {}) {
    try {
      // Visa laddningsindikator
      this.showLoadingIndicator();

      // Kombinera standardalternativ med användardefinierade
      const canvasOptions = { ...this.defaultOptions, ...options };

      // Förbered elementet för PDF-export
      this.prepareElementForExport(element);

      // Skapa canvas från HTML-elementet
      // Förbättra kvaliteten för svenska tecken
      const canvas = await html2canvas(clonedElement, {
        scale: 2, // Högre upplösning
        useCORS: true,
        allowTaint: false,
        backgroundColor: null, // Behåll original bakgrund
        logging: false,
        width: clonedElement.scrollWidth,
        height: clonedElement.scrollHeight,
        windowWidth: 1200,
        windowHeight: 800,
        removeContainer: true,
        imageTimeout: 10000,
        onclone: (clonedDoc) => {
          // Säkerställ att alla element visas korrekt i klonen
          const clonedElements = clonedDoc.querySelectorAll('*');
          clonedElements.forEach(el => {
            const computed = window.getComputedStyle(el);
            if (computed.display === 'none') {
              el.style.display = 'block';
            }
            
            // Behåll färger och gradients för PDF
            if (el.style.background || el.style.backgroundColor) {
              el.style.webkitPrintColorAdjust = 'exact';
              el.style.printColorAdjust = 'exact';
            }
          });
        }
      });
      
      // Skapa PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      // Beräkna dimensioner
      const imgData = canvas.toDataURL('image/png', 1.0);
      const imgWidth = 210; // A4 bredd i mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Lägg till bilden i PDF:en
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');

      // Om innehållet är längre än en sida, hantera flera sidor
      if (imgHeight > 297) {
        this.handleMultiPagePDF(pdf, canvas, imgWidth);
      }

      // Ladda ner PDF:en
      const sanitizedFileName = this.sanitizeFileName(fileName);
      pdf.save(`${sanitizedFileName}.pdf`);

      // Rensa upp
      this.cleanupAfterExport(element);
      this.hideLoadingIndicator();

      return {
        success: true,
        message: 'PDF exported successfully',
        fileName: `${sanitizedFileName}.pdf`
      };

    } catch (error) {
      console.error('PDF export error:', error);
      this.hideLoadingIndicator();
      this.cleanupAfterExport(element);
      
      throw new Error(`PDF export failed: ${error.message}`);
    }
  }

  /**
   * Hanterar flerasidiga PDF:er
   */
  handleMultiPagePDF(pdf, canvas, imgWidth) {
    const pageHeight = 297; // A4 höjd i mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // Lägg till ytterligare sidor om nödvändigt
    while (heightLeft >= pageHeight) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
  }

  /**
   * Förbereder element för export genom att optimera styling
   */
  prepareElementForExport(element) {
    // Lägg till en klass för PDF-export styling
    element.classList.add('pdf-export-mode');
    
    // Säkerställ att alla bilder är laddade
    const images = element.querySelectorAll('img');
    images.forEach(img => {
      if (!img.complete) {
        img.addEventListener('load', () => {
          // Bilden är nu laddad
        });
      }
    });

    // Optimera för utskrift
    const style = document.createElement('style');
    style.textContent = `
      .pdf-export-mode {
        font-family: 'Roboto', 'Segoe UI', 'Arial', sans-serif !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        box-shadow: none !important;
        font-size: 14px !important;
        line-height: 1.5 !important;
      }
      
      .pdf-export-mode * {
        box-shadow: none !important;
        border-radius: 4px !important;
        text-rendering: optimizeLegibility !important;
        -webkit-font-smoothing: antialiased !important;
      }
      
      .pdf-export-mode .MuiPaper-root {
        box-shadow: none !important;
        border: 1px solid #e0e0e0 !important;
      }
      
      .pdf-export-mode .MuiTypography-h4 {
        font-size: 24px !important;
        font-weight: 700 !important;
        margin-bottom: 8px !important;
      }
      
      .pdf-export-mode .MuiTypography-h6 {
        font-size: 18px !important;
        font-weight: 600 !important;
        margin-bottom: 12px !important;
      }
      
      .pdf-export-mode .MuiTypography-subtitle1 {
        font-size: 16px !important;
        font-weight: 500 !important;
        margin-bottom: 4px !important;
      }
      
      .pdf-export-mode .MuiTypography-body1 {
        font-size: 14px !important;
        line-height: 1.6 !important;
        margin-bottom: 8px !important;
      }
      
      .pdf-export-mode .MuiTypography-body2 {
        font-size: 12px !important;
        line-height: 1.5 !important;
      }
      
      .pdf-export-mode .MuiLinearProgress-root {
        height: 6px !important;
      }
      
      .pdf-export-mode .MuiChip-root {
        font-size: 11px !important;
        height: 20px !important;
      }
      
      /* Säkerställ att svenska tecken visas korrekt */
      .pdf-export-mode {
        font-feature-settings: 'liga' 1, 'kern' 1;
        text-rendering: optimizeLegibility;
      }
      
      /* Förbättra spacing för utskrift */
      .pdf-export-mode .MuiBox-root {
        page-break-inside: avoid;
      }
      
      .pdf-export-mode .section-break {
        page-break-before: auto;
        margin-top: 20px !important;
      }
      
      /* Behåll gradient bakgrunder för PDF */
      .pdf-export-mode [style*="gradient"] {
        background: inherit !important;
      }
      
      /* Förbättra kontrast för mörka teman */
      .pdf-export-mode [style*="#212121"] {
        color: white !important;
      }
      
      .pdf-export-mode [style*="#ffffff"] {
        color: inherit !important;
      }
    `;
    
    document.head.appendChild(style);
    element.pdfExportStyle = style;

    // Vänta lite för att CSS ska appliceras
    return new Promise(resolve => setTimeout(resolve, 100));
  }

  /**
   * Rensa upp efter export
   */
  cleanupAfterExport(element) {
    element.classList.remove('pdf-export-mode');
    
    if (element.pdfExportStyle) {
      document.head.removeChild(element.pdfExportStyle);
      delete element.pdfExportStyle;
    }
  }

  /**
   * Sanerar filnamnet för att vara giltigt
   */
  sanitizeFileName(fileName) {
    // Hantera svenska tecken korrekt och ta bort ogiltiga tecken
    return fileName
      .replace(/[<>:"/\\|?*]/g, '') // Ta bort ogiltiga filnamntecken
      .replace(/\s+/g, '_') // Ersätt mellanslag med understreck
      .replace(/[åÅ]/g, 'a') // Ersätt å med a för kompatibilitet
      .replace(/[äÄ]/g, 'a') // Ersätt ä med a för kompatibilitet  
      .replace(/[öÖ]/g, 'o') // Ersätt ö med o för kompatibilitet
      .replace(/_{2,}/g, '_') // Ta bort upprepade understreck
      .replace(/^_|_$/g, '') // Ta bort understreck i början/slutet
      .substring(0, 100); // Begränsa längden
  }

  /**
   * Visar laddningsindikator
   */
  showLoadingIndicator() {
    // Skapa en enkel loading overlay
    const overlay = document.createElement('div');
    overlay.id = 'pdf-export-loading';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      font-family: Arial, sans-serif;
      font-size: 18px;
    `;
    
    overlay.innerHTML = `
      <div style="text-align: center;">
        <div style="border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 40px; height: 40px; animation: spin 2s linear infinite; margin: 0 auto 20px;"></div>
        <div>Genererar PDF...</div>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;
    
    document.body.appendChild(overlay);
  }

  /**
   * Döljer laddningsindikator
   */
  hideLoadingIndicator() {
    const overlay = document.getElementById('pdf-export-loading');
    if (overlay) {
      document.body.removeChild(overlay);
    }
  }

  /**
   * Validerar att element är giltigt för export
   */
  validateElement(element) {
    if (!element) {
      throw new Error('No element provided for PDF export');
    }
    
    if (!element.offsetHeight || !element.offsetWidth) {
      throw new Error('Element has no visible dimensions');
    }
    
    return true;
  }

  /**
   * Exporterar med förbättrad kvalitet för professionella CV:n
   */
  async exportHighQualityPDF(element, fileName = 'CV') {
    this.validateElement(element);
    
    const highQualityOptions = {
      scale: 3, // Högre skala för ännu bättre kvalitet
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: 210 * 4.5, // Högre upplösning
      height: 297 * 4.5,
      dpi: 300, // Hög DPI för skärp
    };

    return this.exportToPDF(element, fileName, highQualityOptions);
  }
}

// Singleton instance för enkel användning
export const pdfExporter = new PDFExporter();

// Convenience function för enkel användning
export const exportCVToPDF = async (element, fileName = 'CV') => {
  return pdfExporter.exportToPDF(element, fileName);
};

export const exportCVToHighQualityPDF = async (element, fileName = 'CV') => {
  return pdfExporter.exportHighQualityPDF(element, fileName);
};

export default PDFExporter;

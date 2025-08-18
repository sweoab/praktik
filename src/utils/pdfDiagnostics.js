/**
 * PDF Export Diagnostik
 * Hjälper att identifiera och lösa PDF export problem
 */

export class PDFDiagnostics {
  static async runDiagnostics() {
    const results = {
      timestamp: new Date().toISOString(),
      browser: this.getBrowserInfo(),
      features: this.checkFeatureSupport(),
      libraries: await this.checkLibraries(),
      performance: await this.checkPerformance(),
      recommendations: []
    };

    // Generera rekommendationer baserat på resultaten
    this.generateRecommendations(results);

    return results;
  }

  static getBrowserInfo() {
    const ua = navigator.userAgent;
    const browser = {
      userAgent: ua,
      platform: navigator.platform,
      language: navigator.language,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      hardwareConcurrency: navigator.hardwareConcurrency || 'unknown'
    };

    // Identifiera webbläsare
    if (ua.includes('Chrome')) browser.name = 'Chrome';
    else if (ua.includes('Firefox')) browser.name = 'Firefox';
    else if (ua.includes('Safari')) browser.name = 'Safari';
    else if (ua.includes('Edge')) browser.name = 'Edge';
    else browser.name = 'Unknown';

    return browser;
  }

  static checkFeatureSupport() {
    return {
      canvas: !!document.createElement('canvas').getContext,
      webgl: !!document.createElement('canvas').getContext('webgl'),
      blob: !!window.Blob,
      url: !!window.URL,
      downloadAttribute: 'download' in document.createElement('a'),
      fileReader: !!window.FileReader,
      localStorage: !!window.localStorage,
      sessionStorage: !!window.sessionStorage,
      workers: !!window.Worker,
      promises: !!window.Promise,
      fetch: !!window.fetch
    };
  }

  static async checkLibraries() {
    const results = {
      jsPDF: false,
      html2canvas: false,
      errors: []
    };

    try {
      const jsPDF = (await import('jspdf')).default;
      const testPDF = new jsPDF();
      testPDF.text('Test', 10, 10);
      results.jsPDF = true;
    } catch (error) {
      results.errors.push(`jsPDF: ${error.message}`);
    }

    try {
      const html2canvas = (await import('html2canvas')).default;
      const testDiv = document.createElement('div');
      testDiv.style.width = '100px';
      testDiv.style.height = '100px';
      testDiv.style.background = 'red';
      testDiv.style.position = 'absolute';
      testDiv.style.left = '-9999px';
      document.body.appendChild(testDiv);

      await html2canvas(testDiv, { width: 100, height: 100 });
      document.body.removeChild(testDiv);
      results.html2canvas = true;
    } catch (error) {
      results.errors.push(`html2canvas: ${error.message}`);
    }

    return results;
  }

  static async checkPerformance() {
    const start = performance.now();
    
    // Simulera en liten HTML till canvas operation
    const testDiv = document.createElement('div');
    testDiv.innerHTML = '<p>Performance test</p>';
    testDiv.style.width = '200px';
    testDiv.style.height = '100px';
    testDiv.style.position = 'absolute';
    testDiv.style.left = '-9999px';
    document.body.appendChild(testDiv);

    let canvasTime = 0;
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvasStart = performance.now();
      await html2canvas(testDiv, { width: 200, height: 100 });
      canvasTime = performance.now() - canvasStart;
    } catch (error) {
      canvasTime = -1;
    }

    document.body.removeChild(testDiv);

    const totalTime = performance.now() - start;

    return {
      totalTime: Math.round(totalTime),
      canvasTime: Math.round(canvasTime),
      memoryUsage: performance.memory ? {
        used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
      } : null
    };
  }

  static generateRecommendations(results) {
    const recs = results.recommendations;

    // Webbläsarrekommendationer
    if (results.browser.name === 'Safari') {
      recs.push('Safari kan ha begränsningar med PDF export. Försök med Chrome eller Firefox.');
    } else if (results.browser.name === 'Unknown') {
      recs.push('Okänd webbläsare. Använd Chrome, Firefox eller Edge för bästa kompatibilitet.');
    }

    // Funktionsstöd
    if (!results.features.canvas) {
      recs.push('KRITISKT: Canvas stöds inte. PDF export fungerar inte.');
    }
    if (!results.features.blob) {
      recs.push('KRITISKT: Blob API stöds inte. Filnedladdning fungerar inte.');
    }
    if (!results.features.downloadAttribute) {
      recs.push('Nedladdningsattribut stöds inte. Filer kanske inte laddas ner automatiskt.');
    }

    // Biblioteksproblem
    if (results.libraries.errors.length > 0) {
      recs.push('Biblioteksproblem upptäckta. Ladda om sidan och försök igen.');
    }

    // Prestandaproblem
    if (results.performance.canvasTime > 5000) {
      recs.push('Långsam rendering upptäckt. Minska innehållet i CV:t.');
    }

    // Minnesproblem
    if (results.performance.memoryUsage && 
        results.performance.memoryUsage.used > results.performance.memoryUsage.limit * 0.8) {
      recs.push('Högt minnesförbruk. Stäng andra flikar och försök igen.');
    }

    // Internetanslutning
    if (!results.browser.onLine) {
      recs.push('Ingen internetanslutning. Kontrollera nätverket.');
    }

    // Allmänna rekommendationer
    if (recs.length === 0) {
      recs.push('Systemet verkar fungera korrekt. Om PDF export fortfarande misslyckas, försök ladda om sidan.');
    }
  }

  static createDiagnosticsReport(results) {
    const report = [
      '=== PDF Export Diagnostik ===',
      `Tid: ${new Date(results.timestamp).toLocaleString('sv-SE')}`,
      '',
      '--- Webbläsarinformation ---',
      `Webbläsare: ${results.browser.name}`,
      `Plattform: ${results.browser.platform}`,
      `Språk: ${results.browser.language}`,
      `Online: ${results.browser.onLine ? 'Ja' : 'Nej'}`,
      '',
      '--- Funktionsstöd ---',
      `Canvas: ${results.features.canvas ? '✅' : '❌'}`,
      `Blob API: ${results.features.blob ? '✅' : '❌'}`,
      `Nedladdning: ${results.features.downloadAttribute ? '✅' : '❌'}`,
      `File Reader: ${results.features.fileReader ? '✅' : '❌'}`,
      '',
      '--- Bibliotek ---',
      `jsPDF: ${results.libraries.jsPDF ? '✅' : '❌'}`,
      `html2canvas: ${results.libraries.html2canvas ? '✅' : '❌'}`,
      ...results.libraries.errors.map(err => `Fel: ${err}`),
      '',
      '--- Prestanda ---',
      `Total tid: ${results.performance.totalTime}ms`,
      `Canvas rendering: ${results.performance.canvasTime}ms`,
      ...(results.performance.memoryUsage ? [
        `Minne använt: ${results.performance.memoryUsage.used}MB`,
        `Minnesgräns: ${results.performance.memoryUsage.limit}MB`
      ] : []),
      '',
      '--- Rekommendationer ---',
      ...results.recommendations.map(rec => `• ${rec}`),
      '',
      '=== Slut på rapport ==='
    ];

    return report.join('\n');
  }
}

/**
 * Snabb diagnostikfunktion för användning i CV Generator
 */
export const runQuickPDFDiagnostics = async () => {
  try {
    console.log('🔍 Kör PDF diagnostik...');
    const results = await PDFDiagnostics.runDiagnostics();
    const report = PDFDiagnostics.createDiagnosticsReport(results);
    
    console.log(report);
    
    // Returnera sammanfattning för UI
    return {
      success: results.features.canvas && results.features.blob && results.libraries.jsPDF && results.libraries.html2canvas,
      criticalIssues: results.recommendations.filter(r => r.includes('KRITISKT')).length,
      recommendations: results.recommendations,
      summary: results.recommendations.length === 0 ? 
        'Systemet verkar fungera korrekt' : 
        `${results.recommendations.length} problem upptäckta`
    };
  } catch (error) {
    console.error('Diagnostik misslyckades:', error);
    return {
      success: false,
      criticalIssues: 1,
      recommendations: ['Diagnostik kunde inte köras korrekt'],
      summary: 'Diagnostik misslyckades'
    };
  }
};

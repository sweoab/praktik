import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Tabs,
  Tab,
  Paper,
  Divider,
  Alert,
  Fab,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from '@mui/material';
import {
  Save as SaveIcon,
  Print as PrintIcon,
  Download as DownloadIcon,
  Preview as PreviewIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import PageContainer from '../../components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import LanguageSwitcher from '../../components/shared/LanguageSwitcher';
import PersonalInfoForm from './components/PersonalInfoForm';
import WorkExperienceForm from './components/WorkExperienceForm';
import EducationForm from './components/EducationForm';
import SkillsForm from './components/SkillsForm';
import CVPreview from './components/CVPreview';
import TemplateSelector from './components/TemplateSelector';
import PDFExportDialog from '../../components/apps/cv-generator/PDFExportDialog';
import { exportCVToHighQualityPDF } from '../../utils/robustPDFExporter';
import { testPDFLibraries, createTestPDF } from '../../utils/testPDFExport';
import { runAllPDFTests } from '../../utils/testCVPDFExport';
import { runQuickPDFDiagnostics } from '../../utils/pdfDiagnostics';
import { quickPDFTest } from '../../utils/quickPDFTest';

// Initial CV data structure
const initialCVData = {
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    summary: '',
    profilePicture: null,
  },
  workExperience: [],
  education: [],
  skills: [],
  selectedTemplate: 'modern',
};

const CVGenerator = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState(0);
  const [cvData, setCvData] = useState(initialCVData);
  const [showPreview, setShowPreview] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [showPDFDialog, setShowPDFDialog] = useState(false);
  const [pdfExportStatus, setPdfExportStatus] = useState('');
  const [exportedFileName, setExportedFileName] = useState('');
  const cvPreviewRef = useRef(null);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('cvGeneratorData');
    if (savedData) {
      try {
        setCvData(JSON.parse(savedData));
      } catch (error) {
        console.error('Error loading saved CV data:', error);
      }
    }
  }, []);

  // Auto-save to localStorage whenever cvData changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem('cvGeneratorData', JSON.stringify(cvData));
      setSaveStatus(t('cvGenerator.draftSaved'));
      setTimeout(() => setSaveStatus(''), 3000);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [cvData, t]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const updateCVData = (section, data) => {
    setCvData(prev => ({
      ...prev,
      [section]: data,
    }));
  };

  const handleSave = () => {
    localStorage.setItem('cvGeneratorData', JSON.stringify(cvData));
    setSaveStatus(t('cvGenerator.cvSavedSuccess'));
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const handleExportPDF = async () => {
    if (!cvPreviewRef.current) {
      setSaveStatus(t('cvGenerator.errorNotFound'));
      setTimeout(() => setSaveStatus(''), 3000);
      return;
    }

    // Kontrollera att CV:t har nödvändig information
    if (!cvData.personalInfo.firstName || !cvData.personalInfo.lastName) {
      setSaveStatus(t('cvGenerator.fillNameFirst'));
      setTimeout(() => setSaveStatus(''), 3000);
      return;
    }

    // Öppna PDF dialog och starta export
    setShowPDFDialog(true);
    setIsExportingPDF(true);
    setPdfExportStatus('preparing');

    try {
      // Skapa filnamn baserat på användarens namn med svenska tecken
      const fullName = `${cvData.personalInfo.firstName} ${cvData.personalInfo.lastName}`;
      const fileName = `CV_${fullName}`
        .replace(/[<>:"/\\|?*]/g, '') // Ta bort ogiltiga filnamntecken
        .replace(/\s+/g, '_') // Ersätt mellanslag med understreck
        .replace(/[åÅ]/g, 'a') // Ersätt å med a för kompatibilitet
        .replace(/[äÄ]/g, 'a') // Ersätt ä med a för kompatibilitet  
        .replace(/[öÖ]/g, 'o') // Ersätt ö med o för kompatibilitet
        .replace(/_{2,}/g, '_') // Ta bort upprepade understreck
        .replace(/^_|_$/g, ''); // Ta bort understreck i början/slutet
      
      // Simulera förberedelse
      await new Promise(resolve => setTimeout(resolve, 500));
      setPdfExportStatus('converting');
      
      // Hitta preview-elementet
      const previewElement = cvPreviewRef.current.querySelector('[data-pdf-target]') || 
                            cvPreviewRef.current.querySelector('.MuiPaper-root') ||
                            cvPreviewRef.current.firstElementChild ||
                            cvPreviewRef.current;

      if (!previewElement) {
        throw new Error('Kunde inte hitta CV innehåll att exportera');
      }

      console.log('🚀 Startar PDF export för element:', previewElement);

      // Exportera till PDF med den robusta exportern
      const result = await exportCVToHighQualityPDF(previewElement, fileName);
      
      setPdfExportStatus('success');
      setExportedFileName(result.fileName);
      setSaveStatus(`✅ ${t('cvGenerator.pdfExported')}: ${result.fileName}`);
      
    } catch (error) {
      console.error('❌ PDF export misslyckades:', error);
      setPdfExportStatus('error');
      
      // Visa användarvänligt felmeddelande
      let errorMessage = `${t('cvGenerator.pdfExportFailed')}. `;
      
      if (error.message.includes('timeout') || error.message.includes('för lång tid')) {
        errorMessage += 'Försöket tog för lång tid. Försök igen med mindre innehåll.';
      } else if (error.message.includes('kompatibel') || error.message.includes('stöder inte')) {
        errorMessage += 'Din webbläsare stöder inte denna funktion. Försök med Chrome, Firefox eller Edge.';
      } else if (error.message.includes('innehåll')) {
        errorMessage += 'Inget CV innehåll hittades. Se till att CV:t är ifyllt.';
      } else if (error.message.includes('nätverk') || error.message.includes('anslutning')) {
        errorMessage += 'Nätverksproblem. Kontrollera din internetanslutning.';
      } else {
        errorMessage += `Tekniskt fel: ${error.message}`;
      }
      
      setSaveStatus(errorMessage);
    } finally {
      setIsExportingPDF(false);
      setTimeout(() => setSaveStatus(''), 8000);
    }
  };

  const handleClosePDFDialog = () => {
    setShowPDFDialog(false);
    setPdfExportStatus('');
    setExportedFileName('');
  };

  const handlePrint = () => {
    window.print();
  };

  const tabContent = [
    {
      label: t('Personal Information'),
      component: (
        <PersonalInfoForm
          data={cvData.personalInfo}
          onChange={(data) => updateCVData('personalInfo', data)}
        />
      ),
    },
    {
      label: t('Work Experience'),
      component: (
        <WorkExperienceForm
          data={cvData.workExperience}
          onChange={(data) => updateCVData('workExperience', data)}
        />
      ),
    },
    {
      label: t('Education'),
      component: (
        <EducationForm
          data={cvData.education}
          onChange={(data) => updateCVData('education', data)}
        />
      ),
    },
    {
      label: t('Skills'),
      component: (
        <SkillsForm
          data={cvData.skills}
          onChange={(data) => updateCVData('skills', data)}
        />
      ),
    },
    {
      label: t('Template Selector'),
      component: (
        <TemplateSelector
          selectedTemplate={cvData.selectedTemplate}
          onChange={(template) => updateCVData('selectedTemplate', template)}
        />
      ),
    },
  ];

  return (
    <PageContainer title={t('cvGenerator.title')} description={t('cvGenerator.description')}>
      <Box>
        {/* Header with actions */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            {t('cvGenerator.title')}
          </Typography>
          <Box display="flex" gap={1}>
            <LanguageSwitcher variant="menu" />
            <Button
              variant="outlined"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              size={isMobile ? 'small' : 'medium'}
            >
              {t('common.save')}
            </Button>
            <Button
              variant="outlined"
              startIcon={<PreviewIcon />}
              onClick={() => setShowPreview(!showPreview)}
              size={isMobile ? 'small' : 'medium'}
            >
              {showPreview ? t('common.edit') : t('common.preview')}
            </Button>
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              onClick={handlePrint}
              size={isMobile ? 'small' : 'medium'}
            >
              {t('common.print')}
            </Button>
            <Button
              variant="contained"
              startIcon={isExportingPDF ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />}
              onClick={handleExportPDF}
              disabled={isExportingPDF}
              size={isMobile ? 'small' : 'medium'}
            >
              {isExportingPDF ? t('common.exporting') : t('common.exportPDF')}
            </Button>
            {/* Debug Test Button */}
            <Button
              variant="outlined"
              color="secondary"
              onClick={async () => {
                console.log('🧪 Kör omfattande PDF export tester...');
                const results = await runAllPDFTests();
                
                if (results.fullCVTest) {
                  setSaveStatus(`✅ ${t('cvGenerator.allTestsPassed')}`);
                } else {
                  setSaveStatus(`⚠️ ${t('cvGenerator.someTestsFailed')}`);
                }
                setTimeout(() => setSaveStatus(''), 5000);
              }}
              size="small"
              sx={{ ml: 1 }}
            >
              Test All PDF
            </Button>
            {/* Diagnostik Button */}
            <Button
              variant="outlined"
              color="info"
              onClick={async () => {
                console.log('🔍 Kör PDF diagnostik...');
                const diagnostics = await runQuickPDFDiagnostics();
                
                if (diagnostics.success) {
                  setSaveStatus(`✅ ${t('cvGenerator.pdfSystemWorking')}: ${diagnostics.summary}`);
                } else {
                  setSaveStatus(`⚠️ ${t('cvGenerator.pdfProblems')}: ${diagnostics.summary}. Se konsolen för detaljer.`);
                }
                setTimeout(() => setSaveStatus(''), 8000);
              }}
              size="small"
              sx={{ ml: 1 }}
            >
              Diagnostik
            </Button>
            {/* Snabbtest Button */}
            <Button
              variant="outlined"
              color="success"
              onClick={async () => {
                console.log('⚡ Kör snabb PDF test...');
                const result = await quickPDFTest();
                
                if (result.success) {
                  setSaveStatus(`✅ ${t('cvGenerator.quickTestSuccess')}: ${result.fileName}`);
                } else {
                  setSaveStatus(`❌ ${t('cvGenerator.quickTestFailed')}: ${result.error}`);
                }
                setTimeout(() => setSaveStatus(''), 6000);
              }}
              size="small"
              sx={{ ml: 1 }}
            >
              Quick Test
            </Button>
          </Box>
        </Box>

        {/* Save status alert */}
        {saveStatus && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {saveStatus}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Form Section */}
          {!showPreview && (
            <Grid xs={12} lg={8}>
              <DashboardCard>
                <Box>
                  {/* Tabs */}
                  <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    variant={isMobile ? 'scrollable' : 'standard'}
                    scrollButtons="auto"
                    sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
                  >
                    {tabContent.map((tab, index) => (
                      <Tab key={index} label={tab.label} />
                    ))}
                  </Tabs>

                  {/* Tab Content */}
                  <Box>{tabContent[activeTab].component}</Box>
                </Box>
              </DashboardCard>
            </Grid>
          )}

          {/* Preview Section */}
          <Grid xs={12} lg={showPreview ? 12 : 4}>
            <DashboardCard>
              <Box>
                <Typography variant="h6" gutterBottom>
                  {t('common.preview')}
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box ref={cvPreviewRef}>
                  <CVPreview cvData={cvData} />
                </Box>
              </Box>
            </DashboardCard>
          </Grid>
        </Grid>

        {/* Floating Action Button for mobile */}
        {isMobile && !showPreview && (
          <Fab
            color="primary"
            aria-label="preview"
            sx={{ position: 'fixed', bottom: 16, right: 16 }}
            onClick={() => setShowPreview(true)}
          >
            <PreviewIcon />
          </Fab>
        )}

        {/* PDF Export Dialog */}
        <PDFExportDialog
          open={showPDFDialog}
          onClose={handleClosePDFDialog}
          isExporting={isExportingPDF}
          exportStatus={pdfExportStatus}
          fileName={exportedFileName}
        />
      </Box>
    </PageContainer>
  );
};

export default CVGenerator;

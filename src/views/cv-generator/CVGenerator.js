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
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        {/* Professional Header */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            mb: 3, 
            borderRadius: 2,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h4" component="h1" fontWeight={600} gutterBottom>
                {t('cvGenerator.title')}
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                Skapa ett professionellt CV på några minuter
              </Typography>
            </Box>
            
            {/* Clean Action Buttons */}
            <Box display="flex" gap={1.5} alignItems="center">
              <LanguageSwitcher variant="menu" />
              
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                size={isMobile ? 'small' : 'medium'}
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                  backdropFilter: 'blur(10px)'
                }}
              >
                {t('common.save')}
              </Button>
              
              <Button
                variant="contained"
                startIcon={<PreviewIcon />}
                onClick={() => setShowPreview(!showPreview)}
                size={isMobile ? 'small' : 'medium'}
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
                  backdropFilter: 'blur(10px)'
                }}
              >
                {showPreview ? t('common.edit') : t('common.preview')}
              </Button>
              
              <Button
                variant="contained"
                startIcon={isExportingPDF ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />}
                onClick={handleExportPDF}
                disabled={isExportingPDF}
                size={isMobile ? 'small' : 'medium'}
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.95)', 
                  color: 'primary.main',
                  '&:hover': { bgcolor: 'white' },
                  fontWeight: 600
                }}
              >
                {isExportingPDF ? t('common.exporting') : t('common.exportPDF')}
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Clean Status Alert */}
        {saveStatus && (
          <Alert 
            severity="success" 
            sx={{ 
              mb: 3, 
              borderRadius: 2,
              '& .MuiAlert-message': { fontWeight: 500 }
            }}
          >
            {saveStatus}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Modern Form Section */}
          {!showPreview && (
            <Grid xs={12} lg={8}>
              <Paper 
                elevation={0} 
                sx={{ 
                  borderRadius: 3, 
                  overflow: 'hidden',
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Box>
                  {/* Clean Tabs */}
                  <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
                    <Tabs
                      value={activeTab}
                      onChange={handleTabChange}
                      variant={isMobile ? 'scrollable' : 'standard'}
                      scrollButtons="auto"
                      sx={{ 
                        '& .MuiTab-root': {
                          fontWeight: 500,
                          textTransform: 'none',
                          fontSize: '0.95rem',
                          py: 2
                        },
                        '& .Mui-selected': {
                          color: 'primary.main',
                          fontWeight: 600
                        }
                      }}
                    >
                      {tabContent.map((tab, index) => (
                        <Tab key={index} label={tab.label} />
                      ))}
                    </Tabs>
                  </Box>

                  {/* Tab Content with padding */}
                  <Box sx={{ p: 4 }}>
                    {tabContent[activeTab].component}
                  </Box>
                </Box>
              </Paper>
            </Grid>
          )}

          {/* Clean Preview Section */}
          <Grid xs={12} lg={showPreview ? 12 : 4}>
            <Paper 
              elevation={0} 
              sx={{ 
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                overflow: 'hidden'
              }}
            >
              <Box>
                <Box 
                  sx={{ 
                    p: 3, 
                    bgcolor: 'grey.50', 
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Typography variant="h6" fontWeight={600} color="text.primary">
                    {t('common.preview')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Se hur ditt CV kommer att se ut
                  </Typography>
                </Box>
                
                <Box sx={{ p: 2 }} ref={cvPreviewRef}>
                  <CVPreview cvData={cvData} />
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Modern Floating Action Button */}
        {isMobile && !showPreview && (
          <Fab
            color="primary"
            aria-label="preview"
            sx={{ 
              position: 'fixed', 
              bottom: 24, 
              right: 24,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              '&:hover': {
                transform: 'scale(1.05)',
                transition: 'transform 0.2s ease-in-out'
              }
            }}
            onClick={() => setShowPreview(true)}
          >
            <PreviewIcon />
          </Fab>
        )}

        {/* Clean PDF Export Dialog */}
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

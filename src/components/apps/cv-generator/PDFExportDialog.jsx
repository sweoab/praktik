import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  LinearProgress,
  Alert,
  Chip,
} from '@mui/material';
import {
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';

const PDFExportDialog = ({ 
  open, 
  onClose, 
  isExporting, 
  exportStatus, 
  fileName 
}) => {
  const getStatusIcon = () => {
    if (exportStatus === 'success') return <SuccessIcon color="success" />;
    if (exportStatus === 'error') return <ErrorIcon color="error" />;
    return null;
  };

  const getStatusMessage = () => {
    switch (exportStatus) {
      case 'preparing':
        return 'Förbereder CV för export...';
      case 'converting':
        return 'Konverterar till PDF format...';
      case 'success':
        return `✅ PDF exporterad framgångsrikt! Filen "${fileName}" har laddats ner till din dator.`;
      case 'error':
        return 'PDF export misslyckades. Se felmeddelandet nedan för mer information.';
      default:
        return 'Startar PDF export...';
    }
  };

  const getProgressValue = () => {
    switch (exportStatus) {
      case 'preparing':
        return 25;
      case 'converting':
        return 75;
      case 'success':
        return 100;
      default:
        return 0;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={!isExporting ? onClose : undefined}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown={isExporting}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          {getStatusIcon()}
          <Typography variant="h6">
            PDF Export
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box py={2}>
          {isExporting && (
            <Box mb={3}>
              <LinearProgress 
                variant="determinate" 
                value={getProgressValue()}
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {getProgressValue()}% färdig
              </Typography>
            </Box>
          )}

          <Typography variant="body1" gutterBottom>
            {getStatusMessage()}
          </Typography>

          {exportStatus === 'success' && (
            <Alert severity="success" sx={{ mt: 2 }}>
              <Typography variant="body2">
                Din CV har exporterats som en högkvalitativ PDF. Filen innehåller all information från ditt CV och är redo för utskrift eller att skickas till arbetsgivare.
              </Typography>
            </Alert>
          )}

          {exportStatus === 'error' && (
            <Alert severity="error" sx={{ mt: 2 }}>
              <Typography variant="body2" gutterBottom>
                PDF exporten misslyckades. Vanliga lösningar:
              </Typography>
              <Box component="ul" sx={{ mt: 1, pl: 2, mb: 2 }}>
                <li><strong>Försök igen:</strong> Klicka på "Export PDF" en gång till</li>
                <li><strong>Uppdatera sidan:</strong> Ladda om sidan och försök igen</li>
                <li><strong>Använd Chrome/Firefox:</strong> Dessa webbläsare fungerar bäst</li>
                <li><strong>Kontrollera internetanslutning:</strong> Se till att du är uppkopplad</li>
                <li><strong>Minska innehåll:</strong> Ta bort några poster om CV:t är mycket stort</li>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Fungerar det fortfarande inte? Använd webbläsarens utskriftsfunktion (Ctrl+P) och välj "Spara som PDF".
              </Typography>
            </Alert>
          )}

          {!isExporting && exportStatus !== 'success' && exportStatus !== 'error' && (
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Din CV kommer att exporteras som en professionell PDF-fil med:
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1} mt={2}>
                <Chip label="A4-format" size="small" color="primary" variant="outlined" />
                <Chip label="Hög kvalitet" size="small" color="primary" variant="outlined" />
                <Chip label="Utskriftsklar" size="small" color="primary" variant="outlined" />
                <Chip label="ATS-vänlig" size="small" color="primary" variant="outlined" />
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        {exportStatus === 'success' && (
          <Button
            onClick={onClose}
            variant="contained"
            startIcon={<DownloadIcon />}
          >
            Stäng
          </Button>
        )}
        
        {exportStatus === 'error' && (
          <>
            <Button
              onClick={() => window.print()}
              variant="outlined"
              sx={{ mr: 1 }}
            >
              Använd Utskrift (Ctrl+P)
            </Button>
            <Button
              onClick={onClose}
              color="primary"
              variant="contained"
            >
              Försök igen
            </Button>
          </>
        )}
        
        {!isExporting && exportStatus !== 'success' && exportStatus !== 'error' && (
          <Button
            onClick={onClose}
            color="primary"
          >
            Avbryt
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default PDFExportDialog;

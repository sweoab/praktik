// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { useState, useEffect, useContext } from 'react';
import {
  Button,
  Box,
  Dialog,
  DialogTitle,
  Slide,
  TextField,
  DialogContent,
  DialogActions,
  Typography,
  Autocomplete,
  Alert,
  CircularProgress,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Close as CloseIcon,
  Send as SendIcon,
  AttachFile as AttachFileIcon,
} from '@mui/icons-material';
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import { EmailContext } from '@/context/EmailContext';
import { postFetcher, getFetcher } from '@/api/globalFetcher';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const EmailCompose = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    to: '',
    subject: '',
    content: '',
    isImportant: false,
  });
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loadingContacts, setLoadingContacts] = useState(false);

  const { emails, setEmails, sendEmail } = useContext(EmailContext);

  // Load contacts when component mounts
  useEffect(() => {
    if (open) {
      loadContacts();
      // Reset form when opening
      setFormData({
        to: '',
        subject: '',
        content: '',
        isImportant: false,
      });
      setError('');
      setSuccess('');
    }
  }, [open]);

  const loadContacts = async () => {
    try {
      setLoadingContacts(true);
      const response = await getFetcher('/api/email/contacts');
      if (response.status === 200) {
        setContacts(response.data.map(contact => ({
          label: `${contact.firstName} ${contact.lastName} (${contact.email})`,
          email: contact.email,
          name: `${contact.firstName} ${contact.lastName}`
        })));
      }
    } catch (error) {
      console.error('Error loading contacts:', error);
      setError('Failed to load contacts');
    } finally {
      setLoadingContacts(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear errors when user starts typing
    if (error) setError('');
  };

  const handleSend = async () => {
    // Validation
    if (!formData.to) {
      setError('Mottagare är obligatorisk');
      return;
    }
    if (!formData.subject) {
      setError('Ämne är obligatoriskt');
      return;
    }
    if (!formData.content) {
      setError('Meddelande kan inte vara tomt');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Use the sendEmail function from context
      const result = await sendEmail(formData.to, formData.subject, formData.content);

      if (result.success) {
        setSuccess('E-post skickat framgångsrikt!');
        
        // Reset form
        setFormData({
          to: '',
          subject: '',
          content: '',
          isImportant: false
        });

        // Close dialog after success
        setTimeout(() => {
          setSuccess('');
          onClose();
        }, 2000);
      } else {
        setError(result.error || 'Misslyckades att skicka e-post');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setError('Ett oväntat fel uppstod');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      setError('');
      setSuccess('');
    }
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      aria-labelledby="email-compose-title"
    >
      <DialogTitle 
        id="email-compose-title" 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Skriv nytt meddelande
        </Typography>
        <IconButton 
          onClick={handleClose} 
          disabled={loading}
          sx={{ color: 'white' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Success Alert */}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {/* To Field with Autocomplete */}
        <Box mb={3}>
          <CustomFormLabel htmlFor="to-field">Till *</CustomFormLabel>
          <Autocomplete
            id="to-field"
            freeSolo
            loading={loadingContacts}
            options={contacts}
            getOptionLabel={(option) => typeof option === 'string' ? option : option.label}
            value={formData.to}
            onInputChange={(event, newValue) => {
              handleInputChange('to', newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                placeholder="namn@exempel.se eller välj från kontakter"
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loadingContacts ? <CircularProgress size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            renderOption={(props, option) => (
              <Box component="li" {...props}>
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    {option.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {option.email}
                  </Typography>
                </Box>
              </Box>
            )}
          />
        </Box>

        {/* Subject Field */}
        <Box mb={3}>
          <CustomFormLabel htmlFor="subject-field">Ämne *</CustomFormLabel>
          <TextField
            id="subject-field"
            fullWidth
            placeholder="Skriv ämnerad..."
            variant="outlined"
            value={formData.subject}
            onChange={(e) => handleInputChange('subject', e.target.value)}
          />
        </Box>

        {/* Message Field */}
        <Box mb={3}>
          <CustomFormLabel htmlFor="message-field">Meddelande *</CustomFormLabel>
          <TextField
            id="message-field"
            placeholder="Skriv ditt meddelande här..."
            multiline
            fullWidth
            rows={6}
            variant="outlined"
            value={formData.content}
            onChange={(e) => handleInputChange('content', e.target.value)}
          />
        </Box>

        {/* Options */}
        <Box mb={2}>
          <Box display="flex" gap={1} alignItems="center">
            <Chip
              label="Viktigt"
              clickable
              color={formData.isImportant ? "primary" : "default"}
              variant={formData.isImportant ? "filled" : "outlined"}
              onClick={() => handleInputChange('isImportant', !formData.isImportant)}
            />
            <IconButton color="primary" disabled>
              <AttachFileIcon />
            </IconButton>
            <Typography variant="caption" color="text.secondary">
              Bilagor kommer snart
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button 
          onClick={handleClose} 
          disabled={loading}
          sx={{ mr: 1 }}
        >
          Avbryt
        </Button>
        <Button 
          onClick={handleSend} 
          variant="contained" 
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
          sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a67d8 0%, #667eea 100%)',
            }
          }}
        >
          {loading ? 'Skickar...' : 'Skicka'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmailCompose;

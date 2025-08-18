import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Description as DescriptionIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { getInternship, submitApplication } from '@/api/internships/InternshipsData';

const steps = ['Personuppgifter', 'Utbildning & Erfarenhet', 'Motivation', 'Granska & Skicka'];

const InternshipApplication = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    // Personal information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    
    // Education
    school: '',
    program: '',
    year: '',
    gpa: '',
    expectedGraduation: '',
    
    // Experience
    previousExperience: '',
    skills: '',
    languages: '',
    
    // Motivation
    motivation: '',
    whyCompany: '',
    availability: '',
    
    // Additional
    portfolio: '',
    linkedIn: '',
    github: ''
  });

  useEffect(() => {
    fetchInternship();
  }, [id]);

  const fetchInternship = async () => {
    try {
      const data = await getInternship(id);
      setInternship(data);
    } catch (err) {
      setError('Kunde inte hämta praktikplats-information');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    
    try {
      const applicationData = {
        internship_id: parseInt(id),
        student_name: `${formData.firstName} ${formData.lastName}`,
        student_email: formData.email,
        student_phone: formData.phone,
        cover_letter: formData.motivation,
        resume_url: formData.portfolio,
        additional_info: JSON.stringify({
          education: {
            school: formData.school,
            program: formData.program,
            year: formData.year,
            gpa: formData.gpa,
            expectedGraduation: formData.expectedGraduation
          },
          experience: {
            previousExperience: formData.previousExperience,
            skills: formData.skills,
            languages: formData.languages
          },
          motivation: {
            whyCompany: formData.whyCompany,
            availability: formData.availability
          },
          contact: {
            address: formData.address,
            city: formData.city,
            linkedIn: formData.linkedIn,
            github: formData.github
          }
        })
      };

      await submitApplication(applicationData);
      setSuccess(true);
    } catch (err) {
      setError('Kunde inte skicka ansökan. Försök igen.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderPersonalInfo = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Personuppgifter
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Förnamn"
          value={formData.firstName}
          onChange={(e) => handleInputChange('firstName', e.target.value)}
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Efternamn"
          value={formData.lastName}
          onChange={(e) => handleInputChange('lastName', e.target.value)}
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="E-post"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Telefonnummer"
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          required
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Adress"
          value={formData.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Stad"
          value={formData.city}
          onChange={(e) => handleInputChange('city', e.target.value)}
        />
      </Grid>
    </Grid>
  );

  const renderEducation = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Utbildning & Erfarenhet
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Skola/Universitet"
          value={formData.school}
          onChange={(e) => handleInputChange('school', e.target.value)}
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Program/Inriktning"
          value={formData.program}
          onChange={(e) => handleInputChange('program', e.target.value)}
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Årskurs</InputLabel>
          <Select
            value={formData.year}
            onChange={(e) => handleInputChange('year', e.target.value)}
            label="Årskurs"
          >
            <MenuItem value="1">År 1</MenuItem>
            <MenuItem value="2">År 2</MenuItem>
            <MenuItem value="3">År 3</MenuItem>
            <MenuItem value="4">År 4</MenuItem>
            <MenuItem value="5">År 5</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Betygssnitt (valfritt)"
          value={formData.gpa}
          onChange={(e) => handleInputChange('gpa', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Förväntad examen"
          type="date"
          value={formData.expectedGraduation}
          onChange={(e) => handleInputChange('expectedGraduation', e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Tidigare arbetslivserfarenhet"
          value={formData.previousExperience}
          onChange={(e) => handleInputChange('previousExperience', e.target.value)}
          placeholder="Beskriv din tidigare arbetslivserfarenhet..."
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Färdigheter och kompetenser"
          value={formData.skills}
          onChange={(e) => handleInputChange('skills', e.target.value)}
          placeholder="Tekniska färdigheter, programmeringsspråk, verktyg etc..."
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Språkkunskaper"
          value={formData.languages}
          onChange={(e) => handleInputChange('languages', e.target.value)}
          placeholder="Svenska (modersmål), Engelska (flyt), etc..."
        />
      </Grid>
    </Grid>
  );

  const renderMotivation = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Motivation och Tillgänglighet
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          rows={6}
          label="Personligt brev / Motivation"
          value={formData.motivation}
          onChange={(e) => handleInputChange('motivation', e.target.value)}
          placeholder="Berätta varför du vill göra praktik hos oss och vad du hoppas få ut av praktiken..."
          required
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Varför just detta företag?"
          value={formData.whyCompany}
          onChange={(e) => handleInputChange('whyCompany', e.target.value)}
          placeholder="Vad intresserar dig mest med vårt företag och denna praktikplats?"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Tillgänglighet"
          value={formData.availability}
          onChange={(e) => handleInputChange('availability', e.target.value)}
          placeholder="När kan du börja praktiken? Fullmakt/deltid?"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Portfolio/Hemsida (valfritt)"
          value={formData.portfolio}
          onChange={(e) => handleInputChange('portfolio', e.target.value)}
          placeholder="https://..."
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="LinkedIn (valfritt)"
          value={formData.linkedIn}
          onChange={(e) => handleInputChange('linkedIn', e.target.value)}
          placeholder="https://linkedin.com/in/..."
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="GitHub (valfritt)"
          value={formData.github}
          onChange={(e) => handleInputChange('github', e.target.value)}
          placeholder="https://github.com/..."
        />
      </Grid>
    </Grid>
  );

  const renderReview = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Granska din ansökan
        </Typography>
      </Grid>
      
      <Grid item xs={12}>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Personuppgifter
          </Typography>
          <Typography variant="body2">
            Namn: {formData.firstName} {formData.lastName}<br/>
            E-post: {formData.email}<br/>
            Telefon: {formData.phone}<br/>
            {formData.city && `Stad: ${formData.city}`}
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            <SchoolIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Utbildning
          </Typography>
          <Typography variant="body2">
            Skola: {formData.school}<br/>
            Program: {formData.program}<br/>
            År: {formData.year}<br/>
            {formData.expectedGraduation && `Examen: ${formData.expectedGraduation}`}
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            <DescriptionIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Motivation
          </Typography>
          <Typography variant="body2">
            {formData.motivation || 'Ingen motivation angiven'}
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return renderPersonalInfo();
      case 1:
        return renderEducation();
      case 2:
        return renderMotivation();
      case 3:
        return renderReview();
      default:
        return null;
    }
  };

  const isStepValid = (step) => {
    switch (step) {
      case 0:
        return formData.firstName && formData.lastName && formData.email && formData.phone;
      case 1:
        return formData.school && formData.program && formData.year;
      case 2:
        return formData.motivation;
      default:
        return true;
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography sx={{ mt: 2 }}>Laddar praktikplats...</Typography>
      </Box>
    );
  }

  if (success) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Ansökan skickad!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Tack för din ansökan till {internship?.title} hos {internship?.company_name}.
          Vi kommer att kontakta dig inom kort.
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/apps/internships')}
          sx={{ mr: 2 }}
        >
          Tillbaka till praktikplatser
        </Button>
        <Button 
          variant="outlined" 
          onClick={() => navigate(`/apps/internships/${id}`)}
        >
          Visa praktikplats
        </Button>
      </Box>
    );
  }

  if (!internship) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Praktikplats hittades inte</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" mb={3}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/apps/internships/${id}`)}
          sx={{ mr: 2 }}
        >
          Tillbaka
        </Button>
        <Box>
          <Typography variant="h4">
            Ansök till {internship.title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {internship.company_name} • {internship.location}
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Stepper */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>

      {/* Form Content */}
      <Card>
        <CardContent>
          {getStepContent(activeStep)}

          {/* Navigation Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Tillbaka
            </Button>
            
            <Box>
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={submitting || !isStepValid(activeStep)}
                  startIcon={<SendIcon />}
                >
                  {submitting ? 'Skickar...' : 'Skicka ansökan'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!isStepValid(activeStep)}
                >
                  Nästa
                </Button>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default InternshipApplication;

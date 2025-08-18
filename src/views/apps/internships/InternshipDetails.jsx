import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Skeleton,
  Paper,
  Breadcrumbs,
  Link
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Schedule as ScheduleIcon,
  Euro as EuroIcon,
  Laptop as LaptopIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Language as LanguageIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as CheckIcon,
  ArrowBack as ArrowBackIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon
} from '@mui/icons-material';
import PageContainer from '../../../components/container/PageContainer';
import { getInternshipById } from '../../../api/internships/InternshipsData';

const InternshipDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const fetchInternship = async () => {
      try {
        setLoading(true);
        const data = await getInternshipById(id);
        setInternship(data);
      } catch (err) {
        setError(t('internships.errorLoading'));
        console.error('Error fetching internship:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchInternship();
    }
  }, [id, t]);

  const handleApply = () => {
    navigate(`/apps/internships/${id}/apply`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: internship.title,
        text: `${t('internships.checkOut')}: ${internship.title} ${t('internships.at')} ${internship.company_name}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // Här skulle du normalt spara bokmärket till backend
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'paused': return 'warning';
      case 'closed': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return t('internships.active');
      case 'paused': return t('internships.paused');
      case 'closed': return t('internships.closed');
      default: return status;
    }
  };

  if (loading) {
    return (
      <PageContainer title={t('internships.loading')} description="">
        <Box sx={{ p: 3 }}>
          <Skeleton variant="text" height={60} width="60%" />
          <Skeleton variant="text" height={40} width="40%" sx={{ mb: 3 }} />
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Skeleton variant="rectangular" height={400} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Skeleton variant="rectangular" height={300} />
            </Grid>
          </Grid>
        </Box>
      </PageContainer>
    );
  }

  if (error || !internship) {
    return (
      <PageContainer title={t('internships.error')} description="">
        <Box sx={{ p: 3 }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error || t('internships.notFound')}
          </Alert>
          <Button startIcon={<ArrowBackIcon />} onClick={handleBack}>
            {t('common.goBack')}
          </Button>
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer title={internship.title} description={internship.description}>
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link color="inherit" href="/apps/internships" underline="hover">
            {t('internships.title')}
          </Link>
          <Typography color="text.primary">
            {internship.title}
          </Typography>
        </Breadcrumbs>

        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={handleBack}
            variant="outlined"
            sx={{ mb: { xs: 2, md: 0 } }}
          >
            {t('common.back')}
          </Button>
          <Box display="flex" gap={1}>
            <Button
              startIcon={isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
              onClick={handleBookmark}
              variant="outlined"
            >
              {isBookmarked ? t('internships.bookmarked') : t('internships.bookmark')}
            </Button>
            <Button
              startIcon={<ShareIcon />}
              onClick={handleShare}
              variant="outlined"
            >
              {t('common.share')}
            </Button>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                {/* Company Header */}
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <Avatar
                    src={internship.company_logo}
                    sx={{ width: 80, height: 80 }}
                  >
                    <BusinessIcon />
                  </Avatar>
                  <Box flex={1}>
                    <Typography variant="h4" component="h1" gutterBottom>
                      {internship.title}
                    </Typography>
                    <Typography variant="h6" color="primary" gutterBottom>
                      {internship.company_name}
                    </Typography>
                    <Chip
                      label={getStatusText(internship.status)}
                      color={getStatusColor(internship.status)}
                      size="small"
                    />
                  </Box>
                </Box>

                {/* Key Info */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <LocationIcon color="action" />
                      <Typography variant="body1">
                        {internship.location}
                        {internship.remote_allowed && (
                          <Chip 
                            icon={<LaptopIcon />} 
                            label={t('internships.remoteOk')} 
                            size="small" 
                            color="info" 
                            variant="outlined"
                            sx={{ ml: 1 }}
                          />
                        )}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <ScheduleIcon color="action" />
                      <Typography variant="body1">
                        {internship.duration_formatted || internship.duration}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <SchoolIcon color="action" />
                      <Typography variant="body1">
                        {internship.field_of_study}
                      </Typography>
                    </Box>
                  </Grid>
                  {internship.compensation && (
                    <Grid item xs={12} sm={6}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <EuroIcon color="action" />
                        <Typography variant="body1">
                          {internship.compensation_formatted || internship.compensation}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>

                {/* Application Deadline */}
                {internship.application_deadline && (
                  <Alert severity="warning" sx={{ mb: 3 }}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <CalendarIcon />
                      <Typography>
                        {t('internships.applyBy')}: {internship.deadline_formatted || new Date(internship.application_deadline).toLocaleDateString('sv-SE')}
                      </Typography>
                    </Box>
                  </Alert>
                )}

                <Divider sx={{ my: 3 }} />

                {/* Description */}
                <Typography variant="h6" gutterBottom>
                  {t('internships.description')}
                </Typography>
                <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
                  {internship.description}
                </Typography>

                {/* Requirements */}
                {internship.requirements && (
                  <>
                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                      {t('internships.requirements')}
                    </Typography>
                    <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
                      {internship.requirements}
                    </Typography>
                  </>
                )}

                {/* Skills */}
                {internship.required_skills && internship.required_skills.length > 0 && (
                  <>
                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                      {t('internships.skills')}:
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                      {internship.required_skills.map((skill, index) => (
                        <Chip 
                          key={index}
                          label={skill} 
                          variant="outlined"
                          color="primary"
                        />
                      ))}
                    </Box>
                  </>
                )}

                {/* Benefits */}
                {internship.benefits && (
                  <>
                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                      {t('internships.benefits')}
                    </Typography>
                    <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
                      {internship.benefits}
                    </Typography>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            {/* Apply Card */}
            <Card sx={{ mb: 3, position: 'sticky', top: 20 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t('internships.applyForPosition')}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {t('internships.readyToApply')}
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={handleApply}
                  disabled={internship.status !== 'active'}
                  sx={{ mb: 2 }}
                >
                  {t('internships.apply')}
                </Button>
                {internship.status !== 'active' && (
                  <Typography variant="caption" color="error" textAlign="center" display="block">
                    {t('internships.applicationsClosed')}
                  </Typography>
                )}
              </CardContent>
            </Card>

            {/* Company Info */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t('companies.about')} {internship.company_name}
                </Typography>
                
                {internship.company_description && (
                  <Typography variant="body2" paragraph>
                    {internship.company_description}
                  </Typography>
                )}

                <List dense>
                  {internship.company_industry && (
                    <ListItem>
                      <ListItemIcon>
                        <BusinessIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary={t('companies.industry')}
                        secondary={internship.company_industry}
                      />
                    </ListItem>
                  )}
                  
                  {internship.company_size && (
                    <ListItem>
                      <ListItemIcon>
                        <PersonIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary={t('companies.employees')}
                        secondary={internship.company_size}
                      />
                    </ListItem>
                  )}

                  {internship.company_website && (
                    <ListItem>
                      <ListItemIcon>
                        <LanguageIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary={t('companies.website')}
                        secondary={
                          <Link href={internship.company_website} target="_blank" rel="noopener noreferrer">
                            {internship.company_website}
                          </Link>
                        }
                      />
                    </ListItem>
                  )}
                </List>
              </CardContent>
            </Card>

            {/* Contact Info */}
            {(internship.contact_email || internship.contact_phone) && (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {t('internships.contactInfo')}
                  </Typography>
                  <List dense>
                    {internship.contact_email && (
                      <ListItem>
                        <ListItemIcon>
                          <EmailIcon />
                        </ListItemIcon>
                        <ListItemText 
                          primary={t('common.email')}
                          secondary={
                            <Link href={`mailto:${internship.contact_email}`}>
                              {internship.contact_email}
                            </Link>
                          }
                        />
                      </ListItem>
                    )}
                    
                    {internship.contact_phone && (
                      <ListItem>
                        <ListItemIcon>
                          <PhoneIcon />
                        </ListItemIcon>
                        <ListItemText 
                          primary={t('common.phone')}
                          secondary={
                            <Link href={`tel:${internship.contact_phone}`}>
                              {internship.contact_phone}
                            </Link>
                          }
                        />
                      </ListItem>
                    )}
                  </List>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default InternshipDetails;

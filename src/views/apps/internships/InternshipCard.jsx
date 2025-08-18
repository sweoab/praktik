import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  Avatar,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Schedule as ScheduleIcon,
  Euro as EuroIcon,
  Laptop as LaptopIcon,
  School as SchoolIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Share as ShareIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const InternshipCard = ({ internship, onBookmark, isBookmarked = false }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/apps/internships/${internship.id}`);
  };

  const handleApply = () => {
    navigate(`/apps/internships/${internship.id}/apply`);
  };

  const handleBookmark = (e) => {
    e.stopPropagation();
    if (onBookmark) {
      onBookmark(internship.id);
    }
  };

  const handleShare = (e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: internship.title,
        text: `${t('internships.checkOut')}: ${internship.title} ${t('internships.at')} ${internship.company_name}`,
        url: window.location.origin + `/apps/internships/${internship.id}`
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(
        window.location.origin + `/apps/internships/${internship.id}`
      );
    }
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

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: 4,
          transform: 'translateY(-2px)',
          transition: 'all 0.2s ease-in-out'
        }
      }}
      onClick={handleViewDetails}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        {/* Header with company info and actions */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box display="flex" alignItems="center" gap={1} flex={1}>
            <Avatar
              src={internship.company_logo}
              sx={{ 
                width: 40, 
                height: 40, 
                bgcolor: 'primary.main' 
              }}
            >
              <BusinessIcon />
            </Avatar>
            <Box flex={1} minWidth={0}>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                noWrap
                title={internship.company_name}
              >
                {internship.company_name}
              </Typography>
              <Chip 
                label={getStatusText(internship.status)}
                color={getStatusColor(internship.status)}
                size="small"
              />
            </Box>
          </Box>
          <Box display="flex" gap={0.5}>
            <Tooltip title="Spara praktikplats">
              <IconButton size="small" onClick={handleBookmark}>
                {isBookmarked ? <BookmarkIcon color="primary" /> : <BookmarkBorderIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Dela praktikplats">
              <IconButton size="small" onClick={handleShare}>
                <ShareIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Title */}
        <Typography 
          variant="h6" 
          component="h3" 
          gutterBottom
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.3,
            minHeight: '2.6em'
          }}
        >
          {internship.title}
        </Typography>

        {/* Description */}
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            mb: 2,
            minHeight: '3.6em'
          }}
        >
          {internship.description}
        </Typography>

        {/* Key Details */}
        <Box display="flex" flexDirection="column" gap={1} mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <LocationIcon color="action" sx={{ fontSize: 16 }} />
            <Typography variant="body2" color="text.secondary">
              {internship.location}
            </Typography>
            {internship.remote_allowed && (
              <Chip 
                icon={<LaptopIcon />} 
                label={t('internships.remoteOk')} 
                size="small" 
                color="info" 
                variant="outlined"
              />
            )}
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <ScheduleIcon color="action" sx={{ fontSize: 16 }} />
            <Typography variant="body2" color="text.secondary">
              {internship.duration_formatted}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <SchoolIcon color="action" sx={{ fontSize: 16 }} />
            <Typography variant="body2" color="text.secondary">
              {internship.field_of_study}
            </Typography>
          </Box>

          {internship.compensation && (
            <Box display="flex" alignItems="center" gap={1}>
              <EuroIcon color="action" sx={{ fontSize: 16 }} />
              <Typography variant="body2" color="text.secondary">
                {internship.compensation_formatted}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Skills */}
        {internship.required_skills && internship.required_skills.length > 0 && (
          <Box mb={2}>
            <Typography variant="caption" color="text.secondary" display="block" mb={1}>
              {t('internships.skills')}:
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={0.5}>
              {internship.required_skills.slice(0, 3).map((skill, index) => (
                <Chip 
                  key={index}
                  label={skill} 
                  size="small" 
                  variant="outlined"
                  color="primary"
                />
              ))}
              {internship.required_skills.length > 3 && (
                <Chip 
                  label={`+${internship.required_skills.length - 3}`}
                  size="small" 
                  variant="outlined"
                  color="default"
                />
              )}
            </Box>
          </Box>
        )}

        {/* Deadline */}
        {internship.application_deadline && (
          <Box 
            display="flex" 
            alignItems="center" 
            gap={1}
            sx={{
              p: 1,
              backgroundColor: 'warning.light',
              borderRadius: 1,
              mt: 'auto'
            }}
          >
            <Typography variant="caption" color="warning.dark">
              {t('internships.applyBy')}: {internship.deadline_formatted}
            </Typography>
          </Box>
        )}
      </CardContent>

      <CardActions sx={{ pt: 0, px: 2, pb: 2 }}>
        <Button 
          variant="outlined" 
          size="small" 
          fullWidth
          onClick={(e) => {
            e.stopPropagation();
            handleViewDetails();
          }}
        >
          {t('internships.readMore')}
        </Button>
        <Button 
          variant="contained" 
          size="small" 
          fullWidth
          onClick={(e) => {
            e.stopPropagation();
            handleApply();
          }}
          disabled={internship.status !== 'active'}
        >
          {t('internships.apply')}
        </Button>
      </CardActions>
    </Card>
  );
};

export default InternshipCard;

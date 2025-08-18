import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  Divider,
  Chip,
  Paper,
  Grid,
  LinearProgress,
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';

const CVPreview = ({ cvData }) => {
  const { personalInfo, workExperience, education, skills, selectedTemplate } = cvData;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  const getProficiencyPercentage = (level) => (level / 5) * 100;

  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {});

  const getTemplateColors = (templateId) => {
    const colorMap = {
      'modern': '#1976d2',
      'minimal': '#424242',
      'creative-blue': '#2196f3',
      'creative-green': '#4caf50',
      'creative-purple': '#9c27b0',
      'executive-navy': '#1a237e',
      'tech-orange': '#ff5722',
      'elegant-rose': '#e91e63',
      'finance-teal': '#009688',
      'artistic-indigo': '#3f51b5',
      'startup-amber': '#ffc107',
      'luxury-gold': '#f57c00',
      'healthcare-cyan': '#00bcd4',
      'education-lime': '#8bc34a',
      'corporate-grey': '#607d8b',
      'gradient-sunset': 'linear-gradient(135deg, #ff6b6b, #ffd93d)',
      'dark-theme': '#212121',
      'pastel-mint': '#a8e6cf',
      'bold-red': '#d32f2f',
      'vintage-brown': '#8d6e63',
    };
    return colorMap[templateId] || '#1976d2';
  };

  const isGradientTemplate = (templateId) => templateId === 'gradient-sunset';
  const isDarkTemplate = (templateId) => templateId === 'dark-theme';

  const renderModernTemplate = () => {
    const templateColor = getTemplateColors(selectedTemplate);
    const isGradient = isGradientTemplate(selectedTemplate);
    const isDark = isDarkTemplate(selectedTemplate);

    const paperStyles = {
      p: 4,
      maxWidth: '210mm',
      mx: 'auto',
      backgroundColor: isDark ? '#212121' : 'background.paper',
      color: isDark ? '#ffffff' : 'inherit',
      ...(isGradient && { background: templateColor, color: '#ffffff' }),
    };

    const primaryColor = isDark ? '#ffffff' : (isGradient ? '#ffffff' : templateColor);
    const secondaryColor = isDark ? '#cccccc' : 'text.secondary';

    return (
      <Paper elevation={2} sx={paperStyles} data-pdf-target>
        {/* Header */}
        <Box display="flex" alignItems="center" mb={4}>
          {personalInfo.profilePicture && (
            <Avatar
              src={personalInfo.profilePicture}
              sx={{
                width: 100,
                height: 100,
                mr: 3,
                border: isDark ? '3px solid #ffffff' : `3px solid ${templateColor}`,
              }}
            />
          )}
          <Box flexGrow={1}>
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: primaryColor }}>
              {personalInfo.firstName} {personalInfo.lastName}
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
              {personalInfo.email && (
                <Box display="flex" alignItems="center" gap={0.5}>
                  <EmailIcon fontSize="small" sx={{ color: primaryColor }} />
                  <Typography variant="body2" sx={{ color: secondaryColor }}>
                    {personalInfo.email}
                  </Typography>
                </Box>
              )}
              {personalInfo.phone && (
                <Box display="flex" alignItems="center" gap={0.5}>
                  <PhoneIcon fontSize="small" sx={{ color: primaryColor }} />
                  <Typography variant="body2" sx={{ color: secondaryColor }}>
                    {personalInfo.phone}
                  </Typography>
                </Box>
              )}
              {personalInfo.address && (
                <Box display="flex" alignItems="center" gap={0.5}>
                  <LocationIcon fontSize="small" sx={{ color: primaryColor }} />
                  <Typography variant="body2" sx={{ color: secondaryColor }}>
                    {personalInfo.address}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        {/* Professional Summary */}
        {personalInfo.summary && (
          <Box mb={4}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: primaryColor }}>
              Professional Summary
            </Typography>
            <Typography variant="body1" paragraph sx={{ color: isDark ? '#cccccc' : 'inherit' }}>
              {personalInfo.summary}
            </Typography>
            <Divider sx={{ borderColor: isDark ? 'rgba(255,255,255,0.3)' : 'divider' }} />
          </Box>
        )}

        {/* Work Experience */}
        {workExperience.length > 0 && (
          <Box mb={4}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: primaryColor }}>
              Work Experience
            </Typography>
            {workExperience.map((exp, index) => (
              <Box key={exp.id} mb={3}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ color: isDark ? '#ffffff' : 'inherit' }}>
                      {exp.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: secondaryColor }}>
                      {exp.company}{exp.location && `, ${exp.location}`}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: secondaryColor }}>
                    {formatDate(exp.startDate)} - {exp.isCurrentJob ? 'Present' : formatDate(exp.endDate)}
                  </Typography>
                </Box>
                {exp.description && (
                  <Typography variant="body2" paragraph sx={{ color: isDark ? '#cccccc' : 'inherit' }}>
                    {exp.description}
                  </Typography>
                )}
                {index < workExperience.length - 1 && <Divider sx={{ mt: 2, borderColor: isDark ? 'rgba(255,255,255,0.3)' : 'divider' }} />}
              </Box>
            ))}
            <Divider sx={{ borderColor: isDark ? 'rgba(255,255,255,0.3)' : 'divider' }} />
          </Box>
        )}

        {/* Education */}
        {education.length > 0 && (
          <Box mb={4}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: primaryColor }}>
              Education
            </Typography>
            {education.map((edu, index) => (
              <Box key={edu.id} mb={2}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ color: isDark ? '#ffffff' : 'inherit' }}>
                      {edu.degree}{edu.field && ` in ${edu.field}`}
                    </Typography>
                    <Typography variant="body2" sx={{ color: secondaryColor }}>
                      {edu.institution}{edu.location && `, ${edu.location}`}
                    </Typography>
                    {edu.gpa && (
                      <Typography variant="body2" sx={{ color: secondaryColor }}>
                        GPA: {edu.gpa}
                      </Typography>
                    )}
                  </Box>
                  <Typography variant="body2" sx={{ color: secondaryColor }}>
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate) || 'Present'}
                  </Typography>
                </Box>
                {edu.description && (
                  <Typography variant="body2" paragraph sx={{ color: isDark ? '#cccccc' : 'inherit' }}>
                    {edu.description}
                  </Typography>
                )}
                {index < education.length - 1 && <Divider sx={{ mt: 2, borderColor: isDark ? 'rgba(255,255,255,0.3)' : 'divider' }} />}
              </Box>
            ))}
            <Divider sx={{ borderColor: isDark ? 'rgba(255,255,255,0.3)' : 'divider' }} />
          </Box>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: primaryColor }}>
              Skills & Competencies
            </Typography>
            {Object.entries(groupedSkills).map(([category, categorySkills]) => (
              <Box key={category} mb={3}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ color: isDark ? '#ffffff' : 'inherit' }}>
                  {category}
                </Typography>
                <Grid container spacing={2}>
                  {categorySkills.map((skill) => (
                    <Grid item xs={12} sm={6} key={skill.id}>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <Typography variant="body2" sx={{ minWidth: 100, color: isDark ? '#cccccc' : 'inherit' }}>
                          {skill.name}
                        </Typography>
                        <Box flexGrow={1}>
                          <LinearProgress
                            variant="determinate"
                            value={getProficiencyPercentage(skill.proficiency)}
                            sx={{
                              height: 6,
                              borderRadius: 3,
                              backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: isGradient ? '#ffffff' : templateColor,
                              },
                            }}
                          />
                        </Box>
                        <Chip
                          label={skill.proficiency}
                          size="small"
                          sx={{
                            minWidth: 30,
                            height: 20,
                            fontSize: '0.7rem',
                            backgroundColor: isGradient ? 'rgba(255,255,255,0.2)' : `${templateColor}20`,
                            color: isGradient || isDark ? '#ffffff' : templateColor,
                            border: `1px solid ${isGradient || isDark ? '#ffffff' : templateColor}`,
                          }}
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))}
          </Box>
        )}
      </Paper>
    );
  };

  const renderMinimalTemplate = () => {
    const templateColor = getTemplateColors(selectedTemplate);
    const isGradient = isGradientTemplate(selectedTemplate);
    const isDark = isDarkTemplate(selectedTemplate);

    const paperStyles = {
      p: 3,
      maxWidth: '210mm',
      mx: 'auto',
      backgroundColor: isDark ? '#212121' : 'background.paper',
      color: isDark ? '#ffffff' : 'inherit',
      ...(isGradient && { background: templateColor, color: '#ffffff' }),
    };

    return (
      <Paper elevation={1} sx={paperStyles} data-pdf-target>
        {/* Header */}
        <Box textAlign="center" mb={3}>
          {personalInfo.profilePicture && (
            <Avatar
              src={personalInfo.profilePicture}
              sx={{
                width: 80,
                height: 80,
                mx: 'auto',
                mb: 2,
                border: isDark ? '2px solid #ffffff' : `2px solid ${templateColor}`,
              }}
            />
          )}
          <Typography variant="h5" fontWeight="300" gutterBottom sx={{ color: isDark || isGradient ? '#ffffff' : 'inherit' }}>
            {personalInfo.firstName} {personalInfo.lastName}
          </Typography>
          <Box display="flex" justifyContent="center" flexWrap="wrap" gap={2}>
            {personalInfo.email && <Typography variant="body2" sx={{ color: isDark || isGradient ? '#cccccc' : 'inherit' }}>{personalInfo.email}</Typography>}
            {personalInfo.phone && <Typography variant="body2" sx={{ color: isDark || isGradient ? '#cccccc' : 'inherit' }}>{personalInfo.phone}</Typography>}
            {personalInfo.address && <Typography variant="body2" sx={{ color: isDark || isGradient ? '#cccccc' : 'inherit' }}>{personalInfo.address}</Typography>}
          </Box>
        </Box>

        {personalInfo.summary && (
          <Box mb={3} textAlign="center">
            <Typography variant="body1" sx={{ fontStyle: 'italic', color: isDark || isGradient ? '#cccccc' : 'inherit' }}>
              {personalInfo.summary}
            </Typography>
          </Box>
        )}

        <Divider sx={{ mb: 3, borderColor: isDark ? 'rgba(255,255,255,0.3)' : 'divider' }} />

        {/* Work Experience */}
        {workExperience.length > 0 && (
          <Box mb={3}>
            <Typography variant="h6" fontWeight="300" gutterBottom sx={{
              textTransform: 'uppercase',
              letterSpacing: 1,
              color: isGradient || isDark ? '#ffffff' : templateColor,
            }}>
              Experience
            </Typography>
            {workExperience.map((exp) => (
              <Box key={exp.id} mb={2}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: isDark || isGradient ? '#ffffff' : 'inherit' }}>
                  {exp.title} • {exp.company}
                </Typography>
                <Typography variant="body2" gutterBottom sx={{ color: isDark || isGradient ? '#cccccc' : 'text.secondary' }}>
                  {formatDate(exp.startDate)} - {exp.isCurrentJob ? 'Present' : formatDate(exp.endDate)}
                </Typography>
                {exp.description && (
                  <Typography variant="body2" sx={{ color: isDark || isGradient ? '#cccccc' : 'inherit' }}>
                    {exp.description}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        )}

        {/* Education */}
        {education.length > 0 && (
          <Box mb={3}>
            <Typography variant="h6" fontWeight="300" gutterBottom sx={{
              textTransform: 'uppercase',
              letterSpacing: 1,
              color: isGradient || isDark ? '#ffffff' : templateColor,
            }}>
              Education
            </Typography>
            {education.map((edu) => (
              <Box key={edu.id} mb={2}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: isDark || isGradient ? '#ffffff' : 'inherit' }}>
                  {edu.degree}{edu.field && ` in ${edu.field}`}
                </Typography>
                <Typography variant="body2" sx={{ color: isDark || isGradient ? '#cccccc' : 'text.secondary' }}>
                  {edu.institution} • {formatDate(edu.startDate)} - {formatDate(edu.endDate) || 'Present'}
                </Typography>
              </Box>
            ))}
          </Box>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <Box>
            <Typography variant="h6" fontWeight="300" gutterBottom sx={{
              textTransform: 'uppercase',
              letterSpacing: 1,
              color: isGradient || isDark ? '#ffffff' : templateColor,
            }}>
              Skills
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {skills.map((skill) => (
                <Chip
                  key={skill.id}
                  label={skill.name}
                  variant="outlined"
                  size="small"
                  sx={{
                    color: isGradient || isDark ? '#ffffff' : templateColor,
                    borderColor: isGradient || isDark ? '#ffffff' : templateColor,
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
      </Paper>
    );
  };

  const renderTemplate = () => {
    switch (selectedTemplate) {
      case 'minimal':
        return renderMinimalTemplate();
      default:
        return renderModernTemplate();
    }
  };

  return (
    <Box sx={{ minHeight: 400 }}>
      {!personalInfo.firstName && !personalInfo.lastName ? (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            CV Preview
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Start filling out your information to see the preview
          </Typography>
        </Box>
      ) : (
        renderTemplate()
      )}
    </Box>
  );
};

export default CVPreview;

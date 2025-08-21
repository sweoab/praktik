import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Grid,
  Chip,
  Paper,
  Avatar,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

const templates = [
  {
    id: 'modern',
    name: 'Professional Modern',
    description: 'Clean och professionell design med moderna element',
    preview: 'modern-preview',
    features: ['Profilbild', 'Färgaccenter', 'Tydlig layout', 'ATS-vänlig'],
    color: '#2563eb',
    colorName: 'Professional Blue',
  },
  {
    id: 'minimal',
    name: 'Elegant Minimal',
    description: 'Minimalistisk design som fokuserar på innehållet',
    preview: 'minimal-preview',
    features: ['Ren design', 'Fokus på text', 'Elegant typografi', 'Tidlös stil'],
    color: '#475569',
    colorName: 'Elegant Grey',
  },
  {
    id: 'executive-navy',
    name: 'Executive',
    description: 'Sofistikerad design för ledande positioner',
    preview: 'executive-navy-preview',
    features: ['Auktoritativ', 'Premium känsla', 'Business-fokus', 'Konservativ'],
    color: '#1e40af',
    colorName: 'Executive Navy',
  },
  {
    id: 'creative-teal',
    name: 'Creative Professional',
    description: 'Kreativ men professionell design för designyrken',
    preview: 'creative-teal-preview',
    features: ['Kreativ layout', 'Visuell balans', 'Modern design', 'Kreativt uttryck'],
    color: '#0d9488',
    colorName: 'Creative Teal',
  },
  {
    id: 'tech-slate',
    name: 'Tech Modern',
    description: 'Modern design optimerad för tech-roller',
    preview: 'tech-slate-preview',
    features: ['Tech-fokus', 'Modern stil', 'Strukturerad', 'Innovativ'],
    color: '#475569',
    colorName: 'Tech Slate',
  },
  {
    id: 'finance-green',
    name: 'Finance Professional',
    description: 'Stabil och pålitlig design för finansbranschen',
    preview: 'finance-green-preview',
    features: ['Stabil design', 'Traditionell', 'Pålitlig känsla', 'Konservativ'],
    color: '#059669',
    colorName: 'Finance Green',
  },
];

const TemplateSelector = ({ selectedTemplate, onChange }) => {
  const renderTemplatePreview = (template) => {
    const previewStyle = {
      p: 3, 
      height: 280, 
      overflow: 'hidden',
      background: '#ffffff',
      color: '#1f2937',
      border: `2px solid ${template.color}`,
      borderRadius: 3,
      position: 'relative',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
      }
    };

    return (
      <Paper elevation={0} sx={previewStyle}>
        {/* Template Header */}
        <Box 
          sx={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            background: template.color,
            borderRadius: '12px 12px 0 0'
          }} 
        />
        
        {/* CV Header Simulation */}
        <Box display="flex" alignItems="center" mt={2} mb={3}>
          <Avatar 
            sx={{ 
              width: 32, 
              height: 32, 
              mr: 2, 
              bgcolor: template.color,
              border: `2px solid ${template.color}`,
              fontSize: '14px',
              fontWeight: 600
            }} 
          >
            JS
          </Avatar>
          <Box>
            <Typography 
              variant="subtitle2" 
              fontWeight="700"
              sx={{ color: '#1f2937', lineHeight: 1.2 }}
            >
              Johan Svensson
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ color: '#64748b', fontWeight: 500 }}
            >
              {template.id.includes('tech') ? 'Senior Developer' : 
               template.id.includes('finance') ? 'Financial Analyst' :
               template.id.includes('creative') ? 'UX/UI Designer' :
               template.id.includes('executive') ? 'Senior Manager' :
               'Projektledare'}
            </Typography>
          </Box>
        </Box>

        {/* Content Sections */}
        <Box mb={2}>
          <Typography 
            variant="caption" 
            fontWeight="700"
            sx={{ 
              color: template.color,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontSize: '0.7rem'
            }}
          >
            PROFESSIONELL PROFIL
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Box sx={{ height: 3, bgcolor: '#e2e8f0', mb: 1, width: '100%', borderRadius: 1 }} />
            <Box sx={{ height: 3, bgcolor: '#e2e8f0', mb: 1, width: '85%', borderRadius: 1 }} />
            <Box sx={{ height: 3, bgcolor: '#e2e8f0', mb: 2, width: '70%', borderRadius: 1 }} />
          </Box>
        </Box>

        <Box mb={2}>
          <Typography 
            variant="caption" 
            fontWeight="700"
            sx={{ 
              color: template.color,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontSize: '0.7rem'
            }}
          >
            ARBETSLIVSERFARENHET
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Box display="flex" alignItems="center" mb={1}>
              <Box 
                sx={{ 
                  width: 6, 
                  height: 6, 
                  bgcolor: template.color, 
                  borderRadius: '50%', 
                  mr: 1 
                }} 
              />
              <Box sx={{ height: 2, bgcolor: '#e2e8f0', width: '60%', borderRadius: 1 }} />
            </Box>
            <Box display="flex" alignItems="center" mb={1}>
              <Box 
                sx={{ 
                  width: 6, 
                  height: 6, 
                  bgcolor: `${template.color}80`, 
                  borderRadius: '50%', 
                  mr: 1 
                }} 
              />
              <Box sx={{ height: 2, bgcolor: '#e2e8f0', width: '55%', borderRadius: 1 }} />
            </Box>
          </Box>
        </Box>

        <Box>
          <Typography 
            variant="caption" 
            fontWeight="700"
            sx={{ 
              color: template.color,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontSize: '0.7rem'
            }}
          >
            KOMPETENSER
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Box display="flex" gap={1} mb={1}>
              <Box 
                sx={{ 
                  height: 6, 
                  background: template.color, 
                  width: 40, 
                  borderRadius: 1
                }} 
              />
              <Box 
                sx={{ 
                  height: 6, 
                  background: `${template.color}60`, 
                  width: 30, 
                  borderRadius: 1
                }} 
              />
              <Box 
                sx={{ 
                  height: 6, 
                  background: `${template.color}40`, 
                  width: 35, 
                  borderRadius: 1
                }} 
              />
            </Box>
          </Box>
        </Box>

        {/* Color indicator */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 12,
            right: 12,
            width: 16,
            height: 16,
            background: template.color,
            borderRadius: '50%',
            border: '2px solid white',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}
        />
      </Paper>
    );
  };

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h5" fontWeight={600} gutterBottom sx={{ color: 'text.primary' }}>
          Välj CV-mall
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Välj en professionell mall som passar din bransch och stil
        </Typography>
        
        {/* Professional indicator */}
        <Box 
          sx={{ 
            p: 2, 
            bgcolor: 'primary.50', 
            borderRadius: 2, 
            border: '1px solid',
            borderColor: 'primary.200'
          }}
        >
          <Typography variant="body2" color="primary.main" fontWeight={500}>
            💼 Alla mallar är optimerade för ATS-system och professionella standarder
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {templates.map((template) => (
          <Grid item xs={12} md={6} lg={4} key={template.id}>
            <Card 
              variant="outlined"
              sx={{ 
                position: 'relative',
                border: selectedTemplate === template.id ? 3 : 1,
                borderColor: selectedTemplate === template.id ? 'primary.main' : 'divider',
                borderRadius: 3,
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                  borderColor: 'primary.main',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
                },
                ...(selectedTemplate === template.id && {
                  boxShadow: '0 8px 32px rgba(37, 99, 235, 0.2)',
                })
              }}
            >
              <CardActionArea 
                onClick={() => onChange(template.id)}
                sx={{ height: '100%' }}
              >
                <CardContent sx={{ p: 0 }}>
                  {/* Selection Indicator */}
                  {selectedTemplate === template.id && (
                    <Box 
                      sx={{ 
                        position: 'absolute', 
                        top: 12, 
                        right: 12, 
                        zIndex: 2,
                        bgcolor: 'primary.main',
                        borderRadius: '50%',
                        p: 0.5
                      }}
                    >
                      <CheckCircleIcon sx={{ color: 'white', fontSize: 20 }} />
                    </Box>
                  )}

                  {/* Template Preview */}
                  <Box>
                    {renderTemplatePreview(template)}
                  </Box>

                  {/* Template Info */}
                  <Box sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight={600} gutterBottom sx={{ color: 'text.primary' }}>
                      {template.name}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 2 }}>
                      {template.description}
                    </Typography>

                    {/* Clean Features */}
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      {template.features.map((feature, index) => (
                        <Chip
                          key={index}
                          label={feature}
                          size="small"
                          variant="outlined"
                          sx={{ 
                            fontSize: '0.75rem',
                            borderColor: 'divider',
                            color: 'text.secondary',
                            '&:hover': {
                              borderColor: template.color,
                              color: template.color,
                            }
                          }}
                        />
                      ))}
                    </Box>

                    {/* Color name indicator */}
                    <Box 
                      sx={{ 
                        mt: 2, 
                        pt: 2, 
                        borderTop: '1px solid',
                        borderColor: 'divider'
                      }}
                    >
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: 'text.secondary',
                          fontWeight: 500,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}
                      >
                        {template.colorName}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Professional Note */}
      <Box 
        mt={4} 
        p={3} 
        sx={{ 
          bgcolor: 'grey.50', 
          borderRadius: 2, 
          border: '1px solid',
          borderColor: 'grey.200'
        }}
      >
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          <strong>Professionell rådgivning:</strong> Du kan byta mall när som helst utan att förlora ditt innehåll. 
          Alla mallar är designade enligt moderna rekryteringsstandarder och fungerar med ATS-system.
        </Typography>
      </Box>
    </Box>
  );
};

export default TemplateSelector;

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
    name: 'Modern Professional',
    description: 'Clean, modern design with sections clearly separated and professional styling',
    preview: 'modern-preview',
    features: ['Profile Picture', 'Progress Bars for Skills', 'Clean Typography', 'Color Accents'],
    color: '#1976d2',
    colorName: 'Blå',
  },
  {
    id: 'minimal',
    name: 'Minimal Clean',
    description: 'Simple, elegant design focusing on content with minimal visual elements',
    preview: 'minimal-preview',
    features: ['Centered Layout', 'Simple Typography', 'Skill Tags', 'Clean Lines'],
    color: '#424242',
    colorName: 'Grå',
  },
  {
    id: 'creative-blue',
    name: 'Kreativ Blå',
    description: 'Kreativ design med blå accenter och visuella element',
    preview: 'creative-blue-preview',
    features: ['Kreativ Layout', 'Blå Färgschema', 'Visuella Element', 'Modern Typography'],
    color: '#2196f3',
    colorName: 'Ljusblå',
  },
  {
    id: 'creative-green',
    name: 'Naturlig Grön',
    description: 'Miljövänlig och naturlig design med gröna accenter',
    preview: 'creative-green-preview',
    features: ['Naturliga Färger', 'Grön Accent', 'Organisk Layout', 'Miljötema'],
    color: '#4caf50',
    colorName: 'Grön',
  },
  {
    id: 'creative-purple',
    name: 'Lila Innovation',
    description: 'Innovativ design med lila färgschema för kreativa roller',
    preview: 'creative-purple-preview',
    features: ['Lila Gradient', 'Kreativ Layout', 'Innovation Focus', 'Modern Design'],
    color: '#9c27b0',
    colorName: 'Lila',
  },
  {
    id: 'executive-navy',
    name: 'Executive Marinblå',
    description: 'Sofistikerad design i marinblått för ledningspositioner',
    preview: 'executive-navy-preview',
    features: ['Marinblå Färg', 'Executive Style', 'Premium Layout', 'Business Focus'],
    color: '#1a237e',
    colorName: 'Marinblå',
  },
  {
    id: 'tech-orange',
    name: 'Tech Orange',
    description: 'Energisk design med orange accenter för tech-roller',
    preview: 'tech-orange-preview',
    features: ['Orange Accenter', 'Tech-fokus', 'Dynamisk Layout', 'Modern Style'],
    color: '#ff5722',
    colorName: 'Orange',
  },
  {
    id: 'elegant-rose',
    name: 'Elegant Rosa',
    description: 'Elegant design med rosa färgschema för service och vård',
    preview: 'elegant-rose-preview',
    features: ['Rosa Färgpalett', 'Elegant Typography', 'Mjuk Design', 'Vårdande Känsla'],
    color: '#e91e63',
    colorName: 'Rosa',
  },
  {
    id: 'finance-teal',
    name: 'Finance Teal',
    description: 'Professionell design i teal för finans och ekonomi',
    preview: 'finance-teal-preview',
    features: ['Teal Färgschema', 'Finans-fokus', 'Stabil Design', 'Pålitlig Känsla'],
    color: '#009688',
    colorName: 'Teal',
  },
  {
    id: 'artistic-indigo',
    name: 'Konstnärlig Indigo',
    description: 'Konstnärlig design med indigo för kreativa yrken',
    preview: 'artistic-indigo-preview',
    features: ['Indigo Palette', 'Artistisk Layout', 'Kreativ Expression', 'Unik Design'],
    color: '#3f51b5',
    colorName: 'Indigo',
  },
  {
    id: 'startup-amber',
    name: 'Startup Amber',
    description: 'Energisk startup-design med amber färg',
    preview: 'startup-amber-preview',
    features: ['Amber Accenter', 'Startup Vibe', 'Dynamisk Layout', 'Entreprenörsanda'],
    color: '#ffc107',
    colorName: 'Amber',
  },
  {
    id: 'luxury-gold',
    name: 'Lyxig Guld',
    description: 'Premium design med guldaccenter för lyxbranscher',
    preview: 'luxury-gold-preview',
    features: ['Guld Accenter', 'Lyx Design', 'Premium Känsla', 'Elegant Style'],
    color: '#f57c00',
    colorName: 'Guld',
  },
  {
    id: 'healthcare-cyan',
    name: 'Vård Cyan',
    description: 'Lugnande design i cyan för vårdyrken',
    preview: 'healthcare-cyan-preview',
    features: ['Cyan Färgschema', 'Vårdande Design', 'Lugn Känsla', 'Medicinsk Focus'],
    color: '#00bcd4',
    colorName: 'Cyan',
  },
  {
    id: 'education-lime',
    name: 'Utbildning Lime',
    description: 'Frisk design i lime för utbildningsområdet',
    preview: 'education-lime-preview',
    features: ['Lime Accenter', 'Utbildnings-fokus', 'Frisk Design', 'Energigivande'],
    color: '#8bc34a',
    colorName: 'Lime',
  },
  {
    id: 'corporate-grey',
    name: 'Företag Grå',
    description: 'Klassisk företagsdesign i grått för traditionella roller',
    preview: 'corporate-grey-preview',
    features: ['Grå Färgschema', 'Företags Style', 'Klassisk Design', 'Professionell'],
    color: '#607d8b',
    colorName: 'Blågrå',
  },
  {
    id: 'gradient-sunset',
    name: 'Solnedgång Gradient',
    description: 'Modern gradient design med solnedgångsfärger',
    preview: 'gradient-sunset-preview',
    features: ['Gradient Bakgrund', 'Solnedgång Färger', 'Modern Design', 'Visuell Impact'],
    color: 'linear-gradient(135deg, #ff6b6b, #ffd93d)',
    colorName: 'Gradient',
  },
  {
    id: 'dark-theme',
    name: 'Mörkt Tema',
    description: 'Elegant mörk design för en modern look',
    preview: 'dark-theme-preview',
    features: ['Mörk Bakgrund', 'Ljus Text', 'Modern Style', 'Tech Vibe'],
    color: '#212121',
    colorName: 'Mörk',
  },
  {
    id: 'pastel-mint',
    name: 'Pastell Mint',
    description: 'Mjuk pastell design i mint för en lugn känsla',
    preview: 'pastel-mint-preview',
    features: ['Pastell Färger', 'Mint Accent', 'Mjuk Design', 'Harmonisk'],
    color: '#a8e6cf',
    colorName: 'Pastell Mint',
  },
  {
    id: 'bold-red',
    name: 'Modig Röd',
    description: 'Kraftfull design i rött för ledarskapsroller',
    preview: 'bold-red-preview',
    features: ['Röd Accent', 'Kraftfull Design', 'Ledarskap Focus', 'Bold Typography'],
    color: '#d32f2f',
    colorName: 'Röd',
  },
  {
    id: 'vintage-brown',
    name: 'Vintage Brun',
    description: 'Klassisk vintage design i bruna toner',
    preview: 'vintage-brown-preview',
    features: ['Vintage Style', 'Bruna Toner', 'Klassisk Design', 'Tidlös Känsla'],
    color: '#8d6e63',
    colorName: 'Brun',
  },
];

const TemplateSelector = ({ selectedTemplate, onChange }) => {
  const renderTemplatePreview = (template) => {
    // Allmän preview för alla templates med färganpassning
    const isGradient = template.color.includes('gradient');
    const isDark = template.id === 'dark-theme';
    
    const previewStyle = {
      p: 2, 
      height: 200, 
      overflow: 'hidden',
      background: isGradient ? template.color : '#fff',
      color: isDark ? '#fff' : '#333',
      border: `3px solid ${isGradient ? 'transparent' : template.color}`,
      borderRadius: 2,
      position: 'relative',
      '&::before': isGradient ? {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '20px',
        background: template.color,
        borderRadius: '4px 4px 0 0'
      } : {}
    };

    return (
      <Paper elevation={1} sx={previewStyle}>
        {/* Färgindikator */}
        <Box 
          sx={{ 
            position: 'absolute',
            top: 8,
            right: 8,
            width: 20,
            height: 20,
            background: isGradient ? 'rgba(255,255,255,0.9)' : template.color,
            borderRadius: '50%',
            border: '2px solid rgba(255,255,255,0.8)',
            ...(isGradient && {
              background: template.color,
              border: '2px solid #fff'
            })
          }} 
        />
        
        {/* CV Header */}
        <Box display="flex" alignItems="center" mb={1}>
          <Avatar 
            sx={{ 
              width: 24, 
              height: 24, 
              mr: 1, 
              bgcolor: template.color.includes('gradient') ? '#1976d2' : template.color,
              border: isDark ? '1px solid #fff' : 'none'
            }} 
          />
          <Box>
            <Typography 
              variant="caption" 
              fontWeight="bold"
              sx={{ color: isDark ? '#fff' : '#333' }}
            >
              Anna Svensson
            </Typography>
            <Typography 
              variant="caption" 
              display="block" 
              sx={{ color: isDark ? '#ccc' : 'text.secondary' }}
            >
              {template.id.includes('tech') ? 'Tech Lead' : 
               template.id.includes('finance') ? 'Financial Analyst' :
               template.id.includes('creative') ? 'UX Designer' :
               template.id.includes('healthcare') ? 'Sjuksköterska' :
               template.id.includes('education') ? 'Lärare' :
               'Projektledare'}
            </Typography>
          </Box>
        </Box>

        {/* Accent Line */}
        <Box 
          sx={{ 
            height: 4, 
            background: isGradient ? 'rgba(255,255,255,0.8)' : template.color, 
            mb: 1, 
            borderRadius: 2,
            opacity: isDark ? 0.8 : 1
          }} 
        />

        {/* Content Sections */}
        <Typography 
          variant="caption" 
          display="block" 
          mb={1}
          sx={{ 
            color: isGradient || isDark ? 'rgba(255,255,255,0.9)' : template.color,
            fontWeight: 600
          }}
        >
          Profil
        </Typography>
        <Box sx={{ height: 2, bgcolor: isDark ? 'rgba(255,255,255,0.3)' : 'grey.300', mb: 1, width: '80%' }} />
        <Box sx={{ height: 2, bgcolor: isDark ? 'rgba(255,255,255,0.3)' : 'grey.300', mb: 1, width: '60%' }} />

        <Typography 
          variant="caption" 
          display="block" 
          mb={1}
          sx={{ 
            color: isGradient || isDark ? 'rgba(255,255,255,0.9)' : template.color,
            fontWeight: 600
          }}
        >
          Arbetslivserfarenhet
        </Typography>
        <Box sx={{ height: 2, bgcolor: isDark ? 'rgba(255,255,255,0.3)' : 'grey.300', mb: 0.5, width: '70%' }} />
        <Box sx={{ height: 2, bgcolor: isDark ? 'rgba(255,255,255,0.3)' : 'grey.300', mb: 1, width: '50%' }} />

        <Typography 
          variant="caption" 
          display="block" 
          mb={1}
          sx={{ 
            color: isGradient || isDark ? 'rgba(255,255,255,0.9)' : template.color,
            fontWeight: 600
          }}
        >
          Färdigheter
        </Typography>

        {/* Skills Progress Bars */}
        <Box display="flex" gap={0.5} mb={1}>
          <Box 
            sx={{ 
              height: 8, 
              background: template.color.includes('gradient') ? 'rgba(255,255,255,0.8)' : template.color, 
              width: 20, 
              borderRadius: 1,
              opacity: isDark ? 0.8 : 1
            }} 
          />
          <Box 
            sx={{ 
              height: 8, 
              background: template.color.includes('gradient') ? 'rgba(255,255,255,0.6)' : `${template.color}80`, 
              width: 15, 
              borderRadius: 1,
              opacity: isDark ? 0.6 : 1
            }} 
          />
          <Box 
            sx={{ 
              height: 8, 
              background: template.color.includes('gradient') ? 'rgba(255,255,255,0.4)' : `${template.color}60`, 
              width: 18, 
              borderRadius: 1,
              opacity: isDark ? 0.4 : 1
            }} 
          />
        </Box>

        {/* Template Style Indicator */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 8,
            left: 8,
            fontSize: '10px',
            color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)',
            fontStyle: 'italic'
          }}
        >
          {template.colorName}
        </Box>
      </Paper>
    );
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Choose Template
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Select a template that best fits your profession and style
      </Typography>

      <Grid container spacing={3}>
        {templates.map((template) => (
          <Grid item xs={12} md={6} key={template.id}>
            <Card 
              variant="outlined"
              sx={{ 
                position: 'relative',
                border: selectedTemplate === template.id ? 2 : 1,
                borderColor: selectedTemplate === template.id ? 'primary.main' : 'divider',
                opacity: template.comingSoon ? 0.7 : 1,
              }}
            >
              <CardActionArea 
                onClick={() => !template.comingSoon && onChange(template.id)}
                disabled={template.comingSoon}
              >
                <CardContent>
                  {/* Selection Indicator */}
                  {selectedTemplate === template.id && (
                    <Box 
                      sx={{ 
                        position: 'absolute', 
                        top: 8, 
                        right: 8, 
                        zIndex: 1 
                      }}
                    >
                      <CheckCircleIcon color="primary" />
                    </Box>
                  )}

                  {/* Template Preview */}
                  <Box mb={2}>
                    {renderTemplatePreview(template)}
                  </Box>

                  {/* Template Info */}
                  <Box>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <Typography variant="h6" component="h3">
                        {template.name}
                      </Typography>
                      {template.comingSoon && (
                        <Chip label="Coming Soon" size="small" color="default" />
                      )}
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {template.description}
                    </Typography>

                    {/* Features */}
                    <Box display="flex" flexWrap="wrap" gap={0.5}>
                      {template.features.map((feature, index) => (
                        <Chip
                          key={index}
                          label={feature}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      ))}
                    </Box>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Template Info */}
      <Box mt={3} p={2} bgcolor="background.paper" borderRadius={1} border="1px solid" borderColor="divider">
        <Typography variant="body2" color="text.secondary">
          <strong>Note:</strong> You can switch between templates at any time. Your content will be automatically 
          adapted to the selected template style. More templates are coming soon!
        </Typography>
      </Box>
    </Box>
  );
};

export default TemplateSelector;

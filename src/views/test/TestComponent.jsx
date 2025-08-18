import React from 'react';
import { Typography, Box, Alert } from '@mui/material';

const TestComponent = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Alert severity="success" sx={{ mb: 2 }}>
        ✅ Component loaded successfully!
      </Alert>
      <Typography variant="h4" gutterBottom>
        Test Component
      </Typography>
      <Typography variant="body1">
        This component was loaded using lazy loading and should work properly.
      </Typography>
    </Box>
  );
};

export default TestComponent;

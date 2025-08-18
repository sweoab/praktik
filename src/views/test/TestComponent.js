import React from 'react';
import { Typography, Box } from '@mui/material';

const TestComponent = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" color="primary">
        Test Component - Site is Working!
      </Typography>
      <Typography variant="body1">
        If you can see this, the React app is loading correctly.
      </Typography>
    </Box>
  );
};

export default TestComponent;

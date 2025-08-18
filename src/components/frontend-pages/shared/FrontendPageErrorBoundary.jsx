import React, { Component } from 'react';
import { Box, Typography, Button, Container } from '@mui/material';

class FrontendPageErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Frontend page error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
          <Box>
            <Typography variant="h3" gutterBottom color="error">
              Oops! Something went wrong
            </Typography>
            <Typography variant="h6" gutterBottom sx={{ mb: 4 }}>
              This frontend page encountered an error and couldn't load properly.
            </Typography>
            <Box sx={{ mb: 4, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="body2" component="pre" sx={{ textAlign: 'left', fontSize: '0.8rem' }}>
                {this.state.error && this.state.error.toString()}
              </Typography>
            </Box>
            <Button 
              variant="contained" 
              onClick={() => window.location.reload()}
              sx={{ mr: 2 }}
            >
              Reload Page
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default FrontendPageErrorBoundary;

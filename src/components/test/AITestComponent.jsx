import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';

const AITestComponent = () => {
  const [testMessage, setTestMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const testAIConnection = async () => {
    setLoading(true);
    setError('');
    setResponse('');

    try {
      const res = await fetch('https://yazan-me7jxcy8-eastus2.cognitiveservices.azure.com/openai/deployments/gpt-35-turbo/chat/completions?api-version=2025-01-01-preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.REACT_APP_AZURE_OPENAI_KEY,
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: testMessage || 'Hej, kan du presentera dig själv?',
            },
          ],
          max_tokens: 100,
          temperature: 0.7,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setResponse(data.choices[0].message.content);
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        AI API Test
      </Typography>
      
      <TextField
        fullWidth
        label="Test meddelande"
        value={testMessage}
        onChange={(e) => setTestMessage(e.target.value)}
        sx={{ mb: 2 }}
        placeholder="Lämna tom för standardmeddelande"
      />
      
      <Button
        variant="contained"
        onClick={testAIConnection}
        disabled={loading}
        sx={{ mb: 2 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Testa AI-anslutning'}
      </Button>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {response && (
        <Paper sx={{ p: 2, bgcolor: 'grey.100' }}>
          <Typography variant="h6" gutterBottom>
            AI Svar:
          </Typography>
          <Typography variant="body1">
            {response}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default AITestComponent;

import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Send as SendIcon,
  Person as PersonIcon,
  SmartToy as AIIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
  Psychology as PsychologyIcon,
  Clear as ClearIcon,
  ContentCopy as CopyIcon,
} from '@mui/icons-material';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/components/container/PageContainer';
import AppCard from '@/components/shared/AppCard';
import { useTranslation } from 'react-i18next';
import './AIChat.css';

const AIChat = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: t('aiChat.welcomeMessage'),
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const BCrumb = [
    {
      to: '/',
      title: 'Hem',
    },
    {
      title: 'AI-Assistent',
    },
  ];

  const quickActions = [
    { label: t('aiChat.writePersonalLetter'), icon: <SchoolIcon />, prompt: t('aiChat.quickPrompts.personalLetter') },
    { label: t('aiChat.findInternships'), icon: <BusinessIcon />, prompt: t('aiChat.quickPrompts.findInternships') },
    { label: t('aiChat.prepareInterview'), icon: <PsychologyIcon />, prompt: t('aiChat.quickPrompts.prepareInterview') },
    { label: t('aiChat.cvTips'), icon: <PersonIcon />, prompt: t('aiChat.quickPrompts.cvTips') },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessageToAI = async (message) => {
    try {
      const response = await fetch('https://yazan-me7jxcy8-eastus2.cognitiveservices.azure.com/openai/deployments/gpt-35-turbo/chat/completions?api-version=2025-01-01-preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.REACT_APP_AZURE_OPENAI_KEY,
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `Du är en hjälpsam AI-assistent som specialiserat sig på att hjälpa studenter, företagare och lärare med praktikfrågor. Du kan hjälpa med:

1. Att skriva personliga brev och ansökningar
2. CV-förbättringar och tips
3. Förbereda för praktikintervjuer
4. Hitta lämpliga praktikplatser
5. Förstå praktikprocessen
6. Svara på allmänna frågor om utbildning och karriär
7. Hjälpa med applikationens funktioner
8. Ge råd om arbetsmiljö och professionellt beteende
9. Hjälpa med ansökningsprocesser
10. Förklara arbetsrättsliga frågor för praktikanter

Svara alltid på svenska och var vänlig, professionell och hjälpsam. Ge konkreta och användbara råd. Om användaren frågar om specifika företag eller platser, uppmuntra dem att använda praktikapplikationens sökfunktioner.`,
            },
            {
              role: 'user',
              content: message,
            },
          ],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling AI API:', error);
      throw error;
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const aiResponse = await sendMessageToAI(inputMessage);
      
      const aiMessage = {
        id: Date.now() + 1,
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setError(t('aiChat.errorMessage'));
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (prompt) => {
    setInputMessage(prompt);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        text: t('aiChat.welcomeMessage'),
        sender: 'ai',
        timestamp: new Date(),
      },
    ]);
    setError(null);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      // Optionally show a toast notification here
    });
  };

  return (
    <PageContainer title={t('aiChat.title')} description={t('aiChat.subtitle')}>
      <Breadcrumb title={t('aiChat.title')} items={BCrumb} />
      <AppCard>
        <Box sx={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AIIcon color="primary" />
                {t('aiChat.title')}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {t('aiChat.subtitle')}
              </Typography>
            </Box>
            <Tooltip title="Rensa chatt">
              <IconButton onClick={clearChat} color="primary">
                <ClearIcon />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Quick Actions */}
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {t('aiChat.quickActions')}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {quickActions.map((action, index) => (
                <Chip
                  key={index}
                  icon={action.icon}
                  label={action.label}
                  onClick={() => handleQuickAction(action.prompt)}
                  variant="outlined"
                  clickable
                  size="small"
                />
              ))}
            </Box>
          </Box>

          {/* Messages Area */}
          <Box
            sx={{
              flex: 1,
              overflow: 'auto',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            {messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  display: 'flex',
                  gap: 1,
                  alignItems: 'flex-start',
                  justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                {message.sender === 'ai' && (
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <AIIcon />
                  </Avatar>
                )}
                
                <Paper
                  sx={{
                    p: 2,
                    maxWidth: '70%',
                    bgcolor: message.sender === 'user' ? 'primary.main' : 'grey.100',
                    color: message.sender === 'user' ? 'white' : 'text.primary',
                    position: 'relative',
                    '&:hover .copy-button': {
                      opacity: 1,
                    },
                  }}
                >
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {message.text}
                  </Typography>
                  {message.sender === 'ai' && (
                    <IconButton
                      size="small"
                      className="copy-button"
                      onClick={() => copyToClipboard(message.text)}
                      sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        opacity: 0,
                        transition: 'opacity 0.2s',
                        bgcolor: 'rgba(255,255,255,0.8)',
                        '&:hover': { bgcolor: 'rgba(255,255,255,1)' },
                      }}
                    >
                      <CopyIcon fontSize="small" />
                    </IconButton>
                  )}
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      mt: 1,
                      opacity: 0.7,
                    }}
                  >
                    {message.timestamp.toLocaleTimeString('sv-SE', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Typography>
                </Paper>

                {message.sender === 'user' && (
                  <Avatar sx={{ bgcolor: 'secondary.main' }}>
                    <PersonIcon />
                  </Avatar>
                )}
              </Box>
            ))}

            {isLoading && (
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <AIIcon />
                </Avatar>
                <Paper sx={{ p: 2, bgcolor: 'grey.100' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={16} />
                    <Typography variant="body2">{t('aiChat.thinking')}</Typography>
                  </Box>
                </Paper>
              </Box>
            )}

            <div ref={messagesEndRef} />
          </Box>

          {/* Error Display */}
          {error && (
            <Box sx={{ p: 2 }}>
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            </Box>
          )}

          {/* Input Area */}
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                multiline
                maxRows={4}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t('aiChat.placeholder')}
                disabled={isLoading}
                variant="outlined"
                size="small"
              />
              <Button
                variant="contained"
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                sx={{ minWidth: 'auto', px: 2 }}
              >
                <SendIcon />
              </Button>
            </Box>
          </Box>
        </Box>
      </AppCard>
    </PageContainer>
  );
};

export default AIChat;

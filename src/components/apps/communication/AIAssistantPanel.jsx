import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Avatar,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab,
  Collapse,
  Alert,
  CircularProgress,
  Paper,
  Divider,
  Stack,
  useTheme
} from '@mui/material';
import {
  SmartToy,
  Send,
  Mic,
  MicOff,
  Schedule,
  NotificationAdd,
  AutoAwesome,
  Psychology,
  TrendingUp,
  Lightbulb,
  Assignment,
  Event,
  Close,
  Add,
  CheckCircle,
  Warning,
  Info,
  Error
} from '@mui/icons-material';
import { format, addDays, addHours, parseISO } from 'date-fns';
import { sv } from 'date-fns/locale';

import { useCommunication } from '@/context/CommunicationContext';
import SmartNotificationsManager from './SmartNotificationsManager';

const AIAssistantPanel = () => {
  const theme = useTheme();
  const { aiAssistant, createAIReminder, analyzeWorkflow, getAISuggestions } = useCommunication();
  
  // Chat states
  const [chatMessages, setChatMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  // AI features states
  const [reminders, setReminders] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [workflowAnalysis, setWorkflowAnalysis] = useState(null);
  const [showReminderDialog, setShowReminderDialog] = useState(false);
  const [newReminder, setNewReminder] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    category: 'general'
  });
  
  const chatRef = useRef(null);
  const recognition = useRef(null);

  // Initialize AI assistant on component mount
  useEffect(() => {
    loadAIData();
    initializeSpeechRecognition();
    
    // Add welcome message
    setChatMessages([{
      id: 1,
      type: 'ai',
      content: 'Hej! Jag är din AI-assistent. Jag kan hjälpa dig med påminnelser, analysera ditt arbetsflöde och ge smarta förslag. Vad kan jag hjälpa dig med?',
      timestamp: new Date(),
      suggestions: [
        'Skapa en påminnelse',
        'Analysera mitt arbetsflöde',
        'Visa dagens uppgifter',
        'Ge mig förslag för förbättringar'
      ]
    }]);
  }, []);

  const loadAIData = async () => {
    try {
      // Load existing reminders and suggestions
      const aiData = await aiAssistant.loadData();
      setReminders(aiData.reminders || []);
      setSuggestions(aiData.suggestions || []);
      setWorkflowAnalysis(aiData.workflowAnalysis);
    } catch (error) {
      console.error('Failed to load AI data:', error);
    }
  };

  const initializeSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window) {
      recognition.current = new window.webkitSpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      recognition.current.lang = 'sv-SE';
      
      recognition.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };
      
      recognition.current.onerror = () => {
        setIsListening(false);
      };
    }
  };

  const toggleSpeechRecognition = () => {
    if (!recognition.current) return;
    
    if (isListening) {
      recognition.current.stop();
      setIsListening(false);
    } else {
      recognition.current.start();
      setIsListening(true);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Simulate AI processing
      const aiResponse = await processAIMessage(inputMessage);
      
      setTimeout(() => {
        const aiMessage = {
          id: Date.now() + 1,
          type: 'ai',
          content: aiResponse.content,
          timestamp: new Date(),
          actions: aiResponse.actions,
          suggestions: aiResponse.suggestions
        };
        
        setChatMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
        
        // Execute any actions
        if (aiResponse.actions) {
          executeAIActions(aiResponse.actions);
        }
      }, 1500);
      
    } catch (error) {
      setIsTyping(false);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: 'Ursäkta, jag kunde inte bearbeta din begäran just nu. Försök igen senare.',
        timestamp: new Date(),
        isError: true
      };
      setChatMessages(prev => [...prev, errorMessage]);
    }
  };

  const processAIMessage = async (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Smart reminder creation
    if (lowerMessage.includes('påminnelse') || lowerMessage.includes('reminder')) {
      return {
        content: 'Jag hjälper dig skapa en påminnelse. Vad vill du bli påmind om och när?',
        actions: ['show_reminder_dialog'],
        suggestions: ['Imorgon kl 09:00', 'Nästa vecka', 'Om en timme', 'Anpassad tid']
      };
    }
    
    // Workflow analysis
    if (lowerMessage.includes('analysera') || lowerMessage.includes('arbetsflöde') || lowerMessage.includes('workflow')) {
      const analysis = await analyzeWorkflow();
      return {
        content: `Baserat på din aktivitet de senaste dagarna har jag analyserat ditt arbetsflöde:\n\n${analysis.summary}\n\nVill du se detaljerade förslag för förbättringar?`,
        actions: ['show_workflow_analysis'],
        suggestions: ['Visa förslag', 'Skapa handlingsplan', 'Exportera rapport']
      };
    }
    
    // Daily tasks and schedule
    if (lowerMessage.includes('dagens') || lowerMessage.includes('idag') || lowerMessage.includes('schema')) {
      return {
        content: 'Här är din översikt för idag:\n• 3 möten planerade\n• 5 olästa notifieringar\n• 2 påminnelser\n• 1 deadline imorgon\n\nVill du att jag prioriterar dina uppgifter?',
        suggestions: ['Prioritera uppgifter', 'Visa kalendern', 'Skapa påminnelse', 'Planera dagen']
      };
    }
    
    // Smart suggestions
    if (lowerMessage.includes('förslag') || lowerMessage.includes('tips') || lowerMessage.includes('förbättra')) {
      const suggestions = await getAISuggestions();
      return {
        content: `Här är mina smarta förslag baserat på dina mönster:\n\n${suggestions.map(s => `• ${s.title}: ${s.description}`).join('\n')}\n\nVill du implementera något av dessa?`,
        suggestions: suggestions.map(s => s.title)
      };
    }
    
    // Default response
    return {
      content: 'Jag förstår. Jag kan hjälpa dig med:\n• Skapa smarta påminnelser\n• Analysera ditt arbetsflöde\n• Ge personliga förslag\n• Planera din dag\n• Organisera uppgifter\n\nVad vill du börja med?',
      suggestions: ['Skapa påminnelse', 'Analysera arbetsflöde', 'Visa förslag', 'Planera dagen']
    };
  };

  const executeAIActions = (actions) => {
    actions.forEach(action => {
      switch (action) {
        case 'show_reminder_dialog':
          setShowReminderDialog(true);
          break;
        case 'show_workflow_analysis':
          // Could open a detailed analysis view
          break;
        default:
          break;
      }
    });
  };

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
    sendMessage();
  };

  const createReminder = async () => {
    try {
      const reminder = await createAIReminder(newReminder);
      setReminders(prev => [...prev, reminder]);
      setShowReminderDialog(false);
      setNewReminder({
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium',
        category: 'general'
      });
      
      // Add confirmation message to chat
      const confirmMessage = {
        id: Date.now(),
        type: 'ai',
        content: `Påminnelse skapad! Jag kommer påminna dig om "${reminder.title}" ${format(new Date(reminder.dueDate), 'PPP', { locale: sv })}.`,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, confirmMessage]);
      
    } catch (error) {
      console.error('Failed to create reminder:', error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'meeting': return <Event />;
      case 'deadline': return <Assignment />;
      case 'personal': return <Person />;
      default: return <Schedule />;
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* AI Assistant Header */}
      <Card>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
              <SmartToy />
            </Avatar>
          }
          title="AI-Assistent"
          subheader="Din smarta kommunikationspartner"
          action={
            <Chip
              icon={<AutoAwesome />}
              label="Aktiv"
              color="primary"
              variant="outlined"
            />
          }
        />
      </Card>

      {/* Smart Notifications Manager */}
      <SmartNotificationsManager />

      {/* Active Reminders */}
      {reminders.length > 0 && (
        <Card>
          <CardHeader
            title="Aktiva Påminnelser"
            subheader={`${reminders.length} påminnelser`}
            avatar={<Schedule color="primary" />}
          />
          <CardContent sx={{ pt: 0 }}>
            <List dense>
              {reminders.slice(0, 3).map((reminder) => (
                <ListItem key={reminder.id}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: theme.palette[getPriorityColor(reminder.priority)].main }}>
                      {getCategoryIcon(reminder.category)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={reminder.title}
                    secondary={`${format(new Date(reminder.dueDate), 'PPp', { locale: sv })} • ${reminder.category}`}
                  />
                  <ListItemSecondaryAction>
                    <Chip
                      label={reminder.priority}
                      color={getPriorityColor(reminder.priority)}
                      size="small"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {/* Chat Interface */}
      <Card sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <CardHeader
          title="AI-Chat"
          subheader="Prata med din assistent"
          action={
            <IconButton onClick={toggleSpeechRecognition} color={isListening ? "error" : "default"}>
              {isListening ? <MicOff /> : <Mic />}
            </IconButton>
          }
        />
        
        {/* Messages */}
        <CardContent sx={{ flex: 1, overflow: 'auto' }} ref={chatRef}>
          <List>
            {chatMessages.map((message) => (
              <ListItem key={message.id} sx={{ 
                flexDirection: 'column', 
                alignItems: message.type === 'user' ? 'flex-end' : 'flex-start',
                mb: 1
              }}>
                <Paper
                  sx={{
                    p: 2,
                    maxWidth: '80%',
                    bgcolor: message.type === 'user' 
                      ? theme.palette.primary.main 
                      : message.isError 
                        ? theme.palette.error.main 
                        : theme.palette.grey[100],
                    color: message.type === 'user' || message.isError ? 'white' : 'text.primary'
                  }}
                >
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                    {message.content}
                  </Typography>
                  
                  {/* AI Suggestions */}
                  {message.suggestions && (
                    <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', gap: 1 }}>
                      {message.suggestions.map((suggestion, index) => (
                        <Chip
                          key={index}
                          label={suggestion}
                          size="small"
                          variant="outlined"
                          onClick={() => handleSuggestionClick(suggestion)}
                          sx={{ 
                            color: message.type === 'user' ? 'white' : 'primary.main',
                            borderColor: message.type === 'user' ? 'white' : 'primary.main'
                          }}
                        />
                      ))}
                    </Stack>
                  )}
                </Paper>
                
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                  {format(message.timestamp, 'HH:mm', { locale: sv })}
                </Typography>
              </ListItem>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <ListItem sx={{ alignItems: 'flex-start' }}>
                <Paper sx={{ p: 2, bgcolor: theme.palette.grey[100] }}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <CircularProgress size={16} />
                    <Typography variant="body2" color="text.secondary">
                      AI-assistenten skriver...
                    </Typography>
                  </Box>
                </Paper>
              </ListItem>
            )}
          </List>
        </CardContent>
        
        {/* Input Area */}
        <Divider />
        <Box sx={{ p: 2 }}>
          <Box display="flex" gap={1}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Skriv ditt meddelande..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              size="small"
            />
            <Button
              variant="contained"
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isTyping}
              sx={{ minWidth: 'auto', px: 2 }}
            >
              <Send />
            </Button>
          </Box>
        </Box>
      </Card>

      {/* Quick Actions FAB */}
      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setShowReminderDialog(true)}
      >
        <Add />
      </Fab>

      {/* Reminder Creation Dialog */}
      <Dialog
        open={showReminderDialog}
        onClose={() => setShowReminderDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Skapa Påminnelse
          <IconButton
            sx={{ position: 'absolute', right: 8, top: 8 }}
            onClick={() => setShowReminderDialog(false)}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Titel"
              value={newReminder.title}
              onChange={(e) => setNewReminder(prev => ({ ...prev, title: e.target.value }))}
            />
            
            <TextField
              fullWidth
              label="Beskrivning"
              multiline
              rows={3}
              value={newReminder.description}
              onChange={(e) => setNewReminder(prev => ({ ...prev, description: e.target.value }))}
            />
            
            <TextField
              fullWidth
              label="Datum och tid"
              type="datetime-local"
              value={newReminder.dueDate}
              onChange={(e) => setNewReminder(prev => ({ ...prev, dueDate: e.target.value }))}
              InputLabelProps={{ shrink: true }}
            />
            
            <TextField
              fullWidth
              label="Prioritet"
              select
              value={newReminder.priority}
              onChange={(e) => setNewReminder(prev => ({ ...prev, priority: e.target.value }))}
              SelectProps={{ native: true }}
            >
              <option value="low">Låg</option>
              <option value="medium">Medium</option>
              <option value="high">Hög</option>
            </TextField>
            
            <TextField
              fullWidth
              label="Kategori"
              select
              value={newReminder.category}
              onChange={(e) => setNewReminder(prev => ({ ...prev, category: e.target.value }))}
              SelectProps={{ native: true }}
            >
              <option value="general">Allmänt</option>
              <option value="meeting">Möte</option>
              <option value="deadline">Deadline</option>
              <option value="personal">Personligt</option>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowReminderDialog(false)}>
            Avbryt
          </Button>
          <Button
            onClick={createReminder}
            variant="contained"
            disabled={!newReminder.title || !newReminder.dueDate}
          >
            Skapa Påminnelse
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AIAssistantPanel;

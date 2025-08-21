import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Avatar,
  LinearProgress,
  Divider,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  SmartToy,
  Psychology,
  Lightbulb,
  Schedule,
  TrendingUp,
  Add,
  Edit,
  Delete,
  CheckCircle,
  Warning,
  Info,
  Settings,
  Refresh,
  Chat,
  Analytics
} from '@mui/icons-material';
import { useCommunication } from '../../../context/CommunicationContext';

const AIAssistantPanel = () => {
  const { t } = useTranslation();
  const {
    aiAssistant,
    createAIReminder,
    analyzeWorkflow,
    getAISuggestions,
    generateSmartNotification
  } = useCommunication();
  
  const [openReminderDialog, setOpenReminderDialog] = useState(false);
  const [openSettingsDialog, setOpenSettingsDialog] = useState(false);
  const [reminderForm, setReminderForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium'
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  const handleCreateReminder = async () => {
    if (!reminderForm.title.trim()) return;

    await createAIReminder(reminderForm);
    setReminderForm({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium'
    });
    setOpenReminderDialog(false);
  };

  const handleAnalyzeWorkflow = async () => {
    setIsAnalyzing(true);
    await analyzeWorkflow();
    setIsAnalyzing(false);
  };

  const handleGetSuggestions = async () => {
    setIsLoadingSuggestions(true);
    await getAISuggestions();
    setIsLoadingSuggestions(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getImpactIcon = (impact) => {
    switch (impact) {
      case 'high': return <TrendingUp color="success" />;
      case 'medium': return <Info color="info" />;
      case 'low': return <Warning color="warning" />;
      default: return <Info />;
    }
  };

  return (
    <Box sx={{ p: 0 }}>
      <Grid container spacing={3}>
        {/* AI Assistant Header */}
        <Grid item xs={12}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                    <SmartToy />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      AI-Assistent
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Din smarta partner för produktivitet och automation
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <IconButton 
                    color="inherit" 
                    onClick={() => setOpenSettingsDialog(true)}
                    sx={{ mr: 1 }}
                  >
                    <Settings />
                  </IconButton>
                  <IconButton color="inherit" onClick={handleGetSuggestions}>
                    <Refresh />
                  </IconButton>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Snabbåtgärder
              </Typography>
              <Box display="flex" gap={2} flexWrap="wrap">
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setOpenReminderDialog(true)}
                >
                  Skapa påminnelse
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Analytics />}
                  onClick={handleAnalyzeWorkflow}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? 'Analyserar...' : 'Analysera arbetsflöde'}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Lightbulb />}
                  onClick={handleGetSuggestions}
                  disabled={isLoadingSuggestions}
                >
                  {isLoadingSuggestions ? 'Hämtar...' : 'Få förslag'}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Chat />}
                  onClick={() => generateSmartNotification({
                    title: 'Smart påminnelse',
                    message: 'Din AI-assistent har förslag för dig',
                    category: 'ai',
                    priority: 'medium'
                  })}
                >
                  Smart notis
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Active Reminders */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="between" mb={2}>
                <Typography variant="h6">
                  Aktiva påminnelser ({aiAssistant.reminders.length})
                </Typography>
              </Box>
              
              {aiAssistant.reminders.length === 0 ? (
                <Alert severity="info">
                  Inga aktiva påminnelser. Skapa en ny för att komma igång!
                </Alert>
              ) : (
                <List>
                  {aiAssistant.reminders.map((reminder) => (
                    <ListItem key={reminder.id} divider>
                      <ListItemIcon>
                        <Schedule color={getPriorityColor(reminder.priority)} />
                      </ListItemIcon>
                      <ListItemText
                        primary={reminder.title}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {reminder.description}
                            </Typography>
                            {reminder.dueDate && (
                              <Typography variant="caption" color="text.secondary">
                                Förfaller: {new Date(reminder.dueDate).toLocaleDateString()}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Chip 
                          label={reminder.priority} 
                          size="small" 
                          color={getPriorityColor(reminder.priority)}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* AI Suggestions */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                AI-förslag
              </Typography>
              
              {aiAssistant.suggestions.length === 0 ? (
                <Alert severity="info">
                  Klicka på "Få förslag" för personliga rekommendationer
                </Alert>
              ) : (
                <List>
                  {aiAssistant.suggestions.map((suggestion) => (
                    <ListItem key={suggestion.id} divider>
                      <ListItemIcon>
                        {getImpactIcon(suggestion.impact)}
                      </ListItemIcon>
                      <ListItemText
                        primary={suggestion.title}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {suggestion.description}
                            </Typography>
                            <Box display="flex" gap={1} mt={1}>
                              <Chip 
                                label={suggestion.category} 
                                size="small" 
                                variant="outlined"
                              />
                              <Chip 
                                label={`${suggestion.priority} prioritet`} 
                                size="small" 
                                color={getPriorityColor(suggestion.priority)}
                              />
                              <Chip 
                                label={`${suggestion.impact} påverkan`} 
                                size="small" 
                                variant="outlined"
                              />
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Workflow Analysis */}
        {aiAssistant.workflowAnalysis && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Arbetsflödesanalys
                </Typography>
                
                <Box mb={3}>
                  <Typography variant="body1" paragraph>
                    {aiAssistant.workflowAnalysis.summary}
                  </Typography>
                  
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Typography variant="body2">Effektivitet:</Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={aiAssistant.workflowAnalysis.efficiency} 
                      sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="body2" fontWeight="bold">
                      {aiAssistant.workflowAnalysis.efficiency}%
                    </Typography>
                  </Box>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      Insikter
                    </Typography>
                    <List dense>
                      {aiAssistant.workflowAnalysis.insights.map((insight, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <Psychology color="primary" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText 
                            primary={insight}
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      Rekommendationer
                    </Typography>
                    <List dense>
                      {aiAssistant.workflowAnalysis.suggestions.map((suggestion, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <Lightbulb color="warning" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText 
                            primary={suggestion}
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Create Reminder Dialog */}
      <Dialog 
        open={openReminderDialog} 
        onClose={() => setOpenReminderDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Skapa ny påminnelse</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Titel"
              value={reminderForm.title}
              onChange={(e) => setReminderForm({...reminderForm, title: e.target.value})}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Beskrivning"
              multiline
              rows={3}
              value={reminderForm.description}
              onChange={(e) => setReminderForm({...reminderForm, description: e.target.value})}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Förfallodatum"
              type="datetime-local"
              value={reminderForm.dueDate}
              onChange={(e) => setReminderForm({...reminderForm, dueDate: e.target.value})}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Prioritet</InputLabel>
              <Select
                value={reminderForm.priority}
                onChange={(e) => setReminderForm({...reminderForm, priority: e.target.value})}
                label="Prioritet"
              >
                <MenuItem value="low">Låg</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">Hög</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReminderDialog(false)}>
            Avbryt
          </Button>
          <Button 
            onClick={handleCreateReminder}
            variant="contained"
            disabled={!reminderForm.title.trim()}
          >
            Skapa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog 
        open={openSettingsDialog} 
        onClose={() => setOpenSettingsDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>AI-Assistent inställningar</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Aktivera smarta påminnelser"
            />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Automatisk arbetsflödesanalys"
            />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Personliga förslag"
            />
            <FormControlLabel
              control={<Switch />}
              label="Experimentella funktioner"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSettingsDialog(false)}>
            Stäng
          </Button>
          <Button variant="contained">
            Spara
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AIAssistantPanel;

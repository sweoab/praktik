import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Button,
  IconButton,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Stack,
  Alert,
  useTheme
} from '@mui/material';
import {
  SmartToy,
  Schedule,
  TrendingUp,
  Lightbulb,
  Settings,
  NotificationAdd,
  Psychology,
  AutoAwesome,
  Assignment,
  Event,
  CheckCircle,
  Close,
  Tune
} from '@mui/icons-material';

import { useCommunication } from '@/context/CommunicationContext';

const SmartNotificationsManager = () => {
  const theme = useTheme();
  const { generateSmartNotification, aiAssistant } = useCommunication();
  
  const [smartSettings, setSmartSettings] = useState({
    workflowAnalysis: true,
    meetingReminders: true,
    deadlineAlerts: true,
    productivityTips: true,
    breakReminders: true,
    focusTimeProtection: true
  });
  
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [generatedNotifications, setGeneratedNotifications] = useState([]);

  // Smart notification patterns
  const notificationPatterns = [
    {
      id: 'focus_time',
      name: 'Fokustid-påminnelser',
      description: 'Föreslår fokustid baserat på ditt schema',
      trigger: 'calendar_gaps',
      frequency: 'daily',
      enabled: smartSettings.focusTimeProtection
    },
    {
      id: 'meeting_prep',
      name: 'Mötesförberedelser',
      description: 'Påminner om att förbereda sig för möten',
      trigger: 'before_meetings',
      frequency: 'as_needed',
      enabled: smartSettings.meetingReminders
    },
    {
      id: 'productivity_insights',
      name: 'Produktivitetsinsikter',
      description: 'Veckovis analys av din produktivitet',
      trigger: 'weekly',
      frequency: 'weekly',
      enabled: smartSettings.productivityTips
    },
    {
      id: 'break_reminders',
      name: 'Vilopaus-påminnelser',
      description: 'Föreslår pauser baserat på aktivitet',
      trigger: 'long_work_sessions',
      frequency: 'as_needed',
      enabled: smartSettings.breakReminders
    },
    {
      id: 'deadline_forecast',
      name: 'Deadline-prognoser',
      description: 'Förutsäger deadlines baserat på projektmönster',
      trigger: 'project_analysis',
      frequency: 'daily',
      enabled: smartSettings.deadlineAlerts
    }
  ];

  // Generate smart notifications based on user patterns
  useEffect(() => {
    const generateSmartNotifications = () => {
      const currentHour = new Date().getHours();
      const currentDay = new Date().getDay();
      
      // Morning productivity reminder
      if (currentHour === 9 && smartSettings.productivityTips) {
        generateSmartNotification({
          title: 'Morgon-fokus',
          message: 'Du är mest produktiv mellan 09:00-11:00. Planera viktiga uppgifter nu!',
          category: 'productivity',
          priority: 'medium'
        });
      }
      
      // Afternoon break reminder
      if (currentHour === 14 && smartSettings.breakReminders) {
        generateSmartNotification({
          title: 'Dags för en paus',
          message: 'Du har arbetat i 3 timmar. En 10-minuters paus kan öka din produktivitet.',
          category: 'wellness',
          priority: 'low'
        });
      }
      
      // Weekly workflow analysis (Fridays)
      if (currentDay === 5 && currentHour === 16 && smartSettings.workflowAnalysis) {
        generateSmartNotification({
          title: 'Veckoanalys klar',
          message: 'Din AI-assistent har analyserat veckans arbetsflöde. Se insikter och förslag.',
          category: 'analysis',
          priority: 'medium'
        });
      }
      
      // Meeting preparation reminder
      if (smartSettings.meetingReminders) {
        generateSmartNotification({
          title: 'Möte inom 30 minuter',
          message: 'Projektmöte med utvecklingsteamet. Glöm inte att förbereda statusrapport.',
          category: 'meeting',
          priority: 'high'
        });
      }
    };

    // Set up intelligent notification scheduling
    const interval = setInterval(generateSmartNotifications, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [smartSettings, generateSmartNotification]);

  const handleSettingChange = (setting) => (event) => {
    setSmartSettings(prev => ({
      ...prev,
      [setting]: event.target.checked
    }));
  };

  const testSmartNotification = (pattern) => {
    const testNotifications = {
      focus_time: {
        title: 'Optimal fokustid upptäckt',
        message: 'Du har 2 timmar ledigt mellan möten. Perfekt för djuparbete!',
        category: 'productivity',
        priority: 'medium'
      },
      meeting_prep: {
        title: 'Mötesförberedelse',
        message: 'Möte med kund om 1 timme. Kontrollera att alla dokument är klara.',
        category: 'meeting',
        priority: 'high'
      },
      productivity_insights: {
        title: 'Veckoinsikter',
        message: 'Din produktivitet ökade med 15% denna vecka! Främst tack vare färre avbrott.',
        category: 'insights',
        priority: 'medium'
      },
      break_reminders: {
        title: 'Pausrekommendation',
        message: 'Du har arbetat intensivt i 2,5 timmar. En kort promenad skulle hjälpa.',
        category: 'wellness',
        priority: 'low'
      },
      deadline_forecast: {
        title: 'Deadline-varning',
        message: 'Baserat på nuvarande tempo riskerar du att missa deadline för Projekt X.',
        category: 'warning',
        priority: 'high'
      }
    };

    const notification = testNotifications[pattern.id];
    if (notification) {
      generateSmartNotification(notification);
    }
  };

  return (
    <Box>
      {/* Smart Notifications Overview */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>
                <Psychology />
              </Avatar>
              <Box>
                <Typography variant="h6">Smarta Notifieringar</Typography>
                <Typography variant="body2" color="text.secondary">
                  AI-driven påminnelser och insikter
                </Typography>
              </Box>
            </Box>
            <Box>
              <IconButton onClick={() => setSettingsOpen(true)}>
                <Settings />
              </IconButton>
            </Box>
          </Box>

          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              Din AI-assistent lär sig av dina mönster och genererar relevanta påminnelser automatiskt.
            </Typography>
          </Alert>

          {/* Quick Stats */}
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <Chip
              icon={<CheckCircle />}
              label={`${notificationPatterns.filter(p => p.enabled).length} aktiva mönster`}
              color="success"
              variant="outlined"
            />
            <Chip
              icon={<TrendingUp />}
              label="89% träffsäkerhet"
              color="primary"
              variant="outlined"
            />
            <Chip
              icon={<AutoAwesome />}
              label="15% produktivitetsökning"
              color="secondary"
              variant="outlined"
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Active Notification Patterns */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Aktiva AI-mönster
          </Typography>
          
          <List>
            {notificationPatterns.map((pattern, index) => (
              <React.Fragment key={pattern.id}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ 
                      bgcolor: pattern.enabled 
                        ? theme.palette.success.main 
                        : theme.palette.grey[400] 
                    }}>
                      {pattern.id === 'focus_time' && <Lightbulb />}
                      {pattern.id === 'meeting_prep' && <Event />}
                      {pattern.id === 'productivity_insights' && <TrendingUp />}
                      {pattern.id === 'break_reminders' && <Schedule />}
                      {pattern.id === 'deadline_forecast' && <Assignment />}
                    </Avatar>
                  </ListItemAvatar>
                  
                  <ListItemText
                    primary={pattern.name}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {pattern.description}
                        </Typography>
                        <Box display="flex" gap={1} mt={0.5}>
                          <Chip
                            label={`Trigger: ${pattern.trigger}`}
                            size="small"
                            variant="outlined"
                          />
                          <Chip
                            label={pattern.frequency}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      </Box>
                    }
                  />
                  
                  <Box display="flex" alignItems="center" gap={1}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => testSmartNotification(pattern)}
                      disabled={!pattern.enabled}
                    >
                      Testa
                    </Button>
                    <Switch
                      checked={pattern.enabled}
                      onChange={handleSettingChange(pattern.id.replace('_', ''))}
                      size="small"
                    />
                  </Box>
                </ListItem>
                {index < notificationPatterns.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Settings Dialog */}
      <Dialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <Tune />
            Smart Notifiering Inställningar
          </Box>
          <IconButton
            sx={{ position: 'absolute', right: 8, top: 8 }}
            onClick={() => setSettingsOpen(false)}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Anpassa vilka typer av smarta notifieringar du vill få från din AI-assistent.
          </Typography>
          
          <Stack spacing={2} sx={{ mt: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={smartSettings.workflowAnalysis}
                  onChange={handleSettingChange('workflowAnalysis')}
                />
              }
              label="Arbetsflödesanalys"
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={smartSettings.meetingReminders}
                  onChange={handleSettingChange('meetingReminders')}
                />
              }
              label="Mötespåminnelser"
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={smartSettings.deadlineAlerts}
                  onChange={handleSettingChange('deadlineAlerts')}
                />
              }
              label="Deadline-varningar"
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={smartSettings.productivityTips}
                  onChange={handleSettingChange('productivityTips')}
                />
              }
              label="Produktivitetstips"
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={smartSettings.breakReminders}
                  onChange={handleSettingChange('breakReminders')}
                />
              }
              label="Pausrekommendationer"
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={smartSettings.focusTimeProtection}
                  onChange={handleSettingChange('focusTimeProtection')}
                />
              }
              label="Fokustids-skydd"
            />
          </Stack>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)}>
            Stäng
          </Button>
          <Button
            variant="contained"
            onClick={() => setSettingsOpen(false)}
          >
            Spara Inställningar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SmartNotificationsManager;

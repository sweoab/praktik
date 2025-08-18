import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  IconButton,
  Divider,
  useTheme
} from '@mui/material';
import {
  Event,
  Add,
  VideoCall,
  LocationOn,
  AccessTime,
  People,
  Repeat,
  Close,
  Edit,
  Delete
} from '@mui/icons-material';
import { format, isSameDay, addDays, addHours } from 'date-fns';
import { sv } from 'date-fns/locale';

import { useCommunication } from '@/context/CommunicationContext';

const MeetingsPanel = () => {
  const { meetings, createMeeting, users, currentUser } = useCommunication();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [viewFilter, setViewFilter] = useState('all'); // all, today, week, upcoming
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    description: '',
    startTime: new Date(),
    endTime: addHours(new Date(), 1), // 1 hour later
    participants: [],
    location: '',
    type: 'supervision',
    isRecurring: false,
    recurringPattern: 'weekly'
  });
  const theme = useTheme();

  const getMeetingTypeIcon = (type) => {
    switch (type) {
      case 'supervision':
        return <People color="primary" />;
      case 'presentation':
        return <Event color="info" />;
      case 'meeting':
        return <VideoCall color="secondary" />;
      default:
        return <Event />;
    }
  };

  const getMeetingTypeColor = (type) => {
    switch (type) {
      case 'supervision':
        return 'primary';
      case 'presentation':
        return 'info';
      case 'meeting':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getMeetingTypeLabel = (type) => {
    switch (type) {
      case 'supervision':
        return 'Handledning';
      case 'presentation':
        return 'Presentation';
      case 'meeting':
        return 'Möte';
      default:
        return 'Okänt';
    }
  };

  const getFilteredMeetings = () => {
    const now = new Date();
    const today = new Date();
    const nextWeek = addDays(now, 7);

    switch (viewFilter) {
      case 'today':
        return meetings.filter(meeting => 
          isSameDay(new Date(meeting.startTime), today)
        );
      case 'week':
        return meetings.filter(meeting => {
          const meetingDate = new Date(meeting.startTime);
          return meetingDate >= now && meetingDate <= nextWeek;
        });
      case 'upcoming':
        return meetings.filter(meeting => 
          new Date(meeting.startTime) > now
        );
      default:
        return meetings;
    }
  };

  const handleCreateMeeting = async () => {
    if (!newMeeting.title || !newMeeting.startTime || newMeeting.participants.length === 0) return;

    try {
      await createMeeting({
        ...newMeeting,
        participants: [currentUser.id, ...newMeeting.participants.map(p => p.id)],
        createdBy: currentUser.id
      });

      setCreateDialogOpen(false);
      setNewMeeting({
        title: '',
        description: '',
        startTime: new Date(),
        endTime: addHours(new Date(), 1),
        participants: [],
        location: '',
        type: 'supervision',
        isRecurring: false,
        recurringPattern: 'weekly'
      });
    } catch (error) {
      console.error('Failed to create meeting:', error);
    }
  };

  const filteredMeetings = getFilteredMeetings().sort(
    (a, b) => new Date(a.startTime) - new Date(b.startTime)
  );

  const upcomingMeetings = meetings
    .filter(meeting => new Date(meeting.startTime) > new Date())
    .slice(0, 3);

  return (
    <>
      <Grid container spacing={3}>
        {/* Upcoming Meetings Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Kommande möten
              </Typography>
              {upcomingMeetings.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Inga kommande möten
                </Typography>
              ) : (
                <List dense>
                  {upcomingMeetings.map((meeting) => (
                    <ListItem key={meeting.id} sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ backgroundColor: 'transparent' }}>
                          {getMeetingTypeIcon(meeting.type)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={meeting.title}
                        secondary={
                          <Box>
                            <Typography variant="caption" display="block">
                              {format(new Date(meeting.startTime), 'dd MMM, HH:mm', { locale: sv })}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {meeting.location}
                            </Typography>
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

        {/* Main Meetings List */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">Alla möten</Typography>
                <Box display="flex" gap={2}>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Visa</InputLabel>
                    <Select
                      value={viewFilter}
                      label="Visa"
                      onChange={(e) => setViewFilter(e.target.value)}
                    >
                      <MenuItem value="all">Alla</MenuItem>
                      <MenuItem value="today">Idag</MenuItem>
                      <MenuItem value="week">Denna vecka</MenuItem>
                      <MenuItem value="upcoming">Kommande</MenuItem>
                    </Select>
                  </FormControl>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setCreateDialogOpen(true)}
                  >
                    Nytt möte
                  </Button>
                </Box>
              </Box>

              {filteredMeetings.length === 0 ? (
                <Box 
                  display="flex" 
                  flexDirection="column" 
                  alignItems="center" 
                  justifyContent="center" 
                  py={6}
                >
                  <Event sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" mb={1}>
                    Inga möten
                  </Typography>
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    {viewFilter === 'all' 
                      ? 'Inga möten är schemalagda' 
                      : `Inga möten ${viewFilter === 'today' ? 'idag' : 'för den valda perioden'}`}
                  </Typography>
                </Box>
              ) : (
                <List>
                  {filteredMeetings.map((meeting) => (
                    <ListItem
                      key={meeting.id}
                      sx={{
                        mb: 2,
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 2,
                        '&:hover': {
                          backgroundColor: theme.palette.action.hover
                        }
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ backgroundColor: 'transparent' }}>
                          {getMeetingTypeIcon(meeting.type)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1} mb={1}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {meeting.title}
                            </Typography>
                            <Chip
                              size="small"
                              label={getMeetingTypeLabel(meeting.type)}
                              color={getMeetingTypeColor(meeting.type)}
                              variant="outlined"
                            />
                            {meeting.isRecurring && (
                              <Chip
                                size="small"
                                icon={<Repeat />}
                                label="Återkommande"
                                variant="outlined"
                                color="info"
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary" mb={1}>
                              {meeting.description}
                            </Typography>
                            <Box display="flex" alignItems="center" gap={2} mb={1}>
                              <Box display="flex" alignItems="center" gap={0.5}>
                                <AccessTime sx={{ fontSize: 16 }} />
                                <Typography variant="caption">
                                  {format(new Date(meeting.startTime), 'dd MMM yyyy, HH:mm', { locale: sv })} - 
                                  {format(new Date(meeting.endTime), 'HH:mm')}
                                </Typography>
                              </Box>
                              {meeting.location && (
                                <Box display="flex" alignItems="center" gap={0.5}>
                                  <LocationOn sx={{ fontSize: 16 }} />
                                  <Typography variant="caption">
                                    {meeting.location}
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                            <Box display="flex" alignItems="center" gap={0.5}>
                              <People sx={{ fontSize: 16 }} />
                              <Typography variant="caption">
                                {meeting.participants?.length || 0} deltagare
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                      <Box display="flex" flexDirection="column" gap={1}>
                        <IconButton size="small">
                          <Edit />
                        </IconButton>
                        <IconButton size="small">
                          <VideoCall />
                        </IconButton>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Create Meeting Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            Skapa nytt möte
            <IconButton onClick={() => setCreateDialogOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mötestitel"
                value={newMeeting.title}
                onChange={(e) => setNewMeeting({...newMeeting, title: e.target.value})}
                placeholder="t.ex. Veckomöte med handledare"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Beskrivning"
                value={newMeeting.description}
                onChange={(e) => setNewMeeting({...newMeeting, description: e.target.value})}
                placeholder="Beskriv mötet..."
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="datetime-local"
                label="Starttid"
                value={newMeeting.startTime ? format(new Date(newMeeting.startTime), "yyyy-MM-dd'T'HH:mm") : ''}
                onChange={(e) => setNewMeeting({...newMeeting, startTime: new Date(e.target.value)})}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="datetime-local"
                label="Sluttid"
                value={newMeeting.endTime ? format(new Date(newMeeting.endTime), "yyyy-MM-dd'T'HH:mm") : ''}
                onChange={(e) => setNewMeeting({...newMeeting, endTime: new Date(e.target.value)})}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Mötestyp</InputLabel>
                <Select
                  value={newMeeting.type}
                  label="Mötestyp"
                  onChange={(e) => setNewMeeting({...newMeeting, type: e.target.value})}
                >
                  <MenuItem value="supervision">Handledning</MenuItem>
                  <MenuItem value="presentation">Presentation</MenuItem>
                  <MenuItem value="meeting">Allmänt möte</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Plats"
                value={newMeeting.location}
                onChange={(e) => setNewMeeting({...newMeeting, location: e.target.value})}
                placeholder="t.ex. Konferensrum A eller Zoom"
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={users.filter(user => user.id !== currentUser?.id)}
                getOptionLabel={(option) => `${option.name} (${option.type})`}
                value={newMeeting.participants}
                onChange={(e, newValue) => setNewMeeting({...newMeeting, participants: newValue})}
                renderInput={(params) => (
                  <TextField {...params} label="Deltagare" placeholder="Välj deltagare..." />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>
            Avbryt
          </Button>
          <Button 
            variant="contained" 
            onClick={handleCreateMeeting}
            disabled={!newMeeting.title || !newMeeting.startTime || newMeeting.participants.length === 0}
          >
            Skapa möte
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MeetingsPanel;

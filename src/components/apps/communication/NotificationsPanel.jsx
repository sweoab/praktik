import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Avatar,
  Typography,
  IconButton,
  Chip,
  Button,
  Tabs,
  Tab,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme
} from '@mui/material';
import {
  Notifications,
  Event,
  Message,
  Assignment,
  Share,
  MarkEmailRead,
  Delete,
  Close,
  AccessTime,
  LocationOn,
  Person,
  SmartToy,
  AutoAwesome,
  Psychology
} from '@mui/icons-material';
import { format, formatDistanceToNow } from 'date-fns';
import { sv } from 'date-fns/locale';

import { useCommunication } from '@/context/CommunicationContext';

const NotificationsPanel = () => {
  const { notifications, markNotificationAsRead } = useCommunication();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const theme = useTheme();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markNotificationAsRead(notification.id);
    }
    setSelectedNotification(notification);
    setDetailsOpen(true);
  };

  const handleMarkAsRead = (notification, event) => {
    event.stopPropagation();
    markNotificationAsRead(notification.id);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'meeting_reminder':
        return <Event color="info" />;
      case 'deadline_reminder':
        return <Assignment color="warning" />;
      case 'message':
        return <Message color="primary" />;
      case 'document_shared':
        return <Share color="success" />;
      case 'ai_reminder':
        return <SmartToy color="secondary" />;
      case 'ai_smart':
        return <AutoAwesome color="secondary" />;
      case 'workflow_suggestion':
        return <Psychology color="info" />;
      default:
        return <Notifications />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'meeting_reminder':
        return 'info';
      case 'deadline_reminder':
        return 'warning';
      case 'message':
        return 'primary';
      case 'document_shared':
        return 'success';
      case 'ai_reminder':
      case 'ai_smart':
      case 'workflow_suggestion':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const formatNotificationTime = (timestamp) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true, locale: sv });
  };

  // Filter notifications based on active tab
  const getFilteredNotifications = () => {
    switch (activeTab) {
      case 0: // Alla
        return notifications;
      case 1: // Olästa
        return notifications.filter(n => !n.isRead);
      case 2: // Möten
        return notifications.filter(n => n.type === 'meeting_reminder');
      case 3: // Uppgifter
        return notifications.filter(n => n.type === 'deadline_reminder');
      default:
        return notifications;
    }
  };

  const filteredNotifications = getFilteredNotifications();
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const renderNotificationDetails = () => {
    if (!selectedNotification) return null;

    const { type, data } = selectedNotification;

    switch (type) {
      case 'meeting_reminder':
        return (
          <Box>
            <Box display="flex" alignItems="center" mb={2}>
              <AccessTime sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography>
                {format(new Date(data.time), 'dd MMMM yyyy, HH:mm', { locale: sv })}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" mb={2}>
              <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography>{data.location}</Typography>
            </Box>
          </Box>
        );
      case 'deadline_reminder':
        return (
          <Box>
            <Box display="flex" alignItems="center" mb={2}>
              <AccessTime sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography>
                Deadline: {format(new Date(data.deadline), 'dd MMMM yyyy', { locale: sv })}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Typ: {data.taskType === 'report' ? 'Rapport' : 'Uppgift'}
            </Typography>
          </Box>
        );
      case 'document_shared':
        return (
          <Box>
            <Box display="flex" alignItems="center" mb={2}>
              <Person sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography>Delat av: Användare {data.sharedBy}</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Filnamn: {data.fileName}
            </Typography>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box>
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6">Notifieringar</Typography>
            <Button
              startIcon={<MarkEmailRead />}
              disabled={unreadCount === 0}
            >
              Markera alla som lästa
            </Button>
          </Box>

          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ mb: 3 }}
          >
            <Tab 
              label={
                <Badge badgeContent={notifications.length} color="primary" showZero>
                  Alla
                </Badge>
              } 
            />
            <Tab 
              label={
                <Badge badgeContent={unreadCount} color="error">
                  Olästa
                </Badge>
              } 
            />
            <Tab label="Möten" />
            <Tab label="Uppgifter" />
          </Tabs>

          {filteredNotifications.length === 0 ? (
            <Box 
              display="flex" 
              flexDirection="column" 
              alignItems="center" 
              justifyContent="center" 
              py={6}
            >
              <Notifications sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" mb={1}>
                Inga notifieringar
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                {activeTab === 1 ? 'Alla notifieringar är lästa' : 'Du har inga notifieringar just nu'}
              </Typography>
            </Box>
          ) : (
            <List>
              {filteredNotifications.map((notification) => (
                <ListItem
                  key={notification.id}
                  button
                  onClick={() => handleNotificationClick(notification)}
                  sx={{
                    backgroundColor: notification.isRead 
                      ? 'transparent' 
                      : theme.palette.action.hover,
                    mb: 1,
                    borderRadius: 1,
                    border: 1,
                    borderColor: 'divider'
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ backgroundColor: 'transparent' }}>
                      {getNotificationIcon(notification.type)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography 
                          variant="subtitle2" 
                          sx={{ 
                            fontWeight: notification.isRead ? 'normal' : 'bold'
                          }}
                        >
                          {notification.title}
                        </Typography>
                        <Chip
                          size="small"
                          label={getNotificationColor(notification.type)}
                          color={getNotificationColor(notification.type)}
                          variant="outlined"
                        />
                        {!notification.isRead && (
                          <Badge color="error" variant="dot" />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatNotificationTime(notification.timestamp)}
                        </Typography>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    {!notification.isRead && (
                      <IconButton
                        edge="end"
                        size="small"
                        onClick={(e) => handleMarkAsRead(notification, e)}
                      >
                        <MarkEmailRead />
                      </IconButton>
                    )}
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Notification Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="between" alignItems="center">
            <Box display="flex" alignItems="center" gap={2}>
              {selectedNotification && getNotificationIcon(selectedNotification.type)}
              <Typography variant="h6">
                {selectedNotification?.title}
              </Typography>
            </Box>
            <IconButton onClick={() => setDetailsOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" mb={3}>
            {selectedNotification?.message}
          </Typography>
          
          {renderNotificationDetails()}

          <Box mt={3}>
            <Typography variant="caption" color="text.secondary">
              {selectedNotification && formatNotificationTime(selectedNotification.timestamp)}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          {selectedNotification?.type === 'meeting_reminder' && (
            <Button variant="contained" color="primary">
              Gå till möte
            </Button>
          )}
          {selectedNotification?.type === 'deadline_reminder' && (
            <Button variant="contained" color="warning">
              Visa uppgift
            </Button>
          )}
          {selectedNotification?.type === 'document_shared' && (
            <Button variant="contained" color="success">
              Öppna dokument
            </Button>
          )}
          <Button onClick={() => setDetailsOpen(false)}>
            Stäng
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NotificationsPanel;

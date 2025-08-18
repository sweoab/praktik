import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Badge,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Button,
  useTheme
} from '@mui/material';
import {
  Search,
  FilterList,
  Message,
  VideoCall,
  Call,
  Email,
  Person,
  School,
  Business,
  Circle
} from '@mui/icons-material';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

import { useCommunication } from '@/context/CommunicationContext';
import { UserTypes } from '@/api/communication/communicationData';

const UsersPanel = () => {
  const { users, currentUser } = useCommunication();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCompany, setFilterCompany] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const theme = useTheme();

  const getUserTypeIcon = (type) => {
    switch (type) {
      case UserTypes.STUDENT:
        return <School color="primary" />;
      case UserTypes.TEACHER:
        return <Person color="info" />;
      case UserTypes.COMPANY_MENTOR:
        return <Business color="warning" />;
      case UserTypes.SUPERVISOR:
        return <Person color="secondary" />;
      default:
        return <Person />;
    }
  };

  const getUserTypeLabel = (type) => {
    switch (type) {
      case UserTypes.STUDENT:
        return 'Elev';
      case UserTypes.TEACHER:
        return 'Lärare';
      case UserTypes.COMPANY_MENTOR:
        return 'Handledare';
      case UserTypes.SUPERVISOR:
        return 'Supervisor';
      default:
        return 'Okänt';
    }
  };

  const getUserTypeColor = (type) => {
    switch (type) {
      case UserTypes.STUDENT:
        return 'primary';
      case UserTypes.TEACHER:
        return 'info';
      case UserTypes.COMPANY_MENTOR:
        return 'warning';
      case UserTypes.SUPERVISOR:
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return '#4caf50';
      case 'away':
        return '#ff9800';
      case 'offline':
        return '#9e9e9e';
      default:
        return '#9e9e9e';
    }
  };

  const getStatusIcon = (status) => {
    return (
      <Circle 
        sx={{ 
          fontSize: 12, 
          color: getStatusColor(status),
          mr: 0.5
        }} 
      />
    );
  };

  const formatLastSeen = (lastSeen) => {
    if (!lastSeen) return 'Aldrig';
    return format(new Date(lastSeen), 'dd MMM HH:mm', { locale: sv });
  };

  const handleStartChat = (user) => {
    // This would start a new conversation with the selected user
    console.log('Start chat with:', user.name);
  };

  const handleStartCall = (user) => {
    console.log('Start call with:', user.name);
  };

  const handleSendEmail = (user) => {
    window.open(`mailto:${user.email}`);
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    if (user.id === currentUser?.id) return false; // Don't show current user
    
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || user.type === filterType;
    const matchesCompany = filterCompany === 'all' || user.company === filterCompany;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesType && matchesCompany && matchesStatus;
  });

  // Get unique companies and classes for filters
  const companies = [...new Set(users.map(user => user.company).filter(Boolean))];
  const classes = [...new Set(users.map(user => user.class).filter(Boolean))];

  // Group users by type
  const groupedUsers = {
    [UserTypes.STUDENT]: filteredUsers.filter(user => user.type === UserTypes.STUDENT),
    [UserTypes.TEACHER]: filteredUsers.filter(user => user.type === UserTypes.TEACHER),
    [UserTypes.COMPANY_MENTOR]: filteredUsers.filter(user => user.type === UserTypes.COMPANY_MENTOR),
    [UserTypes.SUPERVISOR]: filteredUsers.filter(user => user.type === UserTypes.SUPERVISOR),
  };

  return (
    <Box>
      <Card>
        <CardContent>
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6">Kontakter</Typography>
            <Typography variant="body2" color="text.secondary">
              {filteredUsers.length} användare
            </Typography>
          </Box>

          {/* Search and Filters */}
          <Grid container spacing={2} mb={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                size="small"
                placeholder="Sök användare..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Typ</InputLabel>
                <Select
                  value={filterType}
                  label="Typ"
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <MenuItem value="all">Alla</MenuItem>
                  <MenuItem value={UserTypes.STUDENT}>Elever</MenuItem>
                  <MenuItem value={UserTypes.TEACHER}>Lärare</MenuItem>
                  <MenuItem value={UserTypes.COMPANY_MENTOR}>Handledare</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Företag</InputLabel>
                <Select
                  value={filterCompany}
                  label="Företag"
                  onChange={(e) => setFilterCompany(e.target.value)}
                >
                  <MenuItem value="all">Alla</MenuItem>
                  {companies.map(company => (
                    <MenuItem key={company} value={company}>
                      {company}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  label="Status"
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <MenuItem value="all">Alla</MenuItem>
                  <MenuItem value="online">Online</MenuItem>
                  <MenuItem value="away">Borta</MenuItem>
                  <MenuItem value="offline">Offline</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Users List */}
          {filteredUsers.length === 0 ? (
            <Box 
              display="flex" 
              flexDirection="column" 
              alignItems="center" 
              justifyContent="center" 
              py={6}
            >
              <Person sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" mb={1}>
                Inga användare hittades
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Försök med en annan sökning eller filter
              </Typography>
            </Box>
          ) : (
            <Box>
              {Object.entries(groupedUsers).map(([userType, usersInGroup]) => (
                usersInGroup.length > 0 && (
                  <Box key={userType} mb={3}>
                    <Box display="flex" alignItems="center" mb={2}>
                      {getUserTypeIcon(userType)}
                      <Typography variant="h6" ml={1}>
                        {getUserTypeLabel(userType)} ({usersInGroup.length})
                      </Typography>
                    </Box>
                    
                    <List>
                      {usersInGroup.map((user) => (
                        <ListItem
                          key={user.id}
                          sx={{
                            mb: 1,
                            border: 1,
                            borderColor: 'divider',
                            borderRadius: 2,
                            '&:hover': {
                              backgroundColor: theme.palette.action.hover
                            }
                          }}
                        >
                          <ListItemAvatar>
                            <Badge
                              overlap="circular"
                              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                              badgeContent={
                                <Circle 
                                  sx={{ 
                                    fontSize: 14, 
                                    color: getStatusColor(user.status),
                                    border: 2,
                                    borderColor: 'background.paper',
                                    borderRadius: '50%'
                                  }} 
                                />
                              }
                            >
                              <Avatar src={user.avatar}>
                                {user.name.charAt(0)}
                              </Avatar>
                            </Badge>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                                <Typography variant="subtitle2" fontWeight="bold">
                                  {user.name}
                                </Typography>
                                <Chip
                                  size="small"
                                  label={getUserTypeLabel(user.type)}
                                  color={getUserTypeColor(user.type)}
                                  variant="outlined"
                                />
                                {getStatusIcon(user.status)}
                                <Typography variant="caption" color="text.secondary">
                                  {user.status}
                                </Typography>
                              </Box>
                            }
                            secondary={
                              <Box>
                                <Typography variant="body2" color="text.secondary" mb={0.5}>
                                  {user.email}
                                </Typography>
                                <Box display="flex" gap={2} mb={0.5}>
                                  {user.company && (
                                    <Typography variant="caption" color="text.secondary">
                                      🏢 {user.company}
                                    </Typography>
                                  )}
                                  {user.class && (
                                    <Typography variant="caption" color="text.secondary">
                                      🎓 {user.class}
                                    </Typography>
                                  )}
                                  {user.department && (
                                    <Typography variant="caption" color="text.secondary">
                                      📋 {user.department}
                                    </Typography>
                                  )}
                                </Box>
                                <Typography variant="caption" color="text.secondary">
                                  Senast sedd: {formatLastSeen(user.lastSeen)}
                                </Typography>
                              </Box>
                            }
                          />
                          <Box display="flex" flexDirection="column" gap={1}>
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={() => handleStartChat(user)}
                              title="Starta chatt"
                            >
                              <Message />
                            </IconButton>
                            <IconButton 
                              size="small"
                              onClick={() => handleStartCall(user)}
                              title="Ring"
                            >
                              <Call />
                            </IconButton>
                            <IconButton 
                              size="small"
                              onClick={() => handleSendEmail(user)}
                              title="Skicka e-post"
                            >
                              <Email />
                            </IconButton>
                          </Box>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default UsersPanel;

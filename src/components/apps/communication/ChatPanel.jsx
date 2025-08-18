import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  TextField,
  IconButton,
  Chip,
  Divider,
  Badge,
  Paper,
  InputAdornment,
  Menu,
  MenuItem,
  useTheme
} from '@mui/material';
import {
  Send,
  AttachFile,
  EmojiEmotions,
  MoreVert,
  Search,
  VideoCall,
  Call,
  Info
} from '@mui/icons-material';
import { format, isToday, isYesterday, formatDistanceToNow } from 'date-fns';
import { sv } from 'date-fns/locale';

import { useCommunication } from '@/context/CommunicationContext';

const ChatPanel = () => {
  const {
    conversations,
    activeConversation,
    setActiveConversation,
    messages,
    sendMessage,
    currentUser,
    isLoadingMessages
  } = useCommunication();
  
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const messagesEndRef = useRef(null);
  const theme = useTheme();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    await sendMessage(newMessage);
    setNewMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    if (isToday(date)) {
      return format(date, 'HH:mm');
    } else if (isYesterday(date)) {
      return `Igår ${format(date, 'HH:mm')}`;
    } else {
      return format(date, 'dd MMM HH:mm', { locale: sv });
    }
  };

  const formatConversationTime = (timestamp) => {
    const date = new Date(timestamp);
    return formatDistanceToNow(date, { addSuffix: true, locale: sv });
  };

  const getConversationName = (conversation) => {
    if (conversation.name) return conversation.name;
    
    // For direct conversations, show the other participant's name
    const otherParticipant = conversation.participants?.find(p => p.id !== currentUser?.id);
    return otherParticipant?.name || 'Okänd användare';
  };

  const getConversationAvatar = (conversation) => {
    if (conversation.type === 'group' || conversation.type === 'class' || conversation.type === 'company') {
      return conversation.name?.charAt(0)?.toUpperCase() || 'G';
    }
    
    const otherParticipant = conversation.participants?.find(p => p.id !== currentUser?.id);
    return otherParticipant?.avatar || null;
  };

  const getLastMessage = (conversation) => {
    if (!conversation.messages || conversation.messages.length === 0) {
      return 'Ingen konversation ännu';
    }
    
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    const sender = conversation.participants?.find(p => p.id === lastMessage.senderId);
    const isCurrentUser = lastMessage.senderId === currentUser?.id;
    
    let content = lastMessage.content;
    if (content.length > 50) {
      content = content.substring(0, 50) + '...';
    }
    
    return `${isCurrentUser ? 'Du' : sender?.name || 'Okänd'}: ${content}`;
  };

  const getConversationTypeChip = (type) => {
    const typeConfig = {
      direct: { label: 'Direkt', color: 'primary' },
      group: { label: 'Grupp', color: 'secondary' },
      class: { label: 'Klass', color: 'info' },
      company: { label: 'Företag', color: 'warning' }
    };
    
    const config = typeConfig[type] || typeConfig.direct;
    return (
      <Chip
        size="small"
        label={config.label}
        color={config.color}
        variant="outlined"
        sx={{ ml: 1 }}
      />
    );
  };

  const filteredConversations = conversations.filter(conv =>
    getConversationName(conv).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Grid container spacing={3} sx={{ height: '70vh' }}>
      {/* Conversations List */}
      <Grid item xs={12} md={4}>
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Konversationer</Typography>
              <IconButton size="small">
                <MoreVert />
              </IconButton>
            </Box>
            
            <TextField
              fullWidth
              size="small"
              placeholder="Sök konversationer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
          </CardContent>
          
          <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
            <List sx={{ p: 0 }}>
              {filteredConversations.map((conversation) => (
                <ListItem
                  key={conversation.id}
                  button
                  selected={activeConversation?.id === conversation.id}
                  onClick={() => setActiveConversation(conversation)}
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: theme.palette.primary.light + '20',
                      '&:hover': {
                        backgroundColor: theme.palette.primary.light + '30',
                      }
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      badgeContent={
                        conversation.unreadCount > 0 ? (
                          <Chip
                            size="small"
                            label={conversation.unreadCount}
                            color="error"
                            sx={{ fontSize: '0.75rem', height: 20, minWidth: 20 }}
                          />
                        ) : null
                      }
                    >
                      <Avatar src={getConversationAvatar(conversation)}>
                        {!getConversationAvatar(conversation) && getConversationName(conversation).charAt(0)}
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center">
                        <Typography variant="subtitle2" noWrap sx={{ flexGrow: 1 }}>
                          {getConversationName(conversation)}
                        </Typography>
                        {getConversationTypeChip(conversation.type)}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {getLastMessage(conversation)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatConversationTime(conversation.lastActivity)}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
              
              {filteredConversations.length === 0 && (
                <ListItem>
                  <ListItemText
                    primary="Inga konversationer hittades"
                    secondary="Försök med en annan sökning"
                  />
                </ListItem>
              )}
            </List>
          </Box>
        </Card>
      </Grid>

      {/* Chat Messages */}
      <Grid item xs={12} md={8}>
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <CardContent sx={{ borderBottom: 1, borderColor: 'divider', pb: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" alignItems="center">
                    <Avatar src={getConversationAvatar(activeConversation)} sx={{ mr: 2 }}>
                      {!getConversationAvatar(activeConversation) && 
                        getConversationName(activeConversation).charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">
                        {getConversationName(activeConversation)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {activeConversation.participants?.length} deltagare
                        {getConversationTypeChip(activeConversation.type)}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box>
                    <IconButton>
                      <Call />
                    </IconButton>
                    <IconButton>
                      <VideoCall />
                    </IconButton>
                    <IconButton>
                      <Info />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>

              {/* Messages Area */}
              <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
                {isLoadingMessages ? (
                  <Box display="flex" justifyContent="center" p={3}>
                    <Typography>Laddar meddelanden...</Typography>
                  </Box>
                ) : (
                  <>
                    {messages.map((message, index) => {
                      const isCurrentUser = message.senderId === currentUser?.id;
                      const sender = activeConversation.participants?.find(p => p.id === message.senderId);
                      const showAvatar = !isCurrentUser && (
                        index === 0 || 
                        messages[index - 1].senderId !== message.senderId
                      );

                      return (
                        <Box
                          key={message.id}
                          display="flex"
                          justifyContent={isCurrentUser ? 'flex-end' : 'flex-start'}
                          mb={1}
                        >
                          {!isCurrentUser && (
                            <Avatar
                              src={sender?.avatar}
                              sx={{ 
                                mr: 1, 
                                width: 32, 
                                height: 32,
                                visibility: showAvatar ? 'visible' : 'hidden'
                              }}
                            >
                              {sender?.name?.charAt(0)}
                            </Avatar>
                          )}
                          
                          <Paper
                            elevation={1}
                            sx={{
                              p: 1.5,
                              maxWidth: '70%',
                              backgroundColor: isCurrentUser 
                                ? theme.palette.primary.main 
                                : theme.palette.background.paper,
                              color: isCurrentUser 
                                ? theme.palette.primary.contrastText 
                                : theme.palette.text.primary,
                            }}
                          >
                            {!isCurrentUser && showAvatar && (
                              <Typography variant="caption" display="block" mb={0.5}>
                                {sender?.name}
                              </Typography>
                            )}
                            
                            <Typography variant="body2">
                              {message.content}
                            </Typography>
                            
                            <Typography 
                              variant="caption" 
                              display="block" 
                              mt={0.5}
                              sx={{ 
                                opacity: 0.7,
                                textAlign: isCurrentUser ? 'right' : 'left'
                              }}
                            >
                              {formatMessageTime(message.timestamp)}
                            </Typography>
                          </Paper>
                        </Box>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </Box>

              {/* Message Input */}
              <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                <TextField
                  fullWidth
                  multiline
                  maxRows={3}
                  placeholder="Skriv ett meddelande..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton>
                          <AttachFile />
                        </IconButton>
                        <IconButton>
                          <EmojiEmotions />
                        </IconButton>
                        <IconButton 
                          color="primary"
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim()}
                        >
                          <Send />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </>
          ) : (
            <Box 
              display="flex" 
              flexDirection="column" 
              alignItems="center" 
              justifyContent="center" 
              height="100%"
              p={3}
            >
              <Typography variant="h6" color="text.secondary" mb={2}>
                Välj en konversation för att börja chatta
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Här kan du kommunicera med dina handledare, klasskompisar och kollegor på praktikplatsen.
              </Typography>
            </Box>
          )}
        </Card>
      </Grid>
    </Grid>
  );
};

export default ChatPanel;

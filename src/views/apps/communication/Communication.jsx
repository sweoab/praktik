import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Tab,
  Tabs,
  Badge,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ChatBubbleOutline,
  NotificationsOutlined,
  FolderOutlined,
  Event,
  People,
  SmartToy
} from '@mui/icons-material';

import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import { CommunicationProvider, useCommunication } from '@/context/CommunicationContext';

// Import communication components
import ChatPanel from '@/components/apps/communication/ChatPanel';
import NotificationsPanel from '@/components/apps/communication/NotificationsPanel';
import DocumentsPanel from '@/components/apps/communication/DocumentsPanel';
import MeetingsPanel from '@/components/apps/communication/MeetingsPanel';
import UsersPanel from '@/components/apps/communication/UsersPanel';
import AIAssistantPanel from '../../../components/apps/communication/AIAssistantPanel';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`communication-tabpanel-${index}`}
      aria-labelledby={`communication-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const CommunicationDashboard = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(0);

  // Handle URL parameters for direct tab access
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');
    
    const tabMap = {
      'ai': 0,
      'chat': 1,
      'notifications': 2,
      'documents': 3,
      'meetings': 4,
      'users': 5
    };
    
    if (tab && tabMap[tab] !== undefined) {
      setActiveTab(tabMap[tab]);
    }
  }, [location.search]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { notifications, unreadNotifications, upcomingMeetings, aiAssistant } = useCommunication();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const tabs = [
    {
      label: t('communication.aiAssistant'),
      icon: SmartToy,
      component: AIAssistantPanel,
      badge: aiAssistant.reminders.length
    },
    {
      label: t('communication.chats'),
      icon: ChatBubbleOutline,
      component: ChatPanel,
      badge: 0
    },
    {
      label: t('communication.notifications'),
      icon: NotificationsOutlined,
      component: NotificationsPanel,
      badge: unreadNotifications
    },
    {
      label: t('communication.documents'),
      icon: FolderOutlined,
      component: DocumentsPanel,
      badge: 0
    },
    {
      label: t('communication.meetings'),
      icon: Event,
      component: MeetingsPanel,
      badge: upcomingMeetings.length
    },
    {
      label: t('communication.contacts'),
      icon: People,
      component: UsersPanel,
      badge: 0
    }
  ];

  return (
    <Box sx={{ width: '100%' }}>
      {/* Quick Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {notifications.filter(n => !n.isRead).length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    {t('communication.unreadNotifications')}
                  </Typography>
                </Box>
                <NotificationsOutlined sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {upcomingMeetings.length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    {t('communication.upcomingMeetings')}
                  </Typography>
                </Box>
                <Event sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    3
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    {t('communication.activeChats')}
                  </Typography>
                </Box>
                <ChatBubbleOutline sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    7
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    {t('communication.sharedDocuments')}
                  </Typography>
                </Box>
                <FolderOutlined sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {aiAssistant.reminders.length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    {t('communication.aiReminders')}
                  </Typography>
                </Box>
                <SmartToy sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Communication Interface */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant={isMobile ? 'scrollable' : 'fullWidth'}
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                minHeight: 64,
                textTransform: 'none',
                fontSize: '1rem'
              }
            }}
          >
            {tabs.map((tab, index) => {
              const IconComponent = tab.icon;
              return (
                <Tab
                  key={index}
                  label={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Badge
                        badgeContent={tab.badge}
                        color="error"
                        invisible={tab.badge === 0}
                      >
                        <IconComponent />
                      </Badge>
                      <span>{tab.label}</span>
                    </Box>
                  }
                />
              );
            })}
          </Tabs>
        </Box>

        {tabs.map((tab, index) => {
          const Component = tab.component;
          return (
            <TabPanel key={index} value={activeTab} index={index}>
              <Component />
            </TabPanel>
          );
        })}
      </Card>
    </Box>
  );
};

const Communication = () => {
  const BCrumb = [
    {
      to: '/',
      title: 'Hem',
    },
    {
      title: 'Kommunikation',
    },
  ];

  return (
    <CommunicationProvider>
      <PageContainer title="Kommunikation" description="Kommunikations- och samarbetsverktyg">
        <Breadcrumb title="Kommunikation" items={BCrumb} />
        <CommunicationDashboard />
      </PageContainer>
    </CommunicationProvider>
  );
};

export default Communication;

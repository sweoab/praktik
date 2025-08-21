import React from 'react';
import { 
  Box, 
  Typography, 
  Avatar, 
  Stack, 
  Chip,
  Card,
  CardContent,
  Divider 
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { 
  IconSchool, 
  IconUser, 
  IconUsers, 
  IconBuildingBank 
} from '@tabler/icons';

import DashboardWidgetCard from '../../shared/DashboardWidgetCard';

const EmployeeSalary = () => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const success = theme.palette.success.main;
  const warning = theme.palette.warning.main;

  const socialConnections = [
    {
      icon: <IconSchool size={20} />,
      title: "Min Klass",
      subtitle: "Datateknik 2025",
      count: "24 studenter",
      color: primary,
      bgColor: theme.palette.primary.light,
    },
    {
      icon: <IconUser size={20} />,
      title: "Utbildningsansvarig",
      subtitle: "Maria Andersson",
      count: "Lärare",
      color: secondary,
      bgColor: theme.palette.secondary.light,
    },
    {
      icon: <IconUsers size={20} />,
      title: "Praktikhandledare",
      subtitle: "Johan Eriksson",
      count: "Tech Lead",
      color: success,
      bgColor: theme.palette.success.light,
    },
    {
      icon: <IconBuildingBank size={20} />,
      title: "Praktikföretag",
      subtitle: "TechCorps AB",
      count: "IT-konsult",
      color: warning,
      bgColor: theme.palette.warning.light,
    },
  ];

  return (
    <DashboardWidgetCard
      title="Mitt nätverk"
      subtitle="Utbildning & Praktik"
      dataLabel1="Kontakter"
      dataItem1="47"
      dataLabel2="Aktiva"
      dataItem2="12"
    >
      <Box sx={{ mt: 4 }}>
        <Stack spacing={0.5}>
          {socialConnections.map((connection, index) => (
            <Card 
              key={index} 
              variant="outlined" 
              sx={{ 
                border: `1px solid ${connection.bgColor}`,
                '&:hover': { 
                  boxShadow: 2,
                  transform: 'translateY(-1px)',
                  transition: 'all 0.2s ease-in-out'
                }
              }}
            >
              <CardContent sx={{ py: 0.5, px: 1, '&:last-child': { pb: 0.5 } }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Avatar 
                    sx={{ 
                      bgcolor: connection.bgColor, 
                      color: connection.color,
                      width: 32,
                      height: 32
                    }}
                  >
                    {connection.icon}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" fontWeight={600}>
                      {connection.title}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {connection.subtitle}
                    </Typography>
                  </Box>
                  <Chip
                    label={connection.count}
                    size="small"
                    sx={{
                      bgcolor: connection.bgColor,
                      color: connection.color,
                      fontWeight: 600,
                      height: 20,
                      fontSize: '0.7rem'
                    }}
                  />
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
        
        <Divider sx={{ my: 3.5 }} />
        
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="caption" color="textSecondary">
            Senast uppdaterad: Idag
          </Typography>
          <Chip 
            label="Alla aktiva" 
            size="small" 
            color="success" 
            variant="outlined"
            sx={{ height: 20, fontSize: '0.7rem' }}
          />
        </Stack>
      </Box>
    </DashboardWidgetCard>
  );
};

export default EmployeeSalary;

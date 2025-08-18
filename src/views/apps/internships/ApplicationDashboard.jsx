import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Alert,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  Work as WorkIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
  Visibility as VisibilityIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { useTheme } from '@mui/material';
import ParentCard from '@/components/shared/ParentCard';
import { getApplications, getApplicationStats } from '@/api/internships/InternshipsData';

const ApplicationDashboard = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [statsData, applicationsData] = await Promise.all([
        getApplicationStats(),
        getApplications({ limit: 10 })
      ]);
      setStats(statsData);
      setApplications(applicationsData);
    } catch (err) {
      setError(t('applications.errorFetchingData') || 'Kunde inte hämta ansökningsdata');
      console.error('Error fetching application data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return theme.palette.warning.main;
      case 'accepted': return theme.palette.success.main;
      case 'rejected': return theme.palette.error.main;
      case 'reviewing': return theme.palette.info.main;
      default: return theme.palette.grey[500];
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return t('applications.submitted');
      case 'accepted': return t('applications.accepted');
      case 'rejected': return t('applications.rejected');
      case 'reviewing': return t('applications.reviewing');
      default: return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <PendingIcon />;
      case 'accepted': return <CheckCircleIcon />;
      case 'rejected': return <CancelIcon />;
      case 'reviewing': return <ScheduleIcon />;
      default: return <PendingIcon />;
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography sx={{ mt: 2 }}>{t('applications.loading')}</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" action={
          <Button onClick={fetchData} startIcon={<RefreshIcon />}>
            {t('applications.tryAgain')}
          </Button>
        }>
          {error}
        </Alert>
      </Box>
    );
  }

  // Prepare chart data
  const statusPieData = stats?.statusDistribution?.map((item, index) => ({
    id: index,
    value: item.count,
    label: getStatusText(item.status),
    color: getStatusColor(item.status)
  })) || [];

  const monthlyBarData = stats?.monthlyApplications?.map(item => item.count) || [];
  const monthlyLabels = stats?.monthlyApplications?.map(item => {
    const [year, month] = item.month.split('-');
    const date = new Date(year, month - 1);
    return date.toLocaleDateString('sv-SE', { month: 'short', year: '2-digit' });
  }) || [];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            <AssessmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            {t('applications.dashboard')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('applications.overview')}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchData}
        >
          {t('applications.refresh')}
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <WorkIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4">{stats?.totalApplications || 0}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('applications.totalApplications')}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TrendingUpIcon sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4">{stats?.recentApplications || 0}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('applications.recentWeek')}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CheckCircleIcon sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4">
                    {stats?.statusDistribution?.find(s => s.status === 'accepted')?.count || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('applications.accepted')}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <PendingIcon sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4">
                    {stats?.statusDistribution?.find(s => s.status === 'pending')?.count || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('applications.pending')}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} mb={3}>
        {/* Status Distribution Pie Chart */}
        <Grid item xs={12} md={6}>
          <ParentCard title={t('applications.statusDistribution')}>
            {statusPieData.length > 0 ? (
              <PieChart
                series={[{ data: statusPieData }]}
                height={300}
                margin={{ top: 40, bottom: 40, left: 40, right: 40 }}
              />
            ) : (
              <Typography textAlign="center" color="text.secondary" py={4}>
                {t('applications.noDataAvailable')}
              </Typography>
            )}
          </ParentCard>
        </Grid>

        {/* Monthly Applications Bar Chart */}
        <Grid item xs={12} md={6}>
          <ParentCard title={t('applications.monthlyApplications')}>
            {monthlyBarData.length > 0 ? (
              <BarChart
                height={300}
                series={[{
                  data: monthlyBarData,
                  label: t('applications.applications'),
                  color: theme.palette.primary.main
                }]}
                xAxis={[{
                  data: monthlyLabels,
                  scaleType: 'band',
                  categoryGapRatio: 0.8,
                  barGapRatio: 0.8
                }]}
              />
            ) : (
              <Typography textAlign="center" color="text.secondary" py={4}>
                {t('applications.noDataAvailable')}
              </Typography>
            )}
          </ParentCard>
        </Grid>
      </Grid>

      {/* Top Internships */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={6}>
          <ParentCard title={t('applications.popularInternships')}>
            <List>
              {stats?.topInternships?.slice(0, 5).map((item, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {index + 1}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.internship_title}
                      secondary={`${item.company_name} • ${item.application_count} ${t('applications.applicationsCount')}`}
                    />
                    <Chip
                      label={item.application_count}
                      color="primary"
                      size="small"
                    />
                  </ListItem>
                  {index < 4 && <Divider />}
                </React.Fragment>
              )) || (
                <Typography textAlign="center" color="text.secondary" py={2}>
                  {t('applications.noDataAvailable')}
                </Typography>
              )}
            </List>
          </ParentCard>
        </Grid>

        {/* Recent Applications */}
        <Grid item xs={12} md={6}>
          <ParentCard title={t('applications.recentApplications')}>
            <TableContainer component={Paper} elevation={0}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>{t('applications.applicant')}</TableCell>
                    <TableCell>{t('applications.status')}</TableCell>
                    <TableCell>{t('applications.date')}</TableCell>
                    <TableCell align="center">{t('applications.action')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {applications.slice(0, 5).map((app) => (
                    <TableRow key={app.id} hover>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {app.student_name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {app.internship_title}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(app.status)}
                          label={getStatusText(app.status)}
                          size="small"
                          sx={{
                            bgcolor: getStatusColor(app.status),
                            color: 'white'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(app.applied_at).toLocaleDateString('sv-SE')}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton size="small" color="primary">
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {applications.length === 0 && (
              <Typography textAlign="center" color="text.secondary" py={2}>
                {t('applications.noApplicationsYet')}
              </Typography>
            )}
          </ParentCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ApplicationDashboard;

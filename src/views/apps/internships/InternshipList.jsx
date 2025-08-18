import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  IconButton,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Pagination,
  Skeleton,
  Alert
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Schedule as ScheduleIcon,
  Euro as EuroIcon,
  Laptop as LaptopIcon,
  School as SchoolIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { getInternships, searchInternships, formatInternshipData } from '../../../api/internships/InternshipsData';
import InternshipCard from './InternshipCard';
import PageContainer from '../../../components/container/PageContainer';

const InternshipList = () => {
  const { t } = useTranslation();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    field_of_study: '',
    remote_allowed: '',
    status: 'active'
  });
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const itemsPerPage = 12;

  useEffect(() => {
    fetchInternships();
  }, [page, filters]);

  const fetchInternships = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        ...filters,
        limit: itemsPerPage,
        offset: (page - 1) * itemsPerPage
      };

      const response = await getInternships(params);
      
      if (response?.internships) {
        const formattedInternships = response.internships.map(formatInternshipData);
        setInternships(formattedInternships);
        setTotal(response.total || response.internships.length);
      } else {
        setInternships([]);
        setTotal(0);
      }
    } catch (err) {
      setError('Kunde inte hämta praktikplatser. Försök igen senare.');
      console.error('Error fetching internships:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchInternships();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await searchInternships(searchQuery, {
        limit: itemsPerPage,
        offset: (page - 1) * itemsPerPage
      });
      
      if (response?.internships) {
        const formattedInternships = response.internships.map(formatInternshipData);
        setInternships(formattedInternships);
        setTotal(response.total || response.internships.length);
      } else {
        setInternships([]);
        setTotal(0);
      }
    } catch (err) {
      setError(t('internships.searchFailed'));
      console.error('Error searching internships:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    setPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      field_of_study: '',
      remote_allowed: '',
      status: 'active'
    });
    setSearchQuery('');
    setPage(1);
  };

  const totalPages = Math.ceil(total / itemsPerPage);

  return (
    <PageContainer title={t('internships.title')} description={t('internships.description')}>
      <Box>
        {/* Header */}
        <Box mb={3}>
          <Typography variant="h4" component="h1" gutterBottom>
            {t('internships.availableInternships')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('internships.discoverExciting')}
          </Typography>
        </Box>

        {/* Search and Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  placeholder={t('internships.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button onClick={handleSearch} variant="contained" size="small">
                          {t('internships.search')}
                        </Button>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Box display="flex" justifyContent="flex-end" gap={1}>
                  <Button
                    startIcon={<FilterIcon />}
                    onClick={() => setShowFilters(!showFilters)}
                    variant={showFilters ? "contained" : "outlined"}
                  >
                    {t('internships.filter')}
                  </Button>
                  <Button onClick={clearFilters} variant="text">
                    {t('internships.clear')}
                  </Button>
                </Box>
              </Grid>

              {/* Expandable Filters */}
              {showFilters && (
                <Grid item xs={12}>
                  <Box sx={{ pt: 2, borderTop: 1, borderColor: 'divider' }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          fullWidth
                          label={t('internships.location')}
                          value={filters.location}
                          onChange={(e) => handleFilterChange('location', e.target.value)}
                          size="small"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LocationIcon color="action" />
                              </InputAdornment>
                            )
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth size="small">
                          <InputLabel>{t('internships.fieldOfStudy')}</InputLabel>
                          <Select
                            value={filters.field_of_study}
                            label={t('internships.fieldOfStudy')}
                            onChange={(e) => handleFilterChange('field_of_study', e.target.value)}
                            startAdornment={<SchoolIcon color="action" sx={{ mr: 1 }} />}
                          >
                            <MenuItem value="">{t('internships.allAreas')}</MenuItem>
                            <MenuItem value="Datavetenskap">{t('internships.computerScience')}</MenuItem>
                            <MenuItem value="Design">{t('internships.design')}</MenuItem>
                            <MenuItem value="Marknadsföring">{t('internships.marketing')}</MenuItem>
                            <MenuItem value="Miljöingenjörsvetenskap">{t('internships.environmentalEngineering')}</MenuItem>
                            <MenuItem value="Ekonomi">{t('internships.economics')}</MenuItem>
                            <MenuItem value="Teknik">{t('internships.engineering')}</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth size="small">
                          <InputLabel>{t('internships.remoteWork')}</InputLabel>
                          <Select
                            value={filters.remote_allowed}
                            label={t('internships.remoteWork')}
                            onChange={(e) => handleFilterChange('remote_allowed', e.target.value)}
                            startAdornment={<LaptopIcon color="action" sx={{ mr: 1 }} />}
                          >
                            <MenuItem value="">{t('internships.all')}</MenuItem>
                            <MenuItem value="true">{t('internships.remoteAllowedOption')}</MenuItem>
                            <MenuItem value="false">{t('internships.onlyOnSite')}</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Results Info */}
        {!loading && (
          <Box mb={2}>
            <Typography variant="body2" color="text.secondary">
              {total > 0 
                ? `${t('internships.showing')} ${(page - 1) * itemsPerPage + 1}-${Math.min(page * itemsPerPage, total)} ${t('internships.of')} ${total} ${t('internships.title').toLowerCase()}`
                : t('internships.noResults')
              }
            </Typography>
          </Box>
        )}

        {/* Internships Grid */}
        <Grid container spacing={3}>
          {loading ? (
            // Loading skeletons
            Array.from(new Array(6)).map((_, index) => (
              <Grid item xs={12} sm={6} lg={4} key={index}>
                <Card>
                  <CardContent>
                    <Skeleton variant="text" height={32} />
                    <Skeleton variant="text" height={24} />
                    <Skeleton variant="rectangular" height={60} sx={{ my: 1 }} />
                    <Box display="flex" gap={1} mb={2}>
                      <Skeleton variant="rounded" width={60} height={24} />
                      <Skeleton variant="rounded" width={80} height={24} />
                    </Box>
                    <Skeleton variant="rectangular" height={36} />
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : internships.length > 0 ? (
            internships.map((internship) => (
              <Grid item xs={12} sm={6} lg={4} key={internship.id}>
                <InternshipCard internship={internship} />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 8 }}>
                  <SchoolIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    {t('internships.noResults')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={3}>
                    {t('internships.tryChangeCriteria')}
                  </Typography>
                  <Button onClick={clearFilters} variant="contained">
                    {t('internships.clearFilters')}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>

        {/* Pagination */}
        {totalPages > 1 && (
          <Box display="flex" justifyContent="center" mt={4}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
            />
          </Box>
        )}
      </Box>
    </PageContainer>
  );
};

export default InternshipList;

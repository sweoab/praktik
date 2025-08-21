import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardCard from '../../shared/DashboardCard';
import CustomSelect from '../../forms/theme-elements/CustomSelect';
import {
  MenuItem,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  TableContainer,
  Stack,
  Button,
  IconButton,
} from '@mui/material';
import { IconExternalLink, IconBuilding } from '@tabler/icons';
import { getInternships } from '../../../api/internships/InternshipsData';

const TopPerformers = () => {
  const [month, setMonth] = useState('1');
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      setLoading(true);
      const response = await getInternships({ 
        limit: 5,
        status: 'active'
      });
      
      if (response?.internships) {
        setInternships(response.internships);
      }
    } catch (error) {
      console.error('Error fetching internships:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    setMonth(event.target.value);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'closed': return 'error';
      default: return 'default';
    }
  };

  const formatSalary = (salary) => {
    if (!salary) return 'Ej angivet';
    return `${salary.toLocaleString('sv-SE')} kr`;
  };

  return (
    <DashboardCard
      title="Rekommenderade praktikplatser"
      subtitle="Senaste tillgängliga praktikplatser"
      action={
        <Stack direction="row" spacing={1}>
          <CustomSelect
            labelId="month-dd"
            id="month-dd"
            size="small"
            value={month}
            onChange={handleChange}
          >
            <MenuItem value={1}>Senaste</MenuItem>
            <MenuItem value={2}>Populära</MenuItem>
            <MenuItem value={3}>Nya denna vecka</MenuItem>
          </CustomSelect>
          <Button 
            component={Link} 
            to="/apps/internships" 
            size="small" 
            variant="outlined"
            endIcon={<IconExternalLink size={14} />}
          >
            Visa alla
          </Button>
        </Stack>
      }
    >
      <TableContainer>
        <Table
          aria-label="praktikplatser tabell"
          sx={{
            whiteSpace: 'nowrap',
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>Företag</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>Position</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>Plats</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>Status</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>Lön</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="subtitle2" fontWeight={600}>Åtgärd</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography color="textSecondary">Laddar praktikplatser...</Typography>
                </TableCell>
              </TableRow>
            ) : internships.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography color="textSecondary">Inga praktikplatser hittades</Typography>
                </TableCell>
              </TableRow>
            ) : (
              internships.map((internship) => (
                <TableRow key={internship.id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar 
                        sx={{ 
                          width: 40, 
                          height: 40, 
                          bgcolor: 'primary.light',
                          color: 'primary.main'
                        }}
                      >
                        <IconBuilding size={20} />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {internship.company_name || 'Företag AB'}
                        </Typography>
                        <Typography color="textSecondary" fontSize="12px" variant="subtitle2">
                          {internship.company_location || internship.location}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight={500}>
                      {internship.title}
                    </Typography>
                    <Typography color="textSecondary" fontSize="12px">
                      {internship.field_of_study}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
                      {internship.location}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      sx={{
                        bgcolor: (theme) => 
                          internship.status === 'active' 
                            ? theme.palette.success.light
                            : theme.palette.warning.light,
                        color: (theme) => 
                          internship.status === 'active'
                            ? theme.palette.success.main
                            : theme.palette.warning.main,
                        borderRadius: '8px',
                        textTransform: 'capitalize'
                      }}
                      size="small"
                      label={internship.status === 'active' ? 'Öppen' : 'Stängd'}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">
                      {formatSalary(internship.salary)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton 
                      component={Link} 
                      to={`/apps/internships/${internship.id}`}
                      size="small"
                      color="primary"
                    >
                      <IconExternalLink size={16} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </DashboardCard>
  );
};

export default TopPerformers;

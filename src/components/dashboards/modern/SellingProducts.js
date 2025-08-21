import React from 'react';
import { Box, CardContent, Chip, Paper, Stack, Typography, LinearProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import WorkImg from '../../../assets/images/backgrounds/piggy.png'; // Vi kan återanvända eller byta bild senare

const industries = [
  {
    name: 'Teknik & IT',
    applications: '342',
    percent: 65,
    color: 'primary',
  },
  {
    name: 'Ekonomi & Finans',
    applications: '218',
    percent: 42,
    color: 'secondary',
  },
  {
    name: 'Marknadsföring',
    applications: '156',
    percent: 30,
    color: 'success',
  },
  {
    name: 'Design & Media',
    applications: '134',
    percent: 25,
    color: 'warning',
  },
];

const SellingProducts = () => {
  const theme = useTheme();
  const secondarylight = theme.palette.secondary.light;
  const primarylight = theme.palette.primary.light;
  const successlight = theme.palette.success.light;
  const warninglight = theme.palette.warning.light;
  const secondary = theme.palette.secondary.main;
  const primary = theme.palette.primary.main;
  const success = theme.palette.success.main;
  const warning = theme.palette.warning.main;
  const borderColor = theme.palette.grey[100];

  return (
    <Paper sx={{ bgcolor: 'primary.main', border: `1px solid ${borderColor}` }} variant="outlined">
      <CardContent>
        <Typography variant="h5" color="white">
          Populära Branscher
        </Typography>
        <Typography variant="subtitle1" color="white" mb={4}>
          Mest efterfrågade praktikområden
        </Typography>

        <Box textAlign="center" mt={2} mb="-90px">
          <img src={WorkImg} alt={WorkImg} width={'300px'} />
        </Box>
      </CardContent>
      <Paper sx={{ overflow: 'hidden', zIndex: '1', position: 'relative', margin: '10px' }}>
        <Box p={3}>
          <Stack spacing={3}>
            {industries.map((industry, i) => (
              <Box key={i}>
                <Stack
                  direction="row"
                  spacing={2}
                  mb={1}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography variant="h6">{industry.name}</Typography>
                    <Typography variant="subtitle2" color="textSecondary">
                      {industry.applications} ansökningar
                    </Typography>
                  </Box>
                  <Chip
                    sx={{
                      backgroundColor: 
                        industry.color === 'primary' ? primarylight :
                        industry.color === 'secondary' ? secondarylight :
                        industry.color === 'success' ? successlight :
                        industry.color === 'warning' ? warninglight : primarylight,
                      color: 
                        industry.color === 'primary' ? primary :
                        industry.color === 'secondary' ? secondary :
                        industry.color === 'success' ? success :
                        industry.color === 'warning' ? warning : primary,
                      borderRadius: '4px',
                      width: 55,
                      height: 24,
                    }}
                    label={industry.percent + '%'}
                  />
                </Stack>
                <LinearProgress value={industry.percent} variant="determinate" color={industry.color} />
              </Box>
            ))}
          </Stack>
        </Box>
      </Paper>
    </Paper>
  );
};

export default SellingProducts;

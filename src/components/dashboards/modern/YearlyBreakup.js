import React from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Stack, Typography, Avatar, Box } from '@mui/material';
import { IconArrowUpLeft } from '@tabler/icons';

import { Grid } from '@mui/material';

import DashboardCard from '../../shared/DashboardCard';

const YearlyBreakup = () => {
  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const warning = theme.palette.warning.main;
  const success = theme.palette.success.main;
  const successlight = theme.palette.success.light;

  // chart
  const optionscolumnchart = {
    chart: {
      type: 'donut',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 155,
    },
    colors: [success, warning, primary],
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        donut: {
          size: '75%',
          background: 'transparent',
        },
      },
    },
    tooltip: {
      enabled: false,
    },
    stroke: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    responsive: [
      {
        breakpoint: 991,
        options: {
          chart: {
            width: 120,
          },
        },
      },
    ],
  };
  const seriescolumnchart = [52, 35, 13];

  return (
    <DashboardCard title="Utskickade Ansökningar">
      <Grid container spacing={3}>
        {/* column */}
        <Grid size={7}>
          <Typography variant="h3" fontWeight="700">
            1,247
          </Typography>
          <Stack direction="row" spacing={1} mt={1} alignItems="center">
            <Avatar sx={{ bgcolor: successlight, width: 27, height: 27 }}>
              <IconArrowUpLeft width={20} color="#39B69A" />
            </Avatar>
            <Typography variant="subtitle2" fontWeight="600">
              +23%
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              från förra året
            </Typography>
          </Stack>
          <Stack spacing={2} mt={5} direction="column">
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar
                sx={{ width: 9, height: 9, bgcolor: success, svg: { display: 'none' } }}
              ></Avatar>
              <Typography variant="subtitle2" color="textSecondary">
                Svarade (52%)
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar
                sx={{ width: 9, height: 9, bgcolor: warning, svg: { display: 'none' } }}
              ></Avatar>
              <Typography variant="subtitle2" color="textSecondary">
                Pending (35%)
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar
                sx={{ width: 9, height: 9, bgcolor: primary, svg: { display: 'none' } }}
              ></Avatar>
              <Typography variant="subtitle2" color="textSecondary">
                Utvecklade (13%)
              </Typography>
            </Stack>
          </Stack>
        </Grid>
        {/* column */}
        <Grid size={5}>
          <Box>
            <Chart
              options={optionscolumnchart}
              series={seriescolumnchart}
              type="donut"
              height="130px"
            />
          </Box>
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default YearlyBreakup;

import React from 'react';
import { Box } from '@mui/material';
import { Grid } from '@mui/material';

import TopCards from '../../components/dashboards/modern/TopCards';
import RevenueUpdates from '../../components/dashboards/modern/RevenueUpdates';
import YearlyBreakup from '../../components/dashboards/modern/YearlyBreakup';
import MonthlyEarnings from '../../components/dashboards/modern/MonthlyEarnings';
import EmployeeSalary from '../../components/dashboards/modern/EmployeeSalary';
import Social from '../../components/dashboards/modern/Social';
import SellingProducts from '../../components/dashboards/modern/SellingProducts';
import TopPerformers from '../../components/dashboards/modern/TopPerformers';
import Welcome from '@/layouts/full/shared/welcome/Welcome';

const Modern = () => {
  return (
    <Box>
      <Grid container spacing={1.5}>
        {/* column */}
        <Grid size={12}>
          <TopCards />
        </Grid>
        {/* column */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <RevenueUpdates />
        </Grid>
        {/* column */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Grid spacing={1.5} container columns={{ xs: 12, sm: 6 }}>
            <Grid size={12}>
              <YearlyBreakup />
            </Grid>
            <Grid size={12}>
              <MonthlyEarnings />
            </Grid>
          </Grid>
        </Grid>
        {/* column */}
        <Grid size={{ xs: 12, lg: 8 }} sx={{ mt: '-100px !important' }}>
          <EmployeeSalary />
        </Grid>
        {/* column */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Grid spacing={1.5} container columns={{ xs: 12, sm: 6 }}>
            <Grid size={12}>
              <Social />
            </Grid>
            <Grid size={12}>
              <SellingProducts />
            </Grid>
          </Grid>
        </Grid>
        {/* column */}
        <Grid size={{ xs: 12, lg: 8 }} sx={{ mt: '-300px !important' }}>
          <TopPerformers />
        </Grid>
      </Grid>
      {/* column */}
      <Welcome />
    </Box>
  );
};

export default Modern;

import React from 'react';
import { Box, CardContent, Typography } from '@mui/material';
import { Grid } from '@mui/material';

import icon1 from '../../../assets/images/svgs/icon-connect.svg';
import icon2 from '../../../assets/images/svgs/icon-user-male.svg';
import icon3 from '../../../assets/images/svgs/icon-briefcase.svg';
import icon4 from '../../../assets/images/svgs/icon-mailbox.svg';
import icon5 from '../../../assets/images/svgs/icon-favorites.svg';
import icon6 from '../../../assets/images/svgs/icon-speech-bubble.svg';

const topcards = [
  {
    icon: icon3,
    title: 'Praktikplatser',
    digits: '96',
    bgcolor: 'primary',
  },
  {
    icon: icon2,
    title: 'Studenter',
    digits: '1,250',
    bgcolor: 'warning',
  },
  {
    icon: icon4,
    title: 'Ansökningar',
    digits: '432',
    bgcolor: 'secondary',
  },
  {
    icon: icon5,
    title: 'Företag',
    digits: '67',
    bgcolor: 'error',
  },
  {
    icon: icon6,
    title: 'Aktiva Praktik',
    digits: '89',
    bgcolor: 'success',
  },
  {
    icon: icon1,
    title: 'Nya idag',
    digits: '12',
    bgcolor: 'info',
  },
];

const TopCards = () => {
  return (
    <Grid container spacing={3}>
      {topcards.map((topcard, i) => (
        <Grid size={{ xs: 12, sm: 4, lg: 2 }} key={i}>
          <Box bgcolor={topcard.bgcolor + '.light'} textAlign="center">
            <CardContent>
              <img src={topcard.icon} alt={topcard.icon} width="50" />
              <Typography
                color={topcard.bgcolor + '.main'}
                mt={1}
                variant="subtitle1"
                fontWeight={600}
              >
                {topcard.title}
              </Typography>
              <Typography color={topcard.bgcolor + '.main'} variant="h4" fontWeight={600}>
                {topcard.digits}
              </Typography>
            </CardContent>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default TopCards;

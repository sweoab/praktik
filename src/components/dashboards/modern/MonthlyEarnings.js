import React from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Stack, Typography, Avatar, Fab, Button } from '@mui/material';
import { IconArrowUpRight, IconFileText } from '@tabler/icons';
import { useNavigate } from 'react-router-dom';

import DashboardCard from '../../shared/DashboardCard';

const MonthlyEarnings = () => {
    const navigate = useNavigate();
    
    // chart color
    const theme = useTheme();
    const primary = theme.palette.primary.main;
    const primarylight = theme.palette.primary.light;
    const successlight = theme.palette.success.light;

    // chart
    const optionscolumnchart = {
        chart: {
            type: 'area',
            fontFamily: "'Plus Jakarta Sans', sans-serif;",
            foreColor: '#adb0bb',
            toolbar: {
                show: false,
            },
            height: 60,
            sparkline: {
                enabled: true,
            },
            group: 'sparklines',
        },
        stroke: {
            curve: 'smooth',
            width: 2,
        },
        fill: {
            colors: [primarylight],
            type: 'solid',
            opacity: 0.05,
        },
        markers: {
            size: 0,
        },
        tooltip: {
            theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
            x: {
                show: false,
            }
        },
    };
    const seriescolumnchart = [
        {
            name: '',
            color: primary,
            data: [15, 25, 18, 32, 28, 35, 42],
        },
    ];

    return (
        <DashboardCard
            title="CV Generator"
            action={
                <Fab color="primary" size="medium">
                    <IconFileText width={24} />
                </Fab>
            }
            footer={
                <Chart options={optionscolumnchart} series={seriescolumnchart} type="area" height="60px" />
            }
        >
            <>
                <Typography variant="h3" fontWeight="700" mt="-20px">
                    234
                </Typography>
                <Stack direction="row" spacing={1} my={1} alignItems="center">
                    <Avatar sx={{ bgcolor: successlight, width: 27, height: 27 }}>
                        <IconArrowUpRight width={20} color="#39B69A" />
                    </Avatar>
                    <Typography variant="subtitle2" fontWeight="600">
                        +15%
                    </Typography>
                    <Typography variant="subtitle2" color="textSecondary">
                        CV:n skapade denna månad
                    </Typography>
                </Stack>
                <Button 
                    variant="contained" 
                    color="primary" 
                    fullWidth 
                    sx={{ mt: 2 }}
                    onClick={() => navigate('/apps/cv-generator')}
                >
                    Skapa ditt CV nu
                </Button>
            </>
        </DashboardCard>
    );
};

export default MonthlyEarnings;

import React from 'react';
import {
  Grid,
  Typography,
  Box
} from '@mui/material';
import InternshipCard from './InternshipCard';

// Mock data för test
const mockInternships = [
  {
    id: 1,
    title: 'Frontend Developer Praktikant',
    description: 'Arbeta med React, TypeScript och moderna webteknologier. Du kommer att vara en del av vårt utvecklingsteam och bidra till spännande projekt inom AI och machine learning.',
    company_name: 'Tech Innovations AB',
    company_logo: '',
    location: 'Stockholm',
    duration_weeks: 16,
    duration_formatted: '16 veckor',
    compensation: 12000,
    compensation_formatted: '12 000 SEK/månad',
    remote_allowed: true,
    field_of_study: 'Datavetenskap',
    required_skills: ['JavaScript', 'HTML', 'CSS'],
    preferred_skills: ['React', 'TypeScript', 'Git'],
    application_deadline: '2025-08-20',
    deadline_formatted: '2025-08-20',
    status: 'active',
    spots_available: 2,
    spots_filled: 0
  },
  {
    id: 2,
    title: 'UX/UI Designer Praktikant',
    description: 'Skapa användarvänliga och visuellt tilltalande digitala upplevelser. Arbeta med kundprojekt och lär dig hela designprocessen från idé till implementering.',
    company_name: 'Digital Design Studio',
    company_logo: '',
    location: 'Malmö',
    duration_weeks: 14,
    duration_formatted: '14 veckor',
    compensation: 10000,
    compensation_formatted: '10 000 SEK/månad',
    remote_allowed: true,
    field_of_study: 'Design',
    required_skills: ['Figma', 'Adobe Creative Suite', 'UX Research'],
    preferred_skills: ['Prototyping', 'User Testing', 'HTML/CSS'],
    application_deadline: '2025-08-01',
    deadline_formatted: '2025-08-01',
    status: 'active',
    spots_available: 2,
    spots_filled: 1
  },
  {
    id: 3,
    title: 'Miljöingenjör Praktikant',
    description: 'Arbeta med hållbarhetsprojekt och miljöanalys. Du får möjlighet att bidra till verkliga miljölösningar och lära dig om grön teknologi.',
    company_name: 'Green Solutions Nordic',
    company_logo: '',
    location: 'Göteborg',
    duration_weeks: 12,
    duration_formatted: '12 veckor',
    compensation: 11000,
    compensation_formatted: '11 000 SEK/månad',
    remote_allowed: false,
    field_of_study: 'Miljöingenjörsvetenskap',
    required_skills: ['Miljöanalys', 'Projektledning'],
    preferred_skills: ['GIS', 'AutoCAD', 'Excel'],
    application_deadline: '2025-05-15',
    deadline_formatted: '2025-05-15',
    status: 'active',
    spots_available: 3,
    spots_filled: 0
  }
];

const InternshipTestView = () => {
  return (
    <Box p={3}>
      <Typography variant="h4" component="h1" gutterBottom>
        Praktikplatser - Test View
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Detta är en testvy som visar praktikplats-komponenterna med mock-data
      </Typography>
      
      <Grid container spacing={3}>
        {mockInternships.map((internship) => (
          <Grid item xs={12} sm={6} lg={4} key={internship.id}>
            <InternshipCard internship={internship} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default InternshipTestView;

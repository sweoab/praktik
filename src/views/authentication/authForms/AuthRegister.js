import React, { useState } from 'react';
import { Box, Typography, Button, Divider, Alert } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../../components/forms/theme-elements/CustomFormLabel';
import { Stack } from '@mui/system';
import { useAuth } from '../../../context/AuthContext';
import AuthSocialButtons from './AuthSocialButtons';

const AuthRegister = ({ title, subtitle, subtext }) => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await register({
        firstname,
        lastname,
        email,
        password
      });
      
      if (result.success) {
        navigate('/dashboards/modern', { replace: true });
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {title ? (
        <Typography fontWeight="700" variant="h3" mb={1}>
          {title}
        </Typography>
      ) : null}

      {subtext}
      <AuthSocialButtons title="Sign up with" />

      <Box mt={3}>
        <Divider>
          <Typography
            component="span"
            color="textSecondary"
            variant="h6"
            fontWeight="400"
            position="relative"
            px={2}
          >
            or sign up with
          </Typography>
        </Divider>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box>
        <Stack spacing={2} mb={3}>
          <Box>
            <CustomFormLabel htmlFor="firstname">First Name</CustomFormLabel>
            <CustomTextField 
              id="firstname" 
              variant="outlined" 
              fullWidth 
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              required
            />
          </Box>
          <Box>
            <CustomFormLabel htmlFor="lastname">Last Name</CustomFormLabel>
            <CustomTextField 
              id="lastname" 
              variant="outlined" 
              fullWidth 
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              required
            />
          </Box>
          <Box>
            <CustomFormLabel htmlFor="email">Email Address</CustomFormLabel>
            <CustomTextField 
              id="email" 
              type="email"
              variant="outlined" 
              fullWidth 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Box>
          <Box>
            <CustomFormLabel htmlFor="password">Password</CustomFormLabel>
            <CustomTextField 
              id="password" 
              type="password"
              variant="outlined" 
              fullWidth 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Box>
        </Stack>
        
        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          type="submit"
          disabled={loading}
        >
          {loading ? 'Signing Up...' : 'Sign Up'}
        </Button>
      </Box>
      {subtitle}
    </form>
  );
};

export default AuthRegister;

import React from 'react';
import { Box } from '@mui/material';

const Fallback = () => (
  <Box sx={{
    fontFamily: 'Arial, sans-serif',
    marginLeft: '20px',
    marginTop: '20px',
  }}>
    <h1>Consent Needed</h1>
    <p>We need your consent to load additional resources like fonts.</p>
  </Box>
);

export default Fallback;
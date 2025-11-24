import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.primary.dark,
        color: 'white',
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" align="center">
          © {new Date().getFullYear()} Saint Paul Historical Library & Map
        </Typography>
        <Typography variant="body2" align="center" sx={{ mt: 1 }}>
          Dedicated to preserving and sharing the rich history of Saint Paul, Minnesota
        </Typography>
        <Typography variant="body2" align="center" sx={{ mt: 1 }}>
          <Link href="#" color="inherit" sx={{ mx: 1 }}>
            Privacy Policy
          </Link>
          |
          <Link href="#" color="inherit" sx={{ mx: 1 }}>
            Contact
          </Link>
          |
          <Link href="#" color="inherit" sx={{ mx: 1 }}>
            Contribute
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;

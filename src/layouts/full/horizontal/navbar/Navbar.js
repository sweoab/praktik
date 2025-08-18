import { useMediaQuery, Box, Drawer, Container } from '@mui/material';
import NavListing from './NavListing/NavListing';
import Logo from '../../shared/logo/Logo';
import { CustomizerContext } from '@/context/CustomizerContext';
import config from '@/context/config';
import SidebarItems from '../../vertical/sidebar/SidebarItems';
import { useContext } from 'react';


const Navigation = () => {
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const { isLayout, isMobileSidebar, setIsMobileSidebar } = useContext(CustomizerContext);
  const SidebarWidth = config.sidebarWidth;


  if (lgUp) {
    return (
      <Box sx={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }} py={2}>
        {/* ------------------------------------------- */}
        {/* Sidebar for desktop */}
        {/* ------------------------------------------- */}
        <Container
          sx={{
            maxWidth: isLayout === 'boxed' ? 'lg' : '100%!important',
          }}
        >
          <NavListing />
        </Container>
      </Box>
    );
  }

  return (
    (<Drawer
      anchor="left"
      open={isMobileSidebar}
      onClose={() => setIsMobileSidebar(false)}
      variant="temporary"
      slotProps={{
        paper: {
          sx: {
            width: SidebarWidth,
            // backgroundColor:
            //   activeMode === 'dark'
            //     ? darkBackground900
            //     : activeSidebarBg,
            // color: activeSidebarBg === '#ffffff' ? '' : 'white',
            border: '0 !important',
            boxShadow: (theme) => theme.shadows[8],
          },
        }
      }}
    >
      {/* ------------------------------------------- */}
      {/* Logo */}
      {/* ------------------------------------------- */}
      <Box px={2}>
        <Logo />
      </Box>
      {/* ------------------------------------------- */}
      {/* Sidebar For Mobile */}
      {/* ------------------------------------------- */}
      <SidebarItems />
    </Drawer>)
  );
};

export default Navigation;

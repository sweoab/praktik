import config from '@/context/config';
import { CustomizerContext } from '../../../../context/CustomizerContext';
import { Link } from 'react-router-dom';
import { ReactComponent as LogoDark } from '@/assets/images/logos/dark-logo.svg';
import { ReactComponent as LogoDarkRTL } from '@/assets/images/logos/dark-rtl-logo.svg';
// light-logo.svg is missing; use existing light-icon.svg instead
import { ReactComponent as LogoLight } from '@/assets/images/logos/light-icon.svg';
import { ReactComponent as LogoLightRTL } from '@/assets/images/logos/light-logo-rtl.svg';
import { styled } from '@mui/material';
import { useContext } from 'react'

const Logo = () => {
  const { isCollapse, isSidebarHover, activeDir, activeMode } = useContext(CustomizerContext);
  const TopbarHeight = config.topbarHeight;

  const LinkStyled = styled(Link)(() => ({
    height: TopbarHeight,
    width: isCollapse == "mini-sidebar" && !isSidebarHover ? '40px' : '180px',
    overflow: 'hidden',
    display: 'block',
  }));

  if (activeDir === 'ltr') {
    return (
      <LinkStyled to="/" style={{
        display: 'flex',
        alignItems: 'center',
      }}>
        {activeMode === 'dark' ? (
          <LogoLight />
        ) : (
          <LogoDark />
        )}
      </LinkStyled>
    );
  }
  return (
    <LinkStyled to="/" style={{
      display: 'flex',
      alignItems: 'center',
    }}>
      {activeMode === 'dark' ? (
        <LogoDarkRTL />
      ) : (
        <LogoLightRTL />
      )}
    </LinkStyled>
  );
};

export default Logo;

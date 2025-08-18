import _ from 'lodash';
import { createTheme } from '@mui/material/styles';
import { CustomizerContext } from '../context/CustomizerContext';
import { useContext, useEffect } from 'react';
import components from './Components';
import typography from './Typography';
import { shadows, darkshadows } from './Shadows';
import { DarkThemeColors } from './DarkThemeColors';
import { LightThemeColors } from './LightThemeColors';
import * as locales from '@mui/material/locale';
import { baseDarkTheme, baselightTheme } from './DefaultColors';

export const BuildTheme = (config = {}) => {
  const themeOptions = LightThemeColors.find((theme) => theme.name === config.theme);
  const darkthemeOptions = DarkThemeColors.find((theme) => theme.name === config.theme);
  const { activeMode, isBorderRadius, isLanguage } = useContext(CustomizerContext);

  const defaultTheme = activeMode === 'dark' ? baseDarkTheme : baselightTheme;
  const defaultShadow = activeMode === 'dark' ? darkshadows : shadows;
  const themeSelect = activeMode === 'dark' ? darkthemeOptions : themeOptions;

  const baseMode = {
    palette: {
      mode: activeMode,
    },
    shape: {
      borderRadius: isBorderRadius,
    },
    shadows: defaultShadow,
    typography: typography,
  };
  const theme = createTheme(
    _.merge({}, baseMode, defaultTheme, locales[isLanguage], themeSelect, {
      direction: config.direction,
    }),
  );
  theme.components = components(theme);
  return theme;
};

const ThemeSettings = () => {
  const { activeTheme, activeDir } = useContext(CustomizerContext);

  const theme = BuildTheme({
    direction: activeDir,
    theme: activeTheme,
  });
  useEffect(() => {
    document.dir = activeDir;
  }, [activeDir]);

  return theme;
};

export { ThemeSettings };

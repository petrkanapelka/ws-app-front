import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';
import { dataDisplayCustomizations } from './customizations/dataDisplay';
import { feedbackCustomizations } from './customizations/feedback';
import { inputsCustomizations } from './customizations/inputs';
import { navigationCustomizations } from './customizations/navigation';
import { surfacesCustomizations } from './customizations/surfaces';
import { typography, shadows, shape } from './themePrimitives';

interface AppThemeProps {
    children: React.ReactNode;
    disableCustomTheme?: boolean;
    themeComponents?: ThemeOptions['components'];
}

export default function AppTheme({
    children,
    disableCustomTheme,
    themeComponents,
}: AppThemeProps) {
    const theme = React.useMemo(() => {
        return disableCustomTheme
            ? {}
            : createTheme({
                palette: {
                    mode: 'dark',
                },
                cssVariables: {
                    colorSchemeSelector: 'data-mui-color-scheme',
                    cssVarPrefix: 'template',
                },
                typography,
                shadows,
                shape,
                components: {
                    ...inputsCustomizations,
                    ...dataDisplayCustomizations,
                    ...feedbackCustomizations,
                    ...navigationCustomizations,
                    ...surfacesCustomizations,
                    ...themeComponents,
                },
            });
    }, [disableCustomTheme, themeComponents]);

    if (disableCustomTheme) {
        return <React.Fragment>{children}</React.Fragment>;
    }
    return (
        <ThemeProvider theme={theme} disableTransitionOnChange>
            {children}
        </ThemeProvider>
    );
}

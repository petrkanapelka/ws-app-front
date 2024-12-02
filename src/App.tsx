import styles from './App.module.css';
import { Box } from '@mui/material';
import AppTheme from './theme/AppTheme';
import { Outlet } from 'react-router-dom';
import ButtonAppBar from './components/MenuAppBar';



export function App() {
  return (
    <AppTheme>
      <ButtonAppBar />
      <Box className={styles.App}>
        <Outlet />
      </Box>
    </AppTheme>
  );
}


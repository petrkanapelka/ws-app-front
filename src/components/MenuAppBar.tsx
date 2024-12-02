import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function ButtonAppBar() {
    return (
        <Box sx={{ flexGrow: 1, width: '100%', backgroundColor: '#333B4D' ,height: '10vh', display: 'flex', alignItems: 'center' }}>
            <AppBar  sx={{ backgroundColor: '#333B4D', height: '10vh'}}>
                <Toolbar sx={{display: 'flex', alignItems: 'center'}}>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Rapid Chat
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
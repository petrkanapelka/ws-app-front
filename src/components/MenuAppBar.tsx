import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { logout, setUserLogin } from '../chat-reducer';

export default function ButtonAppBar() {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const isUserLogin = useAppSelector(state => state.chat.isUserLogin)

    const logoutHandler = () => {
        dispatch(logout());
        navigate('/login');
        localStorage.removeItem('token');
        dispatch(setUserLogin(false));
    };

    return (
        <Box sx={{ flexGrow: 1, width: '100%', backgroundColor: '#333B4D', height: '7vh', display: 'flex', alignItems: 'center' }}>
            <AppBar sx={{ backgroundColor: '#333B4D', height: '7vh' }}>
                <Toolbar sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Rapid Chat
                    </Typography>
                    {isUserLogin ?
                        <Button color="inherit" onClick={logoutHandler}>Logout</Button>
                        : <>
                            <Button color="inherit" onClick={() => { navigate('/register') }}>Register</Button>
                            <Button color="inherit" onClick={() => { navigate('/login') }}>Login</Button>

                        </>
                    }
                </Toolbar>
            </AppBar>
        </Box>
    );
}
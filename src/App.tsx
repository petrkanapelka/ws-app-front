import { useEffect, useRef, useState } from 'react';
import styles from './App.module.css';
import { useAppDispatch, useAppSelector } from './store';
import {
  createConnection,
  destroyConnection,
  sendClientName,
  sendMessage,
  userStopTyping,
  userTyping,
} from './chat-reducer';
import { debounce } from 'lodash';
import { useForm } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Box, Divider, Typography } from '@mui/material';
import AppTheme from './theme/AppTheme';
import { useNavigate } from 'react-router-dom';

export type User = {
  id: string;
  name: string;
};

export type Message = {
  id: string;
  message: string;
  user: User;
};

export function App() {
  const nicknameForm = useForm<{ nickname: string }>({ mode: 'onChange' });

  const messageForm = useForm<{ message: string }>({ mode: 'onChange' });

  const dispatch = useAppDispatch();

  const [isScrollMode, setScrollMode] = useState<boolean>(true);

  const messages = useAppSelector((state) => state.chat.messages);
  const typingUsers = useAppSelector((state) => state.chat.typingUsers);

  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/register');
        return;
      }

      const response = await fetch('/check-auth', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        navigate('/main');
      } else {
        navigate('/register');
      }
    };

    checkAuth();
  }, [navigate]);

  const logout = async () => {
    const token = localStorage.getItem('token');
    await fetch('/logout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    localStorage.removeItem('token'); 
    navigate('/register'); 
  };

  useEffect(() => {
    dispatch(createConnection());
    return () => {
      dispatch(destroyConnection());
    };
  }, [dispatch]);

  useEffect(() => {
    if (isScrollMode) {
      chatContainerRef.current?.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [isScrollMode, messages]);

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
      setScrollMode(isAtBottom);
    }
  };

  const debouncedStopTyping = useRef(
    debounce(() => {
      dispatch(userStopTyping());
    }, 500)
  ).current;

  const handleTyping = () => {
    dispatch(userTyping());
    debouncedStopTyping();
  };

  const handleSendName = (data: { nickname: string }) => {
    dispatch(sendClientName(data.nickname));
  };

  const handleSendMessage = (data: { message: string }) => {
    dispatch(sendMessage(data.message));
    messageForm.reset();
  };

  const renderMessages = () =>
    messages.map(({ id, user, message }) => (
      <>
        <Box className={styles.message} key={id}>
          <b>{user.name}: </b>
          <span>{message}</span>
        </Box>
        <Divider />
      </>
    ));

  const renderTypingUsers = () =>
    typingUsers.map((u) => <Typography variant='caption' key={u.id}>{u.name} is typing..., </Typography>);

  return (
    <AppTheme>
      <Box className={styles.App}>
        <Box className={styles['parent-container']}>
          <form onSubmit={nicknameForm.handleSubmit(handleSendName)} className={styles['input-container']}>
            <Box>
              <TextField
                type="text"
                label="Enter nickname"
                variant="outlined"
                error={!!nicknameForm.formState.errors.nickname}
                helperText={nicknameForm.formState.errors.nickname?.message}
                {...nicknameForm.register('nickname', {
                  required: 'Nickname is required',
                  maxLength: {
                    value: 10,
                    message: 'Nickname cannot exceed 10 characters',
                  },
                  minLength: {
                    value: 2,
                    message: 'Nickname must be at least 2 characters',
                  },
                })}
                aria-invalid={!!nicknameForm.formState.errors.nickname}
              />
            </Box>
            <Button variant="contained" type="submit">SET</Button>
          </form>
          <Box className={styles['chat-container']} ref={chatContainerRef} onScroll={handleScroll}>
            {renderMessages()}
          </Box>
          <Box className={styles.typing}>
            {renderTypingUsers()}
          </Box>



          <form onSubmit={messageForm.handleSubmit(handleSendMessage)} className={styles['input-container']} style={{ height: 'auto' }}>
            <Box sx={{ width: '100%' }}>
              <TextField
                id="outlined-basic"
                label="Enter message"
                variant="outlined"
                onKeyDown={handleTyping}
                onKeyUp={debouncedStopTyping}
                {...messageForm.register('message', {
                  required: 'Message is required',
                  maxLength: {
                    value: 100,
                    message: 'Message cannot exceed 100 characters',
                  },
                  minLength: {
                    value: 2,
                    message: 'Message must be at least 2 characters',
                  },
                })}
                aria-invalid={!!messageForm.formState.errors.message}
                error={!!messageForm.formState.errors.message}
                helperText={
                  messageForm.formState.errors.message?.message || ' '
                }
                sx={{
                  width: '90%',
                  // height: '100px',
                }}
                InputProps={{
                  sx: {
                    height: '100px',
                  },
                }}
              />
            </Box>
            <Button variant="contained" type="submit">SEND</Button>
          </form>
        </Box>
      </Box>
    </AppTheme>
  );
}


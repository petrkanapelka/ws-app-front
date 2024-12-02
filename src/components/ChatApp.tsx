// @flow 
import { Box, Divider, Typography, TextField, Button } from '@mui/material';
import { debounce } from 'lodash';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { destroyConnection, userStopTyping, userTyping, sendClientName, sendMessage, createConnection, setNickName } from '../chat-reducer';
import { useAppDispatch, useAppSelector } from '../store';
import styles from '../App.module.css';




export const ChatApp = () => {
    const nicknameForm = useForm<{ nickname: string }>({ mode: 'onChange' });

    const messageForm = useForm<{ message: string }>({ mode: 'onChange' });

    const dispatch = useAppDispatch();

    const [isScrollMode, setScrollMode] = React.useState<boolean>(true);

    const messages = useAppSelector((state) => state.chat.messages);
    const typingUsers = useAppSelector((state) => state.chat.typingUsers);
    const nickname = useAppSelector((state) => state.chat.nickname);

    console.log('Current nickname:', nickname);

    const chatContainerRef = React.useRef<HTMLDivElement | null>(null);

    const navigate = useNavigate();

    React.useEffect(() => {
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
                navigate('/');
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

    React.useEffect(() => {
        dispatch(createConnection());
        return () => {
            dispatch(destroyConnection());
        };
    }, [dispatch]);

    React.useEffect(() => {
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

    const debouncedStopTyping = React.useRef(
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
        <Box className={styles['parent-container']}>
            {nickname ?
                <div className={styles['input-container']}>
                    <Typography variant='h3'>{nickname}</Typography>
                    <Button variant="contained" onClick={() => dispatch(setNickName(''))}>EDIT</Button>
                </div>
                : <form onSubmit={nicknameForm.handleSubmit(handleSendName)} className={styles['input-container']}>
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
            }

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
    );
};
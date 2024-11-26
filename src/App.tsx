import { useEffect, useRef, useState } from 'react';
import styles from './App.module.css';
import { useAppDispatch, useAppSelector } from './store';
import { createConnection, destroyConnection, sendClientName, sendMessage, userStopTyping, userTyping } from './chat-reducer';
import { debounce } from 'lodash';
import { useForm } from 'react-hook-form';

export type User = {
  id: string;
  name: string;
};

export type Message = {
  id: string;
  message: string;
  user: User;
};

function App() {
  const nicknameForm = useForm({ mode: "onChange" });
  const messageForm = useForm({ mode: "onChange" });

  const dispatch = useAppDispatch();

  const [message, setMessage] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [isScrollMode, setScrollMode] = useState<boolean>(true);

  const messages = useAppSelector((state) => state.chat.messages);
  const typingUsers = useAppSelector((state) => state.chat.typingUsers);

  useEffect(() => {
    dispatch(createConnection());
    return () => {
      dispatch(destroyConnection());
    };
  }, [dispatch]);

  const chatContainerRef = useRef<HTMLDivElement | null>(null);

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

  const handleSendMessage = () => {
    if (message.trim()) {
      dispatch(sendMessage(message));
      setMessage('');
    }
  };

  const handleSendName = () => {
    if (name.trim()) {
      dispatch(sendClientName(name));
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

  return (
    <div className={styles.App}>
      <div className={styles['parent-container']}>
        <div className={styles['chat-container']} ref={chatContainerRef} onScroll={handleScroll}>
          {messages.map(({ id, user, message }) => (
            <div className={styles.message} key={id}>
              <b>{user.name}: </b>
              <span>{message}</span>
              <hr />
            </div>
          ))}
          {typingUsers.map((u) => (
            <span key={u.id}>{u.name} is typing..., </span>
          ))}
        </div>

        {/* Форма для nickname */}
        <form onSubmit={nicknameForm.handleSubmit(handleSendName)} className={styles['input-container']}>
          <input
            type="text"
            placeholder="Enter nickname"
            value={name}
            {...nicknameForm.register("nickname", {
              required: "Nickname is required",
              maxLength: {
                value: 10,
                message: "Nickname cannot exceed 10 characters"
              },
              minLength: {
                value: 2,
                message: "Nickname must be at least 2 characters"
              }
            })}
            aria-invalid={nicknameForm.formState.errors.nickname ? "true" : "false"}
            onChange={(e) => setName(e.currentTarget.value)}
          />
          {nicknameForm.formState.errors.nickname && typeof nicknameForm.formState.errors.nickname.message === 'string' && (
            <p role="alert">{nicknameForm.formState.errors.nickname.message}</p>
          )}
          <button type="submit">ENTER NICKNAME</button>
        </form>

        {/* Форма для message */}
        <form onSubmit={messageForm.handleSubmit(handleSendMessage)} className={styles['input-container']}>
          <textarea
            rows={3}
            value={message}
            placeholder="Enter message"
            onKeyDown={handleTyping}
            onKeyUp={debouncedStopTyping}
            {...messageForm.register("message", {
              required: "Message is required",
              maxLength: {
                value: 100,
                message: "Message cannot exceed 100 characters"
              },
              minLength: {
                value: 2,
                message: "Message must be at least 2 characters"
              }
            })}
            onChange={(e) => setMessage(e.target.value)}
          />
          {messageForm.formState.errors.message && typeof messageForm.formState.errors.message.message === 'string' && (
            <p role="alert">{messageForm.formState.errors.message.message}</p>
          )}
          <button type='submit'>SEND MESSAGE</button>
        </form>
      </div>
    </div>
  );
}

export default App;

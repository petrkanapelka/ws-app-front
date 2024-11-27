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
  const nicknameForm = useForm<{ nickname: string }>({ mode: 'onChange' });

  const messageForm = useForm<{ message: string }>({ mode: 'onChange' });

  const dispatch = useAppDispatch();

  const [isScrollMode, setScrollMode] = useState<boolean>(true);

  const messages = useAppSelector((state) => state.chat.messages);
  const typingUsers = useAppSelector((state) => state.chat.typingUsers);

  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  // Initialize connection
  useEffect(() => {
    dispatch(createConnection());
    return () => {
      dispatch(destroyConnection());
    };
  }, [dispatch]);

  // Auto-scroll when messages update
  useEffect(() => {
    if (isScrollMode) {
      chatContainerRef.current?.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [isScrollMode, messages]);

  // Scroll handler
  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
      setScrollMode(isAtBottom);
    }
  };

  // Debounced typing stop handler
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
      <div className={styles.message} key={id}>
        <b>{user.name}: </b>
        <span>{message}</span>
        <hr />
      </div>
    ));

  const renderTypingUsers = () =>
    typingUsers.map((u) => <span key={u.id}>{u.name} is typing..., </span>);

  return (
    <div className={styles.App}>
      <div className={styles['parent-container']}>
        <div className={styles['chat-container']} ref={chatContainerRef} onScroll={handleScroll}>
          {renderMessages()}
        </div>
        {renderTypingUsers()}

        {/* Nickname Form */}
        <form onSubmit={nicknameForm.handleSubmit(handleSendName)} className={styles['input-container']}>
          <div>
            <input
              type="text"
              placeholder="Enter nickname"
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
              aria-invalid={nicknameForm.formState.errors.nickname ? 'true' : 'false'}
            />
            {nicknameForm.formState.errors.nickname && (
              <p role="alert">{nicknameForm.formState.errors.nickname.message}</p>
            )}
          </div>
          <button type="submit">ENTER NICKNAME</button>
        </form>

        {/* Message Form */}
        <form onSubmit={messageForm.handleSubmit(handleSendMessage)} className={styles['input-container']}>
          <div>
            <textarea
              rows={3}
              placeholder="Enter message"
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
              aria-invalid={messageForm.formState.errors.message ? 'true' : 'false'}
            />
            {messageForm.formState.errors.message && (
              <p role="alert">{messageForm.formState.errors.message.message}</p>
            )}
          </div>
          <button type="submit">SEND MESSAGE</button>
        </form>
      </div>
    </div>
  );
}

export default App;

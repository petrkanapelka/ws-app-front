import { useEffect, useRef, useState } from 'react';
import styles from './App.module.css';
import { useAppDispatch, useAppSelector } from './store';
import { createConnection, destroyConnection, sendClientName, sendMessage, userStopTyping, userTyping } from './chat-reducer';
import { debounce } from 'lodash';

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
        <div className={styles['input-container']}>
          <input
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
          />
          <button onClick={handleSendName}>APPROVE NAME</button>
        </div>
        <div className={styles['input-container']}>
          <textarea
            rows={3}
            value={message}
            placeholder="Enter message"
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleTyping}
            onKeyUp={debouncedStopTyping}
          />
          <button onClick={handleSendMessage}>SEND</button>
        </div>
      </div>
    </div>
  );
}

export default App;

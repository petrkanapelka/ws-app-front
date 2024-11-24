import { io, Socket } from 'socket.io-client';
import { useEffect, useRef, useState } from 'react';
import styles from './App.module.css';

const SOCKET_URL = 'http://localhost:3010';

type User = {
  id: string;
  name: string;
};

type Message = {
  id: string;
  message: string;
  user: User;
};

function App() {
  const [messages, setMessages] = useState<Message[]>([]);

  const [message, setMessage] = useState<string>('');

  const [name, setName] = useState<string>('')

  const [isScrollMode, setScrollMode] = useState<boolean>(true)

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL);

    socketRef.current.on('init-messages-published', (messages: Message[]) => {
      setMessages(messages)
    })

    socketRef.current.on('new-message-sent', (newMessage: Message) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

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
      socketRef.current?.emit('client-message-sent', message);
      setMessage('');
    }
  };

  const handleSendName = () => {
    if (name.trim()) {
      socketRef.current?.emit('client-name-sent', name);
    }
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
        </div>
        <div className={styles['input-container']}>
          <input type="text" placeholder='Enter name' value={name} onChange={(e) => setName(e.currentTarget.value)} />
          <button onClick={handleSendName}>APPROVE NAME</button>
        </div>
        <div className={styles['input-container']}>
          <textarea
            rows={3}
            value={message}
            placeholder='Enter message'
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={handleSendMessage}>SEND</button>
        </div>
      </div>
    </div>
  );
}

export default App;

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

  const [message, setMessage] = useState('Hello');

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL);
    socketRef.current.on('init-messages-published', (messages: Message[]) => {
      setMessages(messages)
    })

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const handleSendMessage = () => {
    if (message.trim()) {
      socketRef.current?.emit('client-message-sent', message);
      setMessage('');
    }
  };

  return (
    <div className={styles.App}>
      <div >
        <div className={styles['chat-container']}>
          {messages.map(({ id, user, message }) => (
            <div className={styles.message} key={id}>
              <b>{user.name}: </b>
              <span>{message}</span>
              <hr />
            </div>
          ))}
        </div>
        <div className={styles['input-container']}>
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={handleSendMessage}>SEND</button>
        </div>
      </div>
    </div>
  );
}

export default App;

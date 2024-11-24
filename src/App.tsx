import { io, Socket } from 'socket.io-client';
import { useEffect, useRef, useState } from 'react';
import styles from './App.module.css'; // Using CSS modules for better scoping

const SOCKET_URL = 'http://localhost:3010'; // Extracted to a constant for reusability

function App() {
  const [messages, setMessages] = useState([
    { message: "Hello, Viktor", id: "23f2332", user: { id: "sddsdsfds", name: "Dimych" } },
    { message: "Hello, Dimych", id: "23fd32c23", user: { id: "eefw2", name: "Viktor" } }
  ]);

  const [message, setMessage] = useState('Hello');

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL);

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
      <div className={styles.chatContainer}>
        {messages.map(({ id, user, message }) => (
          <div className={styles.message} key={id}>
            <b>{user.name}: </b>
            <span>{message}</span>
            <hr />
          </div>
        ))}
        <div className={styles.inputContainer}>
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

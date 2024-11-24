import React, { useState } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([
    { message: "Hello Viktor", id: "23f2332", user: { id: "sddsdsfds", name: "Dimych" } },
    { message: "Hello Dimych", id: "23fd32c23", user: { id: "eefw2", name: "Viktor" } }
  ]);

  return (
    <div className="App">
      <div>
      </div>
    </div>
  );
}

export default App;

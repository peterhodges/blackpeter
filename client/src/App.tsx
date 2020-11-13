import './App.css';
import Game from './Game';
import {GameState} from './../../server/src/Game';
import React, { useEffect, useState } from 'react';
import socketIOClient from 'socket.io-client';

function App() {
  const [state, setState] = useState("");

  useEffect(() => {
    // @ts-ignore
    const socket = socketIOClient("http://localhost:3000");

    socket.on("newState", (data: GameState) => {
      setState(JSON.stringify(data));
    });

    return () => socket.close();
  }, []);

  return (
    <div>
      <Game />
      <p>State: {state}</p>
    </div>
  );
}

export default App;

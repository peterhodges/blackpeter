import './App.css';
import Game from './Game';
import {GameState} from './../../server/src/Game';
import React, { useEffect, useState } from 'react';
import socketIOClient from 'socket.io-client';

function App() {

  // todo: Can we _not_ set state until it's available from the socket?
  // Setting it to {} first means <Game/> has to check that properties exist
  const [state, setState] = useState<GameState>();

  useEffect(() => {
    // @ts-ignore
    const socket = socketIOClient("http://localhost:3000");

    socket.on("newState", (data: GameState) => {
      setState(data);
    });

    return () => socket.close();
  }, []);

  return (
    <div>
      <Game game={state} />
    </div>
  );
}

export default App;

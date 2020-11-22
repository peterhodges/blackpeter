import './App.css';
import Game from './Game';
import Lobby from './Lobby';
import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

function App() {

  return (
    <Router>
      <Switch>
        <Route path="/game/:id" children={<Game />} />
        <Route path="/game" children={<Game />} />
        <Route path="/" children={<Lobby />} />
      </Switch>
    </Router>
  );
}

export default App;

import './App.css';
import Game from './Game';
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
        <Route path="/:id" children={<Game />} />
        <Route path="/" children={<Game />} />
      </Switch>
    </Router>
  );
}

export default App;

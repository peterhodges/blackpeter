import * as http from 'http';
import { Socket } from 'socket.io';
import { Game, GameState, PendingGameState } from './Game';

const app = http.createServer();
const io = require('socket.io')(app, {
  cors: {
    origin: "*",
  }
});

io.on('connection', (socket: Socket) => {
    console.log('user connected');
    let state: any;

    // todo: Ensure game isn't created if it already exists

    console.log("creating game");
    state = Game.create("24024242");
    state = Game.addPlayer(state, "Peter Hodges"); 
    state = Game.addPlayer(state, "Kata Lajko"); 
    state = Game.addPlayer(state, "Max McLeod");
    state = Game.start(state);

    pushState(state);
    
    socket.on('disconnect', () => console.log('user disconnected'));
    socket.on("action", action => {
      switch(action.type) {
        case "SELECT_CARD":
          state = Game.takeCard(state, action.player, action.card);
          pushState(state);
          break;
      }
    });
    

    function pushState(state: GameState) {
      console.log("Pushing new state from server");
      socket.emit("newState", state);
      // console.log(state); // for debugging
    }
});

app.listen(3000, () => { console.log('Listening on port 3000')});
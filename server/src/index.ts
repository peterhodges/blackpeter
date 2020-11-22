import * as http from 'http';
import { Socket } from 'socket.io';
import { Game, GameState, PendingGameState } from './Game';

interface SocketWithData extends Socket {
  userId: string;
}

const app = http.createServer();
const io = require('socket.io')(app, {
  cors: {
    origin: "*",
  }
});

let state: GameState | PendingGameState;


io.on('connection', (socket: SocketWithData) => {
    // @ts-ignore
    // const gameId: string = socket.handshake.query.game;
    // socket.join(gameId);

    socket.on('ehlo', (id: string, gameId?: string) => {
      socket.userId = id;
    
      if(!state) {
        state = Game.create("10000");
      }
  
      state = Game.connectPlayer(state, "<PLAYER_NAME>", id);

      pushState(state);
    });
    socket.on('disconnect', () => {  
      if(state) {
        state = Game.disconnectPlayer(<GameState>state, socket.userId);
        pushState(state);
      }
    });
    socket.on("action", action => {
      switch(action.type) {
        case "NEW_GAME": 
          const previousPlayers = [...state.players];

          state = Game.create(state.id);
          previousPlayers.forEach(player => {
            state = Game.addPlayer(state, player.name, player.id);
          });
          console.log("NEW_GAME", state);
          pushState(state);
          break;
        case "START_GAME":
          state = Game.start(state);
          pushState(state);
          break
        case "SELECT_CARD":
          // @ts-ignore
          const newState = Game.selectCard(state, action.player, action.card);
          if(newState) {
            state = newState;
            pushState(state);
          }
          break;
      }
    });

    function pushState(state: GameState | PendingGameState) {
      console.log("Pushing new state from server");
      // io.to(gameId).emit("newState", state);
      io.emit("newState", state);
      // console.log(state); // for debugging
    }
});

app.listen(3000, () => { console.log('Listening on port 3000')});
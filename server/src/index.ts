import * as http from 'http';
import * as fs from 'fs'
import { Socket } from 'socket.io';

const app = http.createServer(handler);
const io = require('socket.io')(app);

function handler (req: http.IncomingMessage, res: http.ServerResponse) {
    fs.readFile(__dirname + '/index.html', (err, data) => {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading index.html');
      }

      res.writeHead(200);
      res.end(data);
    });
}

io.on('connection', (socket: Socket) => {
    console.log('user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
      });

      setTimeout(() => {
        socket.emit("message", "This is a chat message from the server.");
      }, 1000)
    

});

app.listen(3000, () => { console.log('Listening on port 3000')});
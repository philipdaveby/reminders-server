import dotenv from 'dotenv'
dotenv.config();
import endpoint from './endpoints.config';
import express from "express";
import reminders from './routes/reminders'
import bodyParser from 'body-parser'
import { connect } from 'mongoose';
import * as admin from 'firebase-admin';
const cors = require('cors');
const serviceAccount = require('./serviceAccountKey.json');
import { Socket } from "socket.io";
import config from './utils/config';

const app = express();
const server = require('http').createServer(app)
const options = {
  cors: {
    credentials: true,
    origin: [config.frontend_url]
  }
}
const io = require('socket.io')(server, options);
const PORT = 8000;

let counter = 0;
io.on("connection", (socket: Socket) => {
  console.log(`socket number ${counter++} connected: ${socket.id}`)
  socket.on('add-todo', () => {
    console.log(`socket updating todo ${counter++} id: ${socket.id}`)
    io.sockets.emit('update-todos')
  });
});


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://Reminders-Development.firebaseio.com'
});

const validate = (req:express.Request, res:express.Response, next:express.NextFunction) => {   
  if (!req.headers.authorization) {
    res.status(500).send('You are not authorized');
    return;
  }    
  admin
  .auth()
  .verifyIdToken(req.headers.authorization)
  .then((decodedToken) => {
    const uid = decodedToken.uid;
    next()
  })
  .catch(error => {
    res.status(500).send(error.message);
    res.end();
    return;
  });
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(options.cors));
app.use(validate)
app.use('/', reminders);

server.listen(PORT, () => {
  console.log(`[server]: Server is running at ${config.backend_url}`);
});

const run = async ():Promise<void> => {
  await connect(endpoint.MongoDBUrl);
}

run()
.catch(err => console.log(err));
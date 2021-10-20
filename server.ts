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

// const validate = (req:express.Request, res:express.Response, next:express.NextFunction) => {   
//   // console.log('inside validate')
//   if (!req.headers.authorization) {
//     // console.log('inside validate if')
//     res.status(500).send('You are not authorized');
//     return;
//   }    
//   // console.log('authorization: ' + req.headers.authorization)
//   admin
//   .auth()
//   .verifyIdToken(req.headers.authorization)
//   .then((decodedToken) => {
//     const uid = decodedToken.uid;
//     console.log('data: ' + uid)
//     next()
//   })
//   .catch(error => {
//     res.status(500).send(error.message);
//     res.end();
//     return;
//   });
// }

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
// app.use(validate)
app.use('/', reminders);

server.listen(PORT, () => {
  console.log(`[server]: Server is running at ${config.backend_url}`);
});
const run = async ():Promise<void> => {
  await connect(endpoint.MongoDBUrl);
  
}

run()
.catch(err => console.log(err));


// interface Todo {
//   id: number,
//   task: string,
//   isComplete: boolean,
//   owner: string,
//   locked: boolean,
//   _id: ObjectId
// }

// const schema = new Schema<Todo>({
//   id: { type: Number, required: true},
//   task: { type: String, required: true},
//   isComplete: { type: Boolean, required: true},
//   owner: { type: String, required: true},
//   locked: { type: Boolean, required: true},
//   _id: ObjectId
// })

// const todoModel = model<Todo>('Todo', schema);


// type SubTask = {
//   id: number,
//   task: string,
//   isComplete: boolean,
//   owner: string,
//   locked: false
// }

// const schemaSubTask = new Schema<SubTask>({
//   id: { type: Number, required: true},
//   task: { type: String, required: true},
//   isComplete: { type: Boolean, required: true},
//   owner: { type: String, required: true},
//   locked: { type: Boolean, required: true}
// })

// mongoose
//   .connect('mongodb+srv://philip:MxmoQjK5Zay4@cluster0.mapna.mongodb.net/reminders?retryWrites=true&w=majority', () => {
//     console.log("Connected to db!");
//   })
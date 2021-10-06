import dotenv from 'dotenv'
dotenv.config();
import endpoint from './endpoints.config';
import express from "express";
import reminders from './routes/reminders'
import bodyParser from 'body-parser'
import { connect } from 'mongoose';
import * as admin from 'firebase-admin';
// import { request } from 'http';
// const cookieParser = require("cookie-parser");
// const csrf = require('csurf');
const cors = require('cors');
const serviceAccount = require('./serviceAccountKey.json');

// const csrfMiddleware = csrf({ cookie: true });

const app = express();
const PORT = 8000;

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
  .then(() => next())
  .catch(error => {
    res.status(500).send(error.message);
    res.end();
  })
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cookieParser());
app.use(cors());
app.use(validate)
app.use('/', reminders);

const run = async ():Promise<void> => {
  await connect(endpoint.MongoDBUrl);
  
  app.listen(PORT, () => {
    console.log(`[server]: Server is running at https://localhost:${PORT}`);
  });
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
import express from "express";
import reminders from './routes/reminders'
import bodyParser from 'body-parser'
import { Schema, model, connect } from 'mongoose';
import { ObjectId } from "mongodb";
import todoModel from "./models/Todo";
const cors = require('cors');

const app = express();
const PORT = 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/', reminders);

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

const run = async ():Promise<void> => {
  await connect('mongodb+srv://philip:MxmoQjK5Zay4@cluster0.mapna.mongodb.net/reminders?retryWrites=true&w=majority');
  
  // const doc = new todoModel({
  //   id: 5,
  //   task: 'Buy french fries',
  //   isComplete: false,
  //   owner: 'philip.daveby@gmail.com',
  //   locked: false
  // });

  // await doc.save();

  app.listen(PORT, () => {
    console.log(`[server]: Server is running at https://localhost:${PORT}`);
  });
  
}

run()
.catch(err => console.log(err));




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
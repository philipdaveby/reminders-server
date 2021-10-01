import mongoose, { Schema, model } from 'mongoose';
import { Todo } from '../types'
// // import { ObjectId } from "mongodb";

// interface Todo {
//   Todo: Todo
// }

const TodoSchema = new Schema<Todo>({
    todoId: { type: Number, required: true},
    task: { type: String, required: true},
    isComplete: { type: Boolean, required: true},
    owner: { type: String, required: true},
    locked: { type: Boolean, required: true},
    subTasks: { type: Array, required: true }
  });

//   type Todo = {
//     id: number,
//     task: string,
//     isComplete: boolean,
//     owner: string,
//     locked: boolean,
//     subTasks?: Array<SubTask>
// }

// type SubTask = {
//     id: number,
//     task: string,
//     isComplete: boolean,
//     owner: string,
//     locked: boolean
// }

//   interface Todo {
//     id: number,
//     task: string,
//     isComplete: boolean,
//     owner: string,
//     locked: boolean,
//     subTasks: SubTask
//   }

//   type SubTask = {
//     id: number,
//     task: string,
//     isComplete: boolean,
//     owner: string,
//     locked: boolean
// }

  const todoModel = model<Todo>('Todo', TodoSchema);

  export default todoModel;

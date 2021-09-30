import mongoose, { Schema, model } from 'mongoose';
// import { ObjectId } from "mongodb";

const TodoSchema = new Schema<Todo>({
    id: { type: Number, required: true},
    task: { type: String, required: true},
    isComplete: { type: Boolean, required: true},
    owner: { type: String, required: true},
    locked: { type: Boolean, required: true}
  });

  interface Todo {
    id: number,
    task: string,
    isComplete: boolean,
    owner: string,
    locked: boolean
  }

  const todoModel = model<Todo>('Todo', TodoSchema);

  export default todoModel;

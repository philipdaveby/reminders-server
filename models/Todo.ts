import { Schema, model } from 'mongoose';
import { Todo } from '../types'

const TodoSchema = new Schema<Todo>({
    todoId: { type: String, required: true},
    task: { type: String, required: true},
    isComplete: { type: Boolean, required: true},
    userId: { type: String, required: true},
    collaborators: { type: Array, required: true },
    locked: { type: Boolean, required: true},
    subTasks: { type: Array, required: true }
  });

  const todoModel = model<Todo>('Todo', TodoSchema);

  export default todoModel;

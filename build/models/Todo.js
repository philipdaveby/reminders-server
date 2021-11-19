"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const TodoSchema = new mongoose_1.Schema({
    todoId: { type: String, required: true },
    task: { type: String, required: true },
    isComplete: { type: Boolean, required: true },
    userId: { type: String, required: true },
    collaborators: { type: Array, required: true },
    locked: { type: Boolean, required: true },
    subTasks: { type: Array, required: true }
});
const todoModel = (0, mongoose_1.model)('Todo', TodoSchema);
exports.default = todoModel;

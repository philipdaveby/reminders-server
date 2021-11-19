"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Todo_1 = __importDefault(require("../models/Todo"));
const uuid_1 = require("uuid");
const getTodos = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield Todo_1.default.find({});
    }
    catch (_a) {
        throw new Error('Could not get to-dos');
    }
});
const addTodo = (todo) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doc = new Todo_1.default({
            todoId: (0, uuid_1.v4)(),
            task: todo.task,
            isComplete: false,
            userId: todo.userId,
            collaborators: [],
            locked: false,
            subTasks: []
        });
        yield doc.save();
    }
    catch (_b) {
        return { error: 'Could not create todo' };
    }
});
const completeTodo = (id, isComplete) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Todo_1.default.findOneAndUpdate({
            todoId: id,
        }, {
            $set: { isComplete, 'subTasks.$[].isComplete': isComplete }
        });
    }
    catch (_c) {
        return { error: 'Could not update todo' };
    }
});
const addCollaborator = (query, collaborator) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Todo_1.default.findOneAndUpdate(query, { $push: {
                collaborators: collaborator
            }
        });
    }
    catch (_d) {
        return { error: 'Could not add collaborator' };
    }
});
const addSubTask = (query, subTask) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Todo_1.default.findOneAndUpdate(query, { $push: {
                subTasks: {
                    "subId": (0, uuid_1.v4)(),
                    "task": subTask,
                    "isComplete": false,
                    "locked": false
                }
            } });
    }
    catch (_e) {
        return { error: 'Could not add collaborator' };
    }
});
const editTodo = (query, task) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Todo_1.default.findOneAndUpdate(query, {
            task: task
        });
    }
    catch (_f) {
        return { error: 'Could not edit to-do' };
    }
});
const completeSubTask = (id, subId, isComplete) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Todo_1.default.findOneAndUpdate({
            todoId: id,
            'subTasks.subId': subId
        }, {
            $set: { 'subTasks.$.isComplete': isComplete }
        });
    }
    catch (_g) {
        return { error: 'Could not complete sub task' };
    }
});
const editSubTask = (id, subId, subTask) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Todo_1.default.findOneAndUpdate({
            todoId: id,
            'subTasks.subId': subId
        }, {
            $set: { 'subTasks.$.task': subTask }
        });
    }
    catch (_h) {
        return { error: 'Could not update sub task' };
    }
});
const deleteSubTask = (id, subId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Todo_1.default.findOneAndUpdate({
            todoId: id
        }, {
            $pull: { subTasks: { subId } }
        });
    }
    catch (_j) {
        return { error: 'Could not delete sub task' };
    }
});
const deleteTodo = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Todo_1.default.deleteOne(query);
    }
    catch (_k) {
        return { error: 'Could not delete to-do' };
    }
});
module.exports = {
    addTodo,
    getTodos,
    completeTodo,
    addCollaborator,
    addSubTask,
    editTodo,
    completeSubTask,
    editSubTask,
    deleteSubTask,
    deleteTodo
};

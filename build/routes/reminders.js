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
const express_1 = __importDefault(require("express"));
const todo_1 = require("../permissions/todo");
const mongoose = require('../mongoose/functions');
const router = express_1.default.Router();
const handleError = (response, res) => {
    if (response === undefined)
        return;
    if (response.error) {
        res.status(404).send(response.error);
    }
};
router.get('/api/todos', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const cookie = req.headers.cookie;
    if ((cookie === null || cookie === void 0 ? void 0 : cookie.match(/[^user=]\w*$/)) === undefined || ((_a = cookie === null || cookie === void 0 ? void 0 : cookie.match(/[^user=]\w*$/)) === null || _a === void 0 ? void 0 : _a.length) === 0)
        return;
    if ((cookie === null || cookie === void 0 ? void 0 : cookie.match(/(?<=\=).*(?=;)/)) === undefined || ((_b = cookie === null || cookie === void 0 ? void 0 : cookie.match(/(?<=\=).*(?=;)/)) === null || _b === void 0 ? void 0 : _b.length) === 0)
        return;
    let email, userId;
    cookie.startsWith('email') ? userId = cookie.match(/(?<=user\=).*/)[0] : userId = cookie.match(/(?<=\=).*(?=;)/)[0];
    cookie.startsWith('email') ? email = cookie.match(/(?<=\=).*(?=;)/)[0] : email = cookie.match(/(?<=email\=).*/)[0];
    if (userId === undefined || email === undefined)
        return;
    const editedEmail = email.replace('%40', '@');
    try {
        const todos = yield mongoose.getTodos();
        res.status(200).send((0, todo_1.scopedTodos)(userId, editedEmail, todos));
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}));
router.post('/api/todos', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const databaseResponse = mongoose.addTodo(req.body.todoObject);
        handleError(databaseResponse, res);
        res.sendStatus(201);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}));
router.patch('/api/todos/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const query = { todoId: id };
    try {
        if (req.body.isComplete !== undefined) {
            const databaseResponse = yield mongoose.completeTodo(id, req.body.isComplete);
            handleError(databaseResponse, res);
            return res.sendStatus(204);
        }
        if (req.body.collaborator) {
            const databaseResponse = yield mongoose.addCollaborator(query, req.body.collaborator);
            handleError(databaseResponse, res);
            return res.sendStatus(204);
        }
        if (req.body.subTask) {
            const databaseResponse = yield mongoose.addSubTask(query, req.body.subTask);
            handleError(databaseResponse, res);
            return res.sendStatus(204);
        }
        if (req.body.task) {
            const databaseResponse = yield mongoose.editTodo(query, req.body.task);
            handleError(databaseResponse, res);
            return res.sendStatus(204);
        }
    }
    catch (_c) {
        res.status(404).send({ error: "Post doesn't exist!" });
    }
}));
router.patch('/api/todos/:id/subtasks/:subid', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const subId = req.params.subid;
    try {
        if (req.body.isComplete !== undefined) {
            const databaseResponse = yield mongoose.completeSubTask(id, subId, req.body.isComplete);
            handleError(databaseResponse, res);
            return res.sendStatus(204);
        }
        if (req.body.subTask) {
            const databaseResponse = yield mongoose.editSubTask(id, subId, req.body.subTask);
            handleError(databaseResponse, res);
            return res.sendStatus(204);
        }
    }
    catch (_d) {
        res.status(404).send({ error: "Post doesn't exist!" });
    }
}));
router.delete('/api/todos/:id/subtasks/:subid', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const subId = req.params.subid;
    try {
        const databaseResponse = yield mongoose.deleteSubTask(id, subId);
        handleError(databaseResponse, res);
        return res.sendStatus(204);
    }
    catch (_e) {
        res.status(404).send({ error: "Post doesn't exist!" });
    }
}));
router.delete('/api/todos/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const query = { todoId: id };
    try {
        const databaseResponse = yield mongoose.deleteTodo(query);
        handleError(databaseResponse, res);
        return res.sendStatus(204);
    }
    catch (_f) {
        res.status(404).send({ error: "Post doesn't exist!" });
    }
}));
exports.default = router;

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const admin = __importStar(require("firebase-admin"));
const router = express_1.default.Router();
const handleError = (response, res) => {
    if (response === undefined)
        return;
    if (response.error) {
        res.status(404).send(response.error);
    }
};
router.get('/api/todos', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //   jwt.verify(req.headers.authorization, (err: any, user: any) => {
    //     if (err) {
    //       console.log(err)
    //     }
    //     console.log(user)
    //   })
    // const cookie = req.headers.cookie;
    // if (cookie?.match(/[^user=]\w*$/) === undefined || cookie?.match(/[^user=]\w*$/)?.length === 0) return
    // if (cookie?.match(/(?<=\=).*(?=;)/) === undefined || cookie?.match(/(?<=\=).*(?=;)/)?.length === 0) return
    const userId = res.locals.userId;
    // let email;
    // cookie.startsWith('email') ? email = cookie.match(/(?<=\=).*(?=;)/)![0] : email = cookie.match(/(?<=email\=).*/)![0];
    // let email, userId;
    // cookie.startsWith('email') ? userId = cookie.match(/(?<=user\=).*/)![0] : userId = cookie.match(/(?<=\=).*(?=;)/)![0];
    // if (userId === undefined || email === undefined) return
    // const editedEmail = email.replace('%40', '@')
    try {
        const todos = yield mongoose.getTodos();
        res.status(200).send((0, todo_1.scopedTodos)(userId, todos));
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
            yield admin.auth().getUserByEmail(req.body.collaborator)
                .then((user) => __awaiter(void 0, void 0, void 0, function* () {
                const collaboratorObject = {
                    email: req.body.collaborator,
                    userId: user.uid
                };
                const databaseResponse = yield mongoose.addCollaborator(query, collaboratorObject);
                handleError(databaseResponse, res);
            }));
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
    catch (_a) {
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
    catch (_b) {
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
    catch (_c) {
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
    catch (_d) {
        res.status(404).send({ error: "Post doesn't exist!" });
    }
}));
exports.default = router;

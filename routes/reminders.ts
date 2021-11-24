import express, { Response } from 'express'
import { Todo } from '../types'
import { scopedTodos } from '../permissions/todo'
const mongoose = require('../mongoose/functions')
import * as admin from 'firebase-admin';

const router = express.Router();

const handleError = (response: { error: string }, res: Response) => {
    if (response === undefined) return
    if (response.error) {
        res.status(404).send(response.error)
    }
}

router.get('/api/todos', async (req, res) => {
    const userId = res.locals.userId
    
    try {
        const todos: Array<Todo> = await mongoose.getTodos();
        res.status(200).send(scopedTodos(userId, todos));
    } catch (error: any) {
        res.status(500).send(error.message);
    }
});

router.post('/api/todos', async (req, res) => {
    try {
        const databaseResponse = mongoose.addTodo(req.body.todoObject)
        handleError(databaseResponse, res);
        res.sendStatus(201);
    } catch (error: any) {
        res.status(500).send(error.message)
    }
});

router.patch('/api/todos/:id', async (req, res) => {

    const id = req.params.id;
    const query = { todoId: id };
    
    try {
        if (req.body.isComplete !== undefined) {
            const databaseResponse = await mongoose.completeTodo(id, req.body.isComplete);
            handleError(databaseResponse, res);
            return res.sendStatus(204)
        }

        if (req.body.collaborator) {
            await admin.auth().getUserByEmail(req.body.collaborator)
            .then(async user => {
                    const collaboratorObject = {
                        email: req.body.collaborator,
                        userId: user.uid
                    }
                    const databaseResponse = await mongoose.addCollaborator(query, collaboratorObject);
                    handleError(databaseResponse, res);
                })
            return res.sendStatus(204)
        }

        if (req.body.subTask) {
            const databaseResponse = await mongoose.addSubTask(query, req.body.subTask)
            handleError(databaseResponse, res);
            return res.sendStatus(204)
        }
        if (req.body.task) {
            const databaseResponse = await mongoose.editTodo(query, req.body.task);
            handleError(databaseResponse, res)
            return res.sendStatus(204)
        }

	} catch {
		res.status(404).send({ error: "Post doesn't exist!" })
	}
});

router.patch('/api/todos/:id/subtasks/:subid', async (req, res) => {
    const id = req.params.id;
    const subId = req.params.subid;
    try {
        if (req.body.isComplete !== undefined) {
            const databaseResponse = await mongoose.completeSubTask(id, subId, req.body.isComplete);
            handleError(databaseResponse, res)
            return res.sendStatus(204)
        }

        if (req.body.subTask) {
            const databaseResponse = await mongoose.editSubTask(id, subId, req.body.subTask);
            handleError(databaseResponse, res)
            return res.sendStatus(204)
        }
	} catch {
        res.status(404).send({ error: "Post doesn't exist!" })
	}
});
                    
router.delete('/api/todos/:id/subtasks/:subid', async (req, res) => {
    const id = req.params.id;
    const subId = req.params.subid;
    
    try {
    const databaseResponse = await mongoose.deleteSubTask(id, subId);
    handleError(databaseResponse, res)
    return res.sendStatus(204)
} catch {
    res.status(404).send({ error: "Post doesn't exist!" })
}
});

router.delete('/api/todos/:id', async (req, res) => {
    const id = req.params.id;
    const query = { todoId: id };
    
    try {
        const databaseResponse = await mongoose.deleteTodo(query);
        handleError(databaseResponse, res)
		return res.sendStatus(204);
	} catch {
		res.status(404).send({ error: "Post doesn't exist!" })
	}
});

export default router;

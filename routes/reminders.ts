import express from 'express'
import TodoModel from '../models/Todo'
import { Todo } from '../types'
import { v4 as uuidv4 } from 'uuid';
import { scopedTodos } from '../permissions/todo'
const mongoose = require('../mongoose/functions')

const router = express.Router();

router.get('/api/todos', async (req, res) => {
    const cookie = req.headers.cookie;
    if (cookie?.match(/[^user=]\w*$/) === undefined || cookie?.match(/[^user=]\w*$/)?.length === 0) return
    if (cookie?.match(/(?<=\=).*(?=;)/) === undefined || cookie?.match(/(?<=\=).*(?=;)/)?.length === 0) return
    
    let email, userId;
    cookie.startsWith('email') ? userId = cookie.match(/(?<=user\=).*/)![0] : userId = cookie.match(/(?<=\=).*(?=;)/)![0];
    cookie.startsWith('email') ? email = cookie.match(/(?<=\=).*(?=;)/)![0] : email = cookie.match(/(?<=email\=).*/)![0];

    if (userId === undefined || email === undefined) return
    
    const editedEmail = email.replace('%40', '@')

    try {
        const todos: Array<Todo> = await TodoModel.find({});
        res.status(200).send(scopedTodos(userId, editedEmail, todos));
    } catch (error: any) {
        res.status(500).send(error.message);
    }
});

router.post('/api/todos', async (req, res) => {
    try {
        mongoose.addTodo(req.body.todoObject)
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
            await TodoModel.findOneAndUpdate({
                todoId: id,
            }, 
            {
                $set: { isComplete: req.body.isComplete, 'subTasks.$[].isComplete':  req.body.isComplete }
            })
            res.sendStatus(204)
        }

        if (req.body.collaborator) {
            await TodoModel.findOneAndUpdate(
                query, {$push: { 
                    collaborators: req.body.collaborator
                }})
            res.sendStatus(204)
        }

        if (req.body.subTask) {
            await TodoModel.findOneAndUpdate(
                query, {$push: { 
                    subTasks: {
                        "subId": uuidv4(),
                        "task": req.body.subTask,
                        "isComplete": false,
                        "locked": false
                    }
                }})
            res.sendStatus(204)
        }
        if (req.body.task) {
            await TodoModel.findOneAndUpdate(
                query,
                {
                    task: req.body.task
                });
            res.sendStatus(204)
        }

	} catch {
		res.status(404).send({ error: "Post doesn't exist!" })
	}
})

router.patch('/api/todos/:id/subtasks/:subid', async (req, res) => {
    const id = req.params.id;
    const subId = req.params.subid;
    try {
        if (req.body.isComplete !== undefined) {
            await TodoModel.findOneAndUpdate({
                todoId: id,
                'subTasks.subId': subId
            }, {
                $set: { 'subTasks.$.isComplete': req.body.isComplete }
            }).then(() => res.sendStatus(204))
            .catch(() => res.status(404).send({ error: "Post doesn't exist!" }));
        }

        if (req.body.subTask) {
            await TodoModel.findOneAndUpdate({
                todoId: id,
                'subTasks.subId': subId
            }, {
                $set: { 'subTasks.$.task':  req.body.subTask }
            }).then(() => res.sendStatus(204))
            .catch(() => res.status(404).send({ error: "Post doesn't exist!" }));
        }
	} catch {
		res.status(404).send({ error: "Post doesn't exist!" })
	}
})

router.put('/api/todos/:id', async (req, res) => {
    const id = req.params.id;
    const query = { todoId: id };
    
    try {
        const todo = await TodoModel.findOneAndUpdate(
            query,
            { 
                task: req.body.task 
            });
            res.status(200).send(todo)
	} catch {
		res.status(404).send({ error: "Post doesn't exist!" })
	}
});

router.delete('/api/todos/:id/subtasks/:subid', async (req, res) => {
    const id = req.params.id;
    const subId = req.params.subid;

    try {
        await TodoModel.findOneAndUpdate(
            { 
                todoId: id
            },
            {
                $pull: { subTasks: { subId } }
            })
            .then(() => res.sendStatus(204))
            .catch(() => res.status(404).send({ error: "Post doesn't exist!" }));
    } catch {
        res.status(404).send({ error: "Post doesn't exist!" })
    }
});

router.delete('/api/todos/:id', async (req, res) => {
    const id = req.params.id;
    const query = { todoId: id };

    try {
		await TodoModel.deleteOne(query)
		res.sendStatus(204);
	} catch {
		res.status(404).send({ error: "Post doesn't exist!" })
	}
});

export default router;

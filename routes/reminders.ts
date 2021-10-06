import express from 'express'
// import { ObjectId } from "mongodb";
import TodoModel from '../models/Todo'
import { Todo } from '../types'
import * as admin from 'firebase-admin';

const router = express.Router();

router.post('/api/todos', async (req, res) => {
    try {
        const todos: Array<Todo> = await TodoModel.find({});
        res.status(200).send(todos);
    } catch (error: any) {
        res.status(500).send(error.message);
    }
});

router.post('/api/todo', async (req, res) => {
    const subTasks = req.body.subTasks;
    try {
        const doc = new TodoModel({
        todoId: Math.floor(Math.random()*10000),
        task: req.body.task,
        isComplete: false,
        owner: 'philip.daveby@gmail.com',
        locked: false,
        subTasks
      });
    
      await doc.save();
      res.sendStatus(201);
    } catch (error: any) {
        res.status(500).send(error.message)
    }
});

router.patch('/api/todo/:id', async (req, res) => {

    const id = parseInt(req.params.id);
    const query = { todoId: id };
    
    try {
        const todo = await TodoModel.findOneAndUpdate(
            query,
            {
                isComplete: req.body.isComplete
            });
            res.status(204).send()

	} catch {
		res.status(404)
		res.send({ error: "Post doesn't exist!" })
	}
})

router.delete('/api/todo/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const query = { todoId: id };

    try {
		await TodoModel.deleteOne(query)
		res.status(204).send()
	} catch {
		res.status(404)
		res.send({ error: "Post doesn't exist!" })
	}
})


export default router;

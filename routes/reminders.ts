import express from 'express'
// import { ObjectId } from "mongodb";
import TodoModel from '../models/Todo'
import { Todo } from '../types'
import * as admin from 'firebase-admin';

const router = express.Router();

router.get('/api/todos', async (req, res) => {

    try {
        const todos: Array<Todo> = await TodoModel.find({});
        res.status(200).send(todos);
    } catch (error: any) {
        res.status(500).send(error.message);
    }
});

// router.post('/api/todos', async (req, res) => {

//     try {
//         const todos: Array<Todo> = await TodoModel.find({});
//         res.status(200).send(todos);
//     } catch (error: any) {
//         res.status(500).send(error.message);
//     }
// });

router.post('/api/todos', async (req, res) => {
    console.log('adding')
    try {
        const doc = new TodoModel({
        todoId: Math.floor(Math.random()*100000),
        task: req.body.task,
        isComplete: false,
        owner: 'philip.daveby@gmail.com',
        locked: false,
        subTasks: []
      });
    
      await doc.save();
      res.sendStatus(201);
    } catch (error: any) {
        res.status(500).send(error.message)
    }
});

router.patch('/api/todos/:id', async (req, res) => {

    const id = parseInt(req.params.id);
    const query = { todoId: id };
    
    try {
        if (req.body.isComplete !== undefined) {
            await TodoModel.findOneAndUpdate(
                query,
                {
                    isComplete: req.body.isComplete
                });
            return res.status(204).send();
        }
        if (req.body.subTask) {
            const newSubTask = {
                "subId": Math.floor(Math.random()*100000),
                "task": req.body.subTask,
                "isComplete": false,
                "owner": "philip.daveby@gmail.com",
                "locked": false
            }
            await TodoModel.find(query)
            .then( async (todo) => {
                    const newSubObject = todo[0].subTasks ? {subTasks: [...todo[0].subTasks, newSubTask]} : {subTasks: [newSubTask]}
                    console.log(todo[0].subTasks);
                    console.log(newSubTask);
                    await TodoModel.findOneAndUpdate(query, newSubObject);
                    res.status(204).send()
                });
        }

	} catch {
		res.status(404)
		res.send({ error: "Post doesn't exist!" })
	}
})

router.patch('/api/todos/:id/subtasks/:subid', async (req, res) => {

    const id = parseInt(req.params.id);
    const subId = parseInt(req.params.subid);
    const query = { todoId: id };
    res.send();
    try {
        if (req.body.isComplete !== undefined) {
            console.log('got a req with id: ' + id + ' and subId: ' + subId)
            const todo = await TodoModel.find(query)
            .then(async todo => {
                    if (todo[0].subTasks === undefined) {
                        return;
                    }
                    const newSubTasks = todo[0].subTasks.map(subTaskObject => {
                        if (subTaskObject.subId !== subId) {
                            return subTaskObject;
                        }
                        subTaskObject.isComplete = !subTaskObject.isComplete
                        return subTaskObject;
                    });
                    await TodoModel.findOneAndUpdate(
                        query,
                        {
                            subTasks: [...newSubTasks]
                        }).then(() => res.status(204).send());
                }).catch(() => new Error)

        }
        // if (req.body.subTask) {
        //     const newSubTask = {
        //         "subId": Math.floor(Math.random()*100000),
        //         "task": req.body.subTask,
        //         "isComplete": false,
        //         "owner": "philip.daveby@gmail.com",
        //         "locked": false
        //     }
        //     await TodoModel.find(query)
        //     .then( async (todo) => {
        //             const newSubObject = todo[0].subTasks ? {subTasks: [...todo[0].subTasks, newSubTask]} : {subTasks: [newSubTask]}
        //             console.log(todo[0].subTasks);
        //             console.log(newSubTask);
        //             await TodoModel.findOneAndUpdate(query, newSubObject);
        //             res.status(204).send()
        //         });
        // }

	} catch {
		res.status(404)
		res.send({ error: "Post doesn't exist!" })
	}
})

router.put('/api/todos/:id', async (req, res) => {
    
    const id = parseInt(req.params.id);
    const query = { todoId: id };
    
    try {
        const todo = await TodoModel.findOneAndUpdate(
            query,
            {
                task: req.body.task
            });
            res.status(200).send(todo)

	} catch {
		res.status(404)
		res.send({ error: "Post doesn't exist!" })
	}
})

router.delete('/api/todos/:id', async (req, res) => {
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

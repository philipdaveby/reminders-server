import express from 'express'
// import { ObjectId } from "mongodb";
import TodoModel from '../models/Todo'
import { SubTask, Todo } from '../types'
import * as admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';
import { canViewTodo, scopedTodos } from '../permissions/todo'

const router = express.Router();

router.get('/api/todos', async (req, res) => {
    const cookie = req.headers.cookie;
    if (cookie?.match(/[^user=]\w*$/) === undefined || cookie?.match(/[^user=]\w*$/)?.length === 0) return
    if (cookie?.match(/(?<=\=).*(?=;)/) === undefined || cookie?.match(/(?<=\=).*(?=;)/)?.length === 0) return
    let email, userId;
    if (cookie.startsWith('email')) {
        userId = cookie.match(/(?<=user\=).*/)![0];
        email = cookie.match(/(?<=\=).*(?=;)/)![0];
    }
    if (cookie.startsWith('user')) {
        userId = cookie.match(/(?<=\=).*(?=;)/)![0];
        email = cookie.match(/(?<=email\=).*/)![0];
    }
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
        const doc = new TodoModel({
        todoId: uuidv4(),
        task: req.body.todoObject.task,
        isComplete: false,
        userId: req.body.todoObject.userId,
        collaborators: [],
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

    const id = req.params.id;
    const query = { todoId: id };
    
    try {
        // if (req.body.isComplete !== undefined) {
        //     console.log(req.body.isComplete)
        //     const todos = await TodoModel.findOne(query)
        //         .then((todo: any) => {
        //             todo.subTasks.map((subTask: SubTask) => {
        //                 return subTask.isComplete = req.body.isComplete;
        //             })
        //             todo.save();
        //         });
        //     return res.status(200).send(todos);
        // }
        // if (req.body.isComplete !== undefined) {
        //     const todos = await TodoModel.findOneAndUpdate(
        //         query,
        //         (todo: Todo) => {todo?.subTasks?.map((subTask: SubTask) => subTask.isComplete = req.body.isComplete)}, {new: true});
        //     return res.status(200).send(todos);
        // }
        
        if (req.body.isComplete !== undefined) {
            let newTodo = await TodoModel.findOne(query);
            newTodo?.subTasks?.map(subTask => {
                return subTask.isComplete = req.body.isComplete
            });
            if (newTodo?.subTasks === null) return;
            let editedTodo = {
                ...newTodo,
                isComplete: req.body.isComplete,
                subTasks: newTodo?.subTasks
            }
            await TodoModel.findOneAndUpdate(query, editedTodo)
            res.status(204).send()

            // let todo = await TodoModel.findOne(query);
            // if (todo === null || todo === undefined) return;
            
            // todo.subTasks?.forEach(subTask => subTask.isComplete = req.body.isComplete);
            // const newSubTasks: Array<SubTask> = [];
            
            // todo.subTasks?.forEach(subTask => {
            //     subTask.isComplete = req.body.isComplete
            //     newSubTasks.push(subTask);
            // });
            // todo.subTasks = newSubTasks;
            // todo.save();
            // let todo1 = await TodoModel.findOne(query);
            // if (todo1 === null || todo1 === undefined) return;

            // todo1.isComplete = req.body.isComplete;
            // console.log(todo)
            // console.log(todo1)
            // todo1.save();
            // return res.status(204).send()
        }
        // if (req.body.isComplete !== undefined) {
        //     const todos = await TodoModel.findOneAndUpdate(
        //         query,
        //         {
        //             isComplete: req.body.isComplete,
        //         }, {new: true});
        //     return res.status(200).send(todos);
        // }

        if (req.body.collaborator) {
            const todo = await TodoModel.findOneAndUpdate(
                query, {$push: { 
                    collaborators: req.body.collaborator
                }})
            res.status(200).send(todo)
        }

        if (req.body.subTask) {
            const newSubTask = {
                "subId": uuidv4(),
                "task": req.body.subTask,
                "isComplete": false,
                "locked": false
            }
            await TodoModel.find(query)
            .then( async (todo) => {
                    const newSubObject = todo[0].subTasks ? {subTasks: [...todo[0].subTasks, newSubTask]} : {subTasks: [newSubTask]}
                    await TodoModel.findOneAndUpdate(query, newSubObject);
                    res.status(204).send()
                });
        }
        if (req.body.task) {
            const todo = await TodoModel.findOneAndUpdate(
                query,
                {
                    task: req.body.task
                });
            res.status(204).send()
        }

	} catch {
		res.status(404)
		res.send({ error: "Post doesn't exist!" })
	}
})

router.patch('/api/todos/:id/subtasks/:subid', async (req, res) => {
    const id = req.params.id;
    const subId = req.params.subid;
    const query = { todoId: id };
    try {
        if (req.body.isComplete !== undefined) {
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

        if (req.body.subTask) {
            const todo = await TodoModel.find(query)
            .then(async todo => {
                    if (todo[0].subTasks === undefined) {
                        return;
                    }
                    const newSubTasks = todo[0].subTasks.map(subTaskObject => {
                        if (subTaskObject.subId !== subId) {
                            return subTaskObject;
                        }
                        subTaskObject.task = req.body.subTask
                        return subTaskObject;
                    });
                    await TodoModel.findOneAndUpdate(
                        query,
                        {
                            subTasks: [...newSubTasks]
                        }).then(() => res.status(204).send());
                }).catch(() => new Error)
        }

	} catch {
		res.status(404)
		res.send({ error: "Post doesn't exist!" })
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
		res.status(404)
		res.send({ error: "Post doesn't exist!" })
	}
});

router.delete('/api/todos/:id/subtasks/:subid', async (req, res) => {
    const id = req.params.id;
    const subId = req.params.subid;
    const query = { todoId: id };

    try {
        const todo = await TodoModel.find(query)
        .then(async todo => {
                if (todo[0].subTasks === undefined) {
                    return;
                }
                const modifiedSubTasks = todo[0].subTasks;
                const index = modifiedSubTasks.findIndex(sub => sub.subId === subId);
                modifiedSubTasks.splice(index, 1);
    
                await TodoModel.findOneAndUpdate(
                    query,
                    {
                        subTasks: [...modifiedSubTasks]
                    }).then(() => res.status(204).send());
            }).catch(() => res.status(404).send({ error: "Post doesn't exist!" }));
    } catch {
        res.status(404)
		res.send({ error: "Post doesn't exist!" })
    }
});

router.delete('/api/todos/:id', async (req, res) => {
    const id = req.params.id;
    const query = { todoId: id };

    try {
		await TodoModel.deleteOne(query)
		res.status(204).send()
	} catch {
		res.status(404)
		res.send({ error: "Post doesn't exist!" })
	}
});


export default router;

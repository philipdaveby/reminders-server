import express from 'express'
import fs from 'fs'
import { ObjectId } from "mongodb";
import TodoModel from '../models/Todo'
import { Todo } from '../types'

const router = express.Router();

router.post('/api/todos', async (req, res) => {
    try {
        const todos: Array<Todo> = await TodoModel.find({});

        res.status(200).send(todos);
    } catch (error: any) {
        res.status(500).send(error.message);
    }
})

router.post('/api/todo', async (req, res) => {
    const doc = new TodoModel({
    todoId: Math.floor(Math.random()*10000),
    task: req.body.task,
    isComplete: false,
    owner: 'philip.daveby@gmail.com',
    locked: false,
    subTasks: []
  });

  await doc.save();
  res.sendStatus(201);
});

router.patch('/api/todo/:id', async (req, res) => {

    const id = parseInt(req.params.id);
    const query = { todoId: id };
    console.log(id)
    console.log(query)

    
    try {
        const todo = await TodoModel.findOneAndUpdate(
            { todoId: id },
            {
                isComplete: req.body.isComplete
            }
            );
            console.log(todo)
        // if (todo) {
        //     // console.log('todo: '+todo.isComplete)
        //     console.log('id: ' + id + 'req: '+req.body.isComplete)
        //     // req.body.isComplete ? todo.isComplete = true : todo.isComplete = false;
        //     if (req.body.isComplete) {
        //         todo.isComplete = true
        //     }
        //     if (!req.body.isComplete) {
        //         todo.isComplete = false
        //     }
        //     // console.log('id: ' + id + 'req: '+req.body.isComplete)
        //     await todo.save();
            res.status(204).send()
            // console.log('todo2: '+todo.isComplete)
        // }
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

// const getTodos = () => {
//     return new Promise((res, rej) => {
//         fs.readFile('todos.json', (err, data) => {
//             if (err) rej(err);
//             res(data);
//         });
//     })
// }

// const newTodo = (todo: any) => {
//     return new Promise((res, rej) => {
//         fs.writeFile('todos.json', todo, err => {
//             if (err) rej(err);
//             res(JSON.stringify(todo))
//         });
//     });
// }

// const newTodo = async (todo: Todo) => {
//     let newTodos: string;

//     await getTodos()
//         .then((data: any) => newTodos = JSON.stringify([...JSON.parse(data.toString()), todo]))
    
//     return new Promise((res, rej) => {
//         fs.writeFile('todos.json', newTodos, err => {
//             if (err) rej(err);
//             res(newTodos)
//         });
//     });
// }
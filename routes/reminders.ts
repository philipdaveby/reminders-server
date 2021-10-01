import express from 'express'
import fs from 'fs'
import { ObjectId } from "mongodb";
import TodoModel from '../models/Todo'

const router = express.Router();

const getTodos = () => {
    return new Promise((res, rej) => {
        fs.readFile('todos.json', (err, data) => {
            if (err) rej(err);
            res(data);
        });
    })
}

const readTodos = () => {

}

// const newTodo = (todo: any) => {
//     return new Promise((res, rej) => {
//         fs.writeFile('todos.json', todo, err => {
//             if (err) rej(err);
//             res(JSON.stringify(todo))
//         });
//     });
// }

type Todo = {
    id: number,
    task: string,
    isComplete: boolean,
    owner: string,
    locked: boolean,
    _id?: ObjectId
}

type subTask = {
    id: number,
    task: string,
    isComplete: boolean,
    owner: string,
    locked: false
}

const newTodo = async (todo: Todo) => {
    let newTodos: string;

    await getTodos()
        .then((data: any) => newTodos = JSON.stringify([...JSON.parse(data.toString()), todo]))
    
    return new Promise((res, rej) => {
        fs.writeFile('todos.json', newTodos, err => {
            if (err) rej(err);
            res(newTodos)
        });
    });
}

router.post('/api/', async (req, res) => {
    try {
        const todos: Array<Todo> = await TodoModel.find({});

        res.status(200).send(todos);
    } catch (error: any) {
        res.status(500).send(error.message);
    }
})

router.get('/', async (req, res) => {
    getTodos()
    .then((data: any) => res.send(data.toString()))
});

router.post('/', async (req, res) => {
    const doc = new TodoModel({
    id: Math.floor(Math.random()*10000),
    task: req.body.task,
    isComplete: false,
    owner: 'philip.daveby@gmail.com',
    locked: false
  });

  await doc.save();
  res.sendStatus(201);

    // newTodo({
    //     id: Math.floor(Math.random()*10000),
    //     task: req.body.task,
    //     isComplete: false,
    //     owner: "philip.daveby@gmail.com",
    //     locked: false
    // })
});

export default router;

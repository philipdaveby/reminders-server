import express from 'express'
import fs from 'fs'

const router = express.Router();

const getTodos = () => {
    return new Promise((res, rej) => {
        fs.readFile('todos.json', (err, data) => {
            if (err) rej(err);
            res(data);
        });
    })
}

// const newTodo = (todo: any) => {
//     return new Promise((res, rej) => {
//         fs.writeFile('todos.json', todo, err => {
//             if (err) rej(err);
//             res(JSON.stringify(todo))
//         });
//     });
// }

const newTodo = async (todo: any) => {

    let todos: any;
    let newTodos: any;

    await getTodos()
        .then((data: any) => todos = data.toString())
        .then(() => newTodos = JSON.stringify([...JSON.parse(todos), todo]))
    
    return new Promise((res, rej) => {
        fs.writeFile('todos.json', newTodos, err => {
            if (err) rej(err);
            res(newTodos)
        });
    });
}

router.get('/', async (req, res) => {
    getTodos()
    .then((data: any) => console.log(res.send(data.toString())))
});

router.post('/', async (req, res) => {
    newTodo({
        "id": Math.floor(Math.random()*10000),
        "task": req.body.task,
        "isComplete": false,
        "owner": "philip.daveby@gmail.com",
        "locked": false,
        "subtasks": []
    })
    res.sendStatus(201);
});

export default router;

import TodoModel from '../models/Todo'
import { Todo, Query, SubTask } from '../types'
import { v4 as uuidv4 } from 'uuid';

const getTodos = async () => {
    try {
        return await TodoModel.find({});
    } catch {
        throw new Error('Could not get to-dos')
    }
}

const addTodo = async (todo: Todo) => {
    try {
        const doc = new TodoModel({
            todoId: uuidv4(),
            task: todo.task,
            isComplete: false,
            userId: todo.userId,
            collaborators: [],
            locked: false,
            subTasks: []
        });
        await doc.save();
    } catch {
        return { error: 'Could not create todo' }
    }
}

const completeTodo = async (id: string, isComplete: boolean) => {
    try {
        await TodoModel.findOneAndUpdate({
            todoId: id,
        }, 
        {
            $set: { isComplete, 'subTasks.$[].isComplete':  isComplete }
        });
    } catch {
        return { error: 'Could not update todo' }
    }
}

const addCollaborator = async (query: Query, collaborator: string) => {
    try {
        await TodoModel.findOneAndUpdate(
            query, 
            {$push: 
                { 
                collaborators: collaborator
                }
            })
    } catch {
        return { error: 'Could not add collaborator' }
    }
}

const addSubTask = async (query: Query, subTask: SubTask) => {
    try {
        await TodoModel.findOneAndUpdate(
            query, {$push: { 
                subTasks: {
                    "subId": uuidv4(),
                    "task": subTask,
                    "isComplete": false,
                    "locked": false
                }
            }})
    } catch {
        return { error: 'Could not add collaborator' }
    }
}


const editTodo = async (query: Query, task: string) => {
    try {
        await TodoModel.findOneAndUpdate(
            query,
            {
                task: task
            });
    } catch {
        return { error: 'Could not edit to-do' }
    }
}

const completeSubTask = async (id: string, subId: string, isComplete: boolean) => {
    try {
        await TodoModel.findOneAndUpdate({
            todoId: id,
            'subTasks.subId': subId
        }, {
            $set: { 'subTasks.$.isComplete': isComplete }
        })
    } catch {
        return { error: 'Could not complete sub task' }
    }
}

const editSubTask = async (id: string, subId: string, subTask: string) => {
    try {
        await TodoModel.findOneAndUpdate({
            todoId: id,
            'subTasks.subId': subId
        }, {
            $set: { 'subTasks.$.task':  subTask }
        })
    } catch {
        return { error: 'Could not update sub task' }
    }
}

const deleteSubTask = async (id: string, subId: string) => {
    try {
        await TodoModel.findOneAndUpdate(
            { 
                todoId: id
            },
            {
                $pull: { subTasks: { subId } }
            });
    } catch {
        return { error: 'Could not delete sub task' }
    }
}

const deleteTodo = async (query: Query) => {
    try {
        await TodoModel.deleteOne(query)
    } catch {
        return { error: 'Could not delete to-do' }
    }
}




module.exports = {
    addTodo,
    getTodos,
    completeTodo,
    addCollaborator,
    addSubTask,
    editTodo,
    completeSubTask,
    editSubTask,
    deleteSubTask,
    deleteTodo
}
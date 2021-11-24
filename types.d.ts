export type Todo = {
    todoId: string,
    task: string,
    isComplete: boolean,
    userId: string,
    collaborators?: Array<Collaborators>,
    locked: boolean,
    subTasks?: Array<SubTask>
}

export type Query = {
    todoId: string
}

export type SubTask = {
    subId: string,
    task: string,
    isComplete: boolean,
    locked: boolean
}

export type Collaborators = {
    userId: string,
    email: string
}

type String = string
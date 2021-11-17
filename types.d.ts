export type Todo = {
    todoId: string,
    task: string,
    isComplete: boolean,
    userId: string,
    collaborators?: Array<String>,
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

type String = string
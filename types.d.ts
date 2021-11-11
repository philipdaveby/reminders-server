export type Todo = {
    todoId: string,
    task: string,
    isComplete: boolean,
    userId: string,
    locked: boolean,
    subTasks?: Array<SubTask>
}

type SubTask = {
    subId: string,
    task: string,
    isComplete: boolean,
    userId: string,
    locked: boolean
}
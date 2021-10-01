export type Todo = {
    todoId: number,
    task: string,
    isComplete: boolean,
    owner: string,
    locked: boolean,
    subTasks?: Array<SubTask>
}

type SubTask = {
    todoId: number,
    task: string,
    isComplete: boolean,
    owner: string,
    locked: boolean
}
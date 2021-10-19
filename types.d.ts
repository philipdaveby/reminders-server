export type Todo = {
    todoId: number,
    task: string,
    isComplete: boolean,
    owner: string,
    locked: boolean,
    subTasks?: Array<SubTask>
}

type SubTask = {
    subId: number,
    task: string,
    isComplete: boolean,
    owner: string,
    locked: boolean
}
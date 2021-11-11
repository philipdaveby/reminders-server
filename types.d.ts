export type Todo = {
    todoId: string,
    task: string,
    isComplete: boolean,
    userId: string,
    collaborators: Array<String>,
    locked: boolean,
    subTasks?: Array<SubTask>
}

type SubTask = {
    subId: string,
    task: string,
    isComplete: boolean,
    locked: boolean
}
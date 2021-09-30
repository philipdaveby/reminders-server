type Todo = {
    id: number,
    task: string,
    isComplete: boolean,
    owner: string,
    locked: false,
    subtasks: subTask[]
}

type subTask = {
    id: number,
    task: string,
    isComplete: boolean,
    owner: string,
    locked: false
}
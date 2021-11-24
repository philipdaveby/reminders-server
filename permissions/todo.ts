import { Todo } from '../types'

const canViewTodo = (userId: String, todo: Todo) => {
    return (todo.userId === userId);
}

const scopedTodos = (userId: string, todos: Array<Todo>) => {
    return todos.filter(todo => todo.userId === userId || todo.collaborators?.some(user => user.userId === userId));
}

export {
    canViewTodo,
    scopedTodos
}
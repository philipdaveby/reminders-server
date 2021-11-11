import { Todo } from '../types'

const canViewTodo = (userId: String, todo: Todo) => {
    return (todo.userId === userId);
}

const scopedTodos = (userId: string, email: string, todos: Array<Todo>) => {
    return todos.filter(todo => {
        return todo.userId === userId || todo.collaborators?.includes(email)
    });
}

// const scopedExercises = (user, exercises) => {
//     return exercises.filter(exercise => exercise.user === user || exercise.user === 'all');
// }

export {
    canViewTodo,
    scopedTodos
}
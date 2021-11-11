import { Todo } from '../types'

const canViewTodo = (userId: String, todo: Todo) => {
    return (todo.userId === userId);
}

const scopedTodos = (userId: String, todos: Array<Todo>) => {
    return todos.filter(todo => todo.userId === userId);
}

// const scopedExercises = (user, exercises) => {
//     return exercises.filter(exercise => exercise.user === user || exercise.user === 'all');
// }

export {
    canViewTodo,
    scopedTodos
}
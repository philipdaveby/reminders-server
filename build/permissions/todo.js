"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scopedTodos = exports.canViewTodo = void 0;
const canViewTodo = (userId, todo) => {
    return (todo.userId === userId);
};
exports.canViewTodo = canViewTodo;
const scopedTodos = (userId, todos) => {
    return todos.filter(todo => { var _a; return todo.userId === userId || ((_a = todo.collaborators) === null || _a === void 0 ? void 0 : _a.some(user => user.userId === userId)); });
};
exports.scopedTodos = scopedTodos;

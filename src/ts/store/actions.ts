import { ADD_TODO, EDIT_TODO, DELETE_TODO, TodoActionType, AddTodo, EditTodo, DeleteTodo } from './types';

export const addTodo: AddTodo = (name, description): TodoActionType => ({
    type: ADD_TODO,
    payload: { name, description }
});

export const editTodo: EditTodo = (id, name, description): TodoActionType => ({
    type: EDIT_TODO,
    payload: { id, name, description }
});

export const deleteTodo: DeleteTodo = (id): TodoActionType => ({
    type: DELETE_TODO,
    payload: { id }
});

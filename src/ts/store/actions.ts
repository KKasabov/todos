import { ADD_TODO, EDIT_TODO, DELETE_TODO, TOGGLE_TODO_COMPLETE, TodoActionType, AddTodo, EditTodo, DeleteTodo, ToggleTodoComplete } from './types';

export const addTodo: AddTodo = (name, description): TodoActionType => ({
    type: ADD_TODO,
    payload: { name, description, rr }
});

export const editTodo: EditTodo = (id, name, description): TodoActionType => ({
    type: EDIT_TODO,
    payload: { id, name, description }
});

export const deleteTodo: DeleteTodo = (id): TodoActionType => ({
    type: DELETE_TODO,
    payload: { id }
});

export const toggleTodoComplete: ToggleTodoComplete = (id): TodoActionType => ({
    type: TOGGLE_TODO_COMPLETE,
    payload: { id }
})

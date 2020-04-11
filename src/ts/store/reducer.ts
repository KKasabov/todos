import { v4 as uniqueID } from 'uuid';
import { Todo, TodosState, TodoActionType, ADD_TODO, EDIT_TODO, DELETE_TODO, TOGGLE_TODO_COMPLETE } from './types';

export const initialState: TodosState = {
    todos: []
}

const reducer = (state = initialState, action: TodoActionType): TodosState => {
    switch (action.type) {
        case ADD_TODO: {
            const { name, description } = action.payload;
            const newTodo: Todo = {
                id: uniqueID(),
                name,
                description,
                created_at: new Date(),
                is_complete: false
            };

            return {
                ...state,
                todos: [...state.todos, newTodo]
            };
        }
        case EDIT_TODO: {
            const { id, name, description } = action.payload;
            const { todos } = state;
            const todoIndex = todos.findIndex(todo => todo.id === id);
            const updatedTodo = { ...todos[todoIndex], name, description };

            return {
                ...state,
                todos: [...todos.filter(todo => todo.id !== id), updatedTodo]
            };
        }
        case DELETE_TODO:
            return {
                ...state,
                todos: state.todos.filter(todo => todo.id !== action.payload.id)
            };
        case TOGGLE_TODO_COMPLETE: {
            const { id } = action.payload;
            const { todos } = state;
            const todoIndex = todos.findIndex(todo => todo.id === id);
            const updatedTodo = { ...todos[todoIndex], is_complete: !todos[todoIndex].is_complete };
            return {
                ...state,
                todos: [...todos.filter(todo => todo.id !== id), updatedTodo]
            };
        }
        default:
            return state;
    }
}

export default reducer;
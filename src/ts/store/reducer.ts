import { v4 as uniqueID } from 'uuid';
import { Todo, TodosState, TodoActionType, ADD_TODO, EDIT_TODO, DELETE_TODO } from './types';

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
                created_at: new Date()
            };

            return {
                ...state,
                todos: [...state.todos, newTodo]
            };
        }
        case EDIT_TODO: {
            const { id, name, description } = action.payload;
            const todoIndex = state.todos.findIndex(todo => todo.id === id);
            const updatedTodo = { ...state.todos[todoIndex], name, description };

            return {
                ...state,
                todos: [...state.todos.filter(todo => todo.id !== id), updatedTodo]
            };
        }
        case DELETE_TODO:
            return {
                ...state,
                todos: state.todos.filter(todo => todo.id !== action.payload.id)
            };
        default:
            return state;
    }
}

export default reducer;
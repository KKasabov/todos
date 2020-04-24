import { v4 as uniqueID } from 'uuid';
import {
    Todo,
    Recording,
    AppState,
    AppActionType,
    ADD_TODO,
    EDIT_TODO,
    DELETE_TODO,
    TOGGLE_TODO_COMPLETE,
    START_RECORDING,
    STOP_RECORDING,
    RECORD_ACTION,
    PLAY_RECORDING,
    EXIT_RECORDING
} from './types';

export const initialState: AppState = {
    todos: [
        { id: '0', name: 'Default name', description: 'Default description', created_at: new Date('2020-04-14T18:06:05.550Z'), is_complete: false },
        { id: '1', name: 'Some 1', description: 'Some description 1', created_at: new Date('2020-04-14T18:10:10.550Z'), is_complete: false },
        { id: '2', name: 'Thing 2', description: 'Thing description 2', created_at: new Date('2020-04-14T18:15:05.550Z'), is_complete: false },
        { id: '3', name: 'Else 3', description: 'Else description 3', created_at: new Date('2020-04-14T18:05:25.550Z'), is_complete: false },
    ],
    isRecording: false,
    isPlaying: false,
    currentRecording: {},
    recordings: [],
    cachedTodos: []
}

const reducer = (state = initialState, action: AppActionType): AppState => {
    switch (action.type) {
        case ADD_TODO: {
            const { name, description, id, created_at } = action.payload;
            const newTodo: Todo = {
                id,
                name,
                description,
                created_at,
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
        case START_RECORDING:
            return {
                ...state,
                isRecording: true,
                currentRecording: {
                    id: uniqueID(),
                    created_at: new Date(),
                    actions: [],
                    initialTodos: [...state.todos]
                }
            }
        case STOP_RECORDING: {
            const recordedTodoIds = state.currentRecording.actions!.map(action => action.payload.id);
            const newRecording = {
                ...state.currentRecording,
                initialTodos: [...state.currentRecording.initialTodos!.filter(todo => recordedTodoIds.indexOf(todo.id) !== -1)]
            };

            if (state.currentRecording.actions!.length > 0) {
                return {
                    ...state,
                    recordings: [...state.recordings, newRecording],
                    currentRecording: {},
                    isRecording: false
                }
            } else {
                return {
                    ...state,
                    isRecording: false
                }
            }
        }
        case RECORD_ACTION: {
            return {
                ...state,
                currentRecording: {
                    ...state.currentRecording,
                    actions: [...state.currentRecording.actions!, action.payload],
                }
            }
        }
        case PLAY_RECORDING: {
            const { payload: { initialTodos } } = action;

            return {
                ...state,
                isPlaying: true,
                cachedTodos: [...state.todos],
                todos: [...initialTodos!]
            }
        }
        case EXIT_RECORDING:
            return {
                ...state,
                isPlaying: false,
                todos: [...state.cachedTodos],
                cachedTodos: []
            }
        default:
            return state;
    }
}

export default reducer;
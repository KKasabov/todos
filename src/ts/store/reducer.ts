import { v4 as uniqueID } from 'uuid';
import {
  Todo,
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
  EXIT_RECORDING,
  DELETE_RECORDING,
  DELETE_ALL_RECORDINGS,
} from './types';
import moment from 'moment';

export const initialState: AppState = {
  todos: [],
  isRecording: false,
  isPlaying: false,
  currentRecording: {},
  recordings: [],
  cachedTodos: [],
};

const reducer = (state = initialState, action: AppActionType): AppState => {
  switch (action.type) {
    case ADD_TODO: {
      const { name, description, id, createdAt } = action.payload;
      const newTodo: Todo = {
        id,
        name,
        description,
        createdAt,
        isComplete: false,
      };

      return {
        ...state,
        todos: [...state.todos, newTodo],
      };
    }
    case EDIT_TODO: {
      const { id, name, description } = action.payload;
      const { todos } = state;
      const todoIndex = todos.findIndex((todo) => todo.id === id);
      const updatedTodo = { ...todos[todoIndex], name, description };

      return {
        ...state,
        todos: [...todos.filter((todo) => todo.id !== id), updatedTodo],
      };
    }
    case DELETE_TODO:
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload.id),
      };
    case TOGGLE_TODO_COMPLETE: {
      const { id } = action.payload;
      const { todos } = state;
      const todoIndex = todos.findIndex((todo) => todo.id === id);
      const updatedTodo = {
        ...todos[todoIndex],
        isComplete: !todos[todoIndex].isComplete,
      };
      return {
        ...state,
        todos: [...todos.filter((todo) => todo.id !== id), updatedTodo],
      };
    }
    case START_RECORDING:
      return {
        ...state,
        isRecording: true,
        currentRecording: {
          id: uniqueID(),
          createdAt: moment(),
          actions: [],
          initialTodos: [...state.todos],
        },
      };
    case STOP_RECORDING: {
      if (
        state.currentRecording.actions &&
        state.currentRecording.actions.length > 0
      ) {
        const recordedTodoIds = state.currentRecording.actions.map(
          (action) => action.payload.id
        );
        const newRecording = {
          ...state.currentRecording,
          initialTodos: state.currentRecording.initialTodos
            ? [
                ...state.currentRecording.initialTodos.filter(
                  (todo) => recordedTodoIds.indexOf(todo.id) !== -1
                ),
              ]
            : [],
        };

        return {
          ...state,
          recordings: [...state.recordings, newRecording],
          currentRecording: {},
          isRecording: false,
        };
      } else {
        return {
          ...state,
          isRecording: false,
        };
      }
    }
    case RECORD_ACTION: {
      return {
        ...state,
        currentRecording: {
          ...state.currentRecording,
          actions: state.currentRecording.actions
            ? [...state.currentRecording.actions, action.payload]
            : [action.payload],
        },
      };
    }
    case PLAY_RECORDING: {
      const {
        payload: { initialTodos },
      } = action;

      return {
        ...state,
        isPlaying: true,
        cachedTodos: [...state.todos],
        todos: initialTodos ? [...initialTodos] : [],
      };
    }
    case EXIT_RECORDING:
      return {
        ...state,
        isPlaying: false,
        todos: [...state.cachedTodos],
        cachedTodos: [],
      };
    case DELETE_RECORDING:
      return {
        ...state,
        recordings: [
          ...state.recordings.filter((rec) => rec.id !== action.payload.id),
        ],
      };
    case DELETE_ALL_RECORDINGS:
      return {
        ...state,
        recordings: [],
      };
    default:
      return state;
  }
};

export default reducer;

// redux constants
export const ADD_TODO = 'ADD_TODO';
export const EDIT_TODO = 'EDIT_TODO';
export const DELETE_TODO = 'DELETE_TODO';
export const TOGGLE_TODO_COMPLETE = 'TOGGLE_TODO_COMPLETE';
export const START_RECORDING = 'START_RECORDING';
export const STOP_RECORDING = 'STOP_RECORDING';
export const RECORD_ACTION = 'RECORD_ACTION';
export const PLAY_RECORDING = 'PLAY_RECORDING';
export const EXIT_RECORDING = 'EXIT_RECORDING';

export interface Todo {
    readonly id: string,
    name: string,
    description: string,
    readonly created_at: Date,
    is_complete: boolean
};

export interface Recording {
    readonly created_at?: Date,
    readonly id?: string,
    actions?: TodoActionType[],
    initialTodos?: Todo[]
}

// state interfaces
export interface TodosState {
    todos: Todo[]
};

export interface AppState {
    todos: Todo[],
    isRecording: boolean,
    isPlaying: boolean,
    currentRecording: Recording,
    recordings: Recording[],
    cachedTodos: Todo[]
};

// redux actions interfaces
interface AddTodoAction {
    type: typeof ADD_TODO,
    payload: {
        id: string,
        name: string,
        description: string,
        created_at: Date
    }
};

interface EditTodoAction {
    type: typeof EDIT_TODO,
    payload: {
        id: string,
        name: string,
        description: string
    }

};

interface DeleteTodoAction {
    type: typeof DELETE_TODO,
    payload: {
        id: string
    }
};
interface ToggleTodoCompleteAction {
    type: typeof TOGGLE_TODO_COMPLETE,
    payload: {
        id: string
    }
};

interface StartRecordingAction {
    type: typeof START_RECORDING
}

interface StopRecordingAction {
    type: typeof STOP_RECORDING
}

interface AddToCurrentRecordingAction {
    type: typeof RECORD_ACTION,
    payload: TodoActionType
}

interface PlayRecordingAction {
    type: typeof PLAY_RECORDING,
    payload: Recording
}

interface ExitRecordingAction {
    type: typeof EXIT_RECORDING
}

export type TodoActionType = AddTodoAction | EditTodoAction | DeleteTodoAction | ToggleTodoCompleteAction;
export type RecordingActionType = StartRecordingAction | StopRecordingAction | AddToCurrentRecordingAction | PlayRecordingAction | ExitRecordingAction;
export type AppActionType = TodoActionType | RecordingActionType;

// todo functions types
export type AddTodo = (name: string, description: string, id?: string, timestamp?: Date) => void
export type EditTodo = (id: string, name: string, description: string) => void
export type DeleteTodo = (id: string) => void
export type ToggleTodoComplete = (id: string) => void

//recording function types
export type SetIsRecording = () => void
export type PlayRecording = (recording: Recording) => void
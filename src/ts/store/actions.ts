import {
    ADD_TODO,
    EDIT_TODO,
    DELETE_TODO,
    TOGGLE_TODO_COMPLETE,
    START_RECORDING,
    STOP_RECORDING,
    PLAY_RECORDING,
    TodoActionType,
    RecordingActionType,
    AddTodo,
    EditTodo,
    DeleteTodo,
    ToggleTodoComplete,
    SetIsRecording,
    PlayRecording,
    EXIT_RECORDING
} from './types';
import { v4 as uniqueID } from 'uuid';
import moment from 'moment';

export const addTodo: AddTodo = (name, description, id, timestamp): TodoActionType => ({
    type: ADD_TODO,
    payload: {
        name,
        description,
        id: id || uniqueID(),
        created_at: timestamp || moment()
    }
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
});

export const startRecording: SetIsRecording = (): RecordingActionType => ({
    type: START_RECORDING
});

export const stopRecording: SetIsRecording = (): RecordingActionType => ({
    type: STOP_RECORDING
});

export const playRecording: PlayRecording = (recording): RecordingActionType => ({
    type: PLAY_RECORDING,
    payload: recording
});

export const exitRecording: SetIsRecording = (): RecordingActionType => ({
    type: EXIT_RECORDING
});

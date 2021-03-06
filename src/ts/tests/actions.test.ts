import {
  ADD_TODO,
  EDIT_TODO,
  TOGGLE_TODO_COMPLETE,
  DELETE_TODO,
  START_RECORDING,
  STOP_RECORDING,
  EXIT_RECORDING,
  PLAY_RECORDING,
  Recording,
} from '../store/types';
import {
  addTodo,
  editTodo,
  toggleTodoComplete,
  deleteTodo,
  startRecording,
  stopRecording,
  exitRecording,
  playRecording,
} from '../store/actions';
import moment, { Moment } from 'moment';

describe('testing redux actions creator', () => {
  it('should create an action to add a todo', () => {
    const name = 'Todo name',
      description = 'Todo description',
      createdAt: Moment = moment('2020-04-23T21:32:48'),
      id = '123456';

    const expectedAction = {
      type: ADD_TODO,
      payload: { name, description, id, createdAt },
    };
    expect(addTodo(name, description, id, createdAt)).toEqual(expectedAction);
  });
  it('should create an action to edit a todo', () => {
    const id = '0',
      name = 'Todo name',
      description = 'Todo description';

    const expectedAction = {
      type: EDIT_TODO,
      payload: { id, name, description },
    };
    expect(editTodo(id, name, description)).toEqual(expectedAction);
  });

  it('should create an action to toggle todo complete/ incomlete', () => {
    const id = '0';
    const expectedAction = {
      type: TOGGLE_TODO_COMPLETE,
      payload: { id },
    };
    expect(toggleTodoComplete(id)).toEqual(expectedAction);
  });
  it('should create an action to delete a todo', () => {
    const id = '0';
    const expectedAction = {
      type: DELETE_TODO,
      payload: { id },
    };
    expect(deleteTodo(id)).toEqual(expectedAction);
  });

  it('should create an action to start recording', () => {
    const expectedAction = {
      type: START_RECORDING,
    };
    expect(startRecording()).toEqual(expectedAction);
  });

  it('should create an action to stop recording', () => {
    const expectedAction = {
      type: STOP_RECORDING,
    };
    expect(stopRecording()).toEqual(expectedAction);
  });

  it('should create an action to play recording', () => {
    const rec: Recording = {
      id: '0',
      createdAt: moment('2020-04-23T19:32:48'),
      actions: [{ type: TOGGLE_TODO_COMPLETE, payload: { id: '1' } }],
      initialTodos: [],
    };
    const expectedAction = {
      type: PLAY_RECORDING,
      payload: rec,
    };
    expect(playRecording(rec)).toEqual(expectedAction);
  });

  it('should create an action to exit recording', () => {
    const expectedAction = {
      type: EXIT_RECORDING,
    };
    expect(exitRecording()).toEqual(expectedAction);
  });
});

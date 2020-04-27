import reducer, { initialState } from '../store/reducer';
import {
  AppState,
  ADD_TODO,
  EDIT_TODO,
  DELETE_TODO,
  TOGGLE_TODO_COMPLETE,
  START_RECORDING,
  STOP_RECORDING,
  EXIT_RECORDING,
  PLAY_RECORDING,
  RECORD_ACTION,
  TodoActionType,
  DELETE_RECORDING,
  DELETE_ALL_RECORDINGS,
} from '../store/types';
import 'jest-extended';
import moment from 'moment';

describe('testing reducer functionality', () => {
  const defaultState: AppState = {
    todos: [
      {
        id: '0',
        name: 'First todo',
        description: 'First todo description',
        createdAt: moment(),
        isComplete: false,
      },
      {
        id: '1',
        name: 'Second todo',
        description: 'Second todo description',
        createdAt: moment(),
        isComplete: false,
      },
    ],
    isRecording: false,
    isPlaying: false,
    currentRecording: {
      id: '0123',
      createdAt: moment('2020-04-23T11:32:48'),
      actions: [],
      initialTodos: [
        {
          id: '0222',
          name: 'initial todo inside recording',
          description: '',
          createdAt: moment(),
          isComplete: false,
        },
      ],
    },
    recordings: [
      {
        id: '0',
        createdAt: moment('2020-04-13T11:32:48'),
        actions: [],
        initialTodos: [
          {
            id: '0222',
            name: 'initial todo inside recording',
            description: '',
            createdAt: moment(),
            isComplete: false,
          },
        ],
      },
    ],
    cachedTodos: [],
  };

  it('should add a new todo', () => {
    const result = reducer(initialState, {
      type: ADD_TODO,
      payload: {
        id: '0',
        name: 'Todo name',
        description: 'Todo description',
        createdAt: moment('2020-04-22T13:28:56'),
      },
    }).todos;

    expect(
      result.find(
        (todo) =>
          todo.name === 'Todo name' && todo.description === 'Todo description'
      )
    ).not.toBeUndefined();
  });

  it('should edit an existing todo', () => {
    const result = reducer(defaultState, {
      type: EDIT_TODO,
      payload: {
        id: '1',
        name: 'Updated name',
        description: 'Updated description',
      },
    }).todos;

    const updatedTodo = result.find((todo) => todo.id === '1');
    expect(updatedTodo?.name).toStrictEqual('Updated name');
    expect(updatedTodo?.description).toStrictEqual('Updated description');
  });

  it('should delete a todo', () => {
    const result = reducer(defaultState, {
      type: DELETE_TODO,
      payload: {
        id: '1',
      },
    }).todos;

    expect(result.find((todo) => todo.id === '1')).toBeUndefined();
  });

  it('should toggle todo complete', () => {
    const result = reducer(defaultState, {
      type: TOGGLE_TODO_COMPLETE,
      payload: {
        id: '0',
      },
    }).todos;

    expect(result.find((todo) => todo.id === '0')?.isComplete).toEqual(true);
  });

  it('should start recording', () => {
    const result = reducer(defaultState, {
      type: START_RECORDING,
    });

    expect(result.isRecording).toEqual(true);
    expect(result.currentRecording).not.toBeEmpty();
    expect(result.currentRecording.actions).toBeEmpty();
    expect(result.currentRecording.initialTodos).toEqual(defaultState.todos);
  });

  it('should record action', () => {
    const action: TodoActionType = {
      type: TOGGLE_TODO_COMPLETE,
      payload: { id: '22' },
    };
    const result = reducer(defaultState, {
      type: RECORD_ACTION,
      payload: action,
    });

    expect(result.currentRecording.actions).toContain(action);
  });

  it('should stop recording', () => {
    const result = reducer(defaultState, {
      type: STOP_RECORDING,
    });

    expect(result.isRecording).toEqual(false);
  });

  it('should play recording', () => {
    const result = reducer(defaultState, {
      type: PLAY_RECORDING,
      payload: {
        id: '234',
        createdAt: moment('2020-04-23T12:32:48'),
        actions: [
          {
            type: ADD_TODO,
            payload: {
              id: '456',
              createdAt: moment('2020-04-23T12:12:48'),
              name: 'dummy name',
              description: 'dummy description',
            },
          },
        ],
        initialTodos: [],
      },
    });

    expect(result.isPlaying).toEqual(true);
    expect(result.cachedTodos).toEqual(defaultState.todos);
    expect(result.todos).toEqual([]);
  });

  it('should exit recording', () => {
    const result = reducer(defaultState, {
      type: EXIT_RECORDING,
    });

    expect(result.isPlaying).toEqual(false);
  });

  it('should delete recording', () => {
    const result = reducer(defaultState, {
      type: DELETE_RECORDING,
      payload: { id: '0' },
    });
    const recording = defaultState.recordings.find((rec) => rec.id === '0');

    expect(result.recordings).not.toContain(recording);
  });

  it('should delete all recordings', () => {
    const result = reducer(defaultState, {
      type: DELETE_ALL_RECORDINGS,
    });

    expect(result.recordings).toBeEmpty();
  });
});

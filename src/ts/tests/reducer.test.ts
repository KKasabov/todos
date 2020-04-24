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
    TodoActionType
} from '../store/types';
import 'jest-extended';

describe('testing reducer functionality', () => {
    const defaultState: AppState = {
        todos: [
            { id: '0', name: 'First todo', description: 'First todo description', created_at: new Date(), is_complete: false },
            { id: '1', name: 'Second todo', description: 'Second todo description', created_at: new Date(), is_complete: false }
        ],
        isRecording: false,
        isPlaying: false,
        currentRecording: {
            id: '0123',
            created_at: new Date('2020-04-23T11:32:48.871Z'),
            actions: [],
            initialTodos: [
                {
                    id: '0222',
                    name: 'initial todo inside recording',
                    description: '',
                    created_at: new Date(),
                    is_complete: false
                },
            ]
        },
        recordings: [],
        cachedTodos: [],
    };

    it('should add a new todo', () => {
        const result = reducer(initialState, {
            type: ADD_TODO,
            payload: {
                id: '0',
                name: 'Todo name',
                description: 'Todo description',
                created_at: new Date('2020-04-22T13:28:56.321Z')
            }
        }).todos;

        expect(
            result.find(todo => todo.name === 'Todo name' && todo.description === 'Todo description')
        ).not.toBeUndefined();
    })

    it('should edit an existing todo', () => {
        const result = reducer(defaultState, {
            type: EDIT_TODO,
            payload: {
                id: '1',
                name: 'Updated name',
                description: 'Updated description'
            }
        }).todos;

        const updatedTodo = result.find(todo => todo.id === '1')!;
        expect(updatedTodo.name).toStrictEqual('Updated name');
        expect(updatedTodo.description).toStrictEqual('Updated description');
    })

    it('should delete a todo', () => {
        const result = reducer(defaultState, {
            type: DELETE_TODO,
            payload: {
                id: '1'
            }
        }).todos;

        expect(result.find(todo => todo.id === '1')).toBeUndefined();
    })

    it('should toggle todo complete', () => {
        const result = reducer(defaultState, {
            type: TOGGLE_TODO_COMPLETE,
            payload: {
                id: '0'
            }
        }).todos;

        expect(result.find(todo => todo.id === '0')!.is_complete).toEqual(true);
    })

    it('should start recording', () => {
        const result = reducer(defaultState, {
            type: START_RECORDING,
        });

        expect(result.isRecording).toEqual(true);
        expect(result.currentRecording).not.toBeEmpty()
        expect(result.currentRecording.actions).toBeEmpty()
        expect(result.currentRecording.initialTodos).toEqual(defaultState.todos)
    })

    it('should record action', () => {
        const action: TodoActionType = { type: TOGGLE_TODO_COMPLETE, payload: { id: '22' } };
        const result = reducer(defaultState, {
            type: RECORD_ACTION,
            payload: action
        });

        expect(result.currentRecording.actions).toContain(action);
    })

    it('should stop recording', () => {
        const result = reducer(defaultState, {
            type: STOP_RECORDING,
        });

        expect(result.isRecording).toEqual(false);
    })

    it('should play recording', () => {
        const result = reducer(defaultState, {
            type: PLAY_RECORDING,
            payload: {
                id: '234',
                created_at: new Date('2020-04-23T12:32:48.871Z'),
                actions: [
                    {
                        type: ADD_TODO,
                        payload: {
                            id: '456',
                            created_at: new Date('2020-04-23T12:12:48.871Z'),
                            name: 'dummy name',
                            description: 'dummy description'
                        }
                    }],
                initialTodos: []
            }
        });

        expect(result.isPlaying).toEqual(true);
        expect(result.cachedTodos).toEqual(defaultState.todos);
        expect(result.todos).toEqual([]);
    })

    it('should exit recording', () => {
        const result = reducer(defaultState, {
            type: EXIT_RECORDING,
        });

        expect(result.isPlaying).toEqual(false);
    })
})

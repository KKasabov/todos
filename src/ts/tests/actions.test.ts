import { ADD_TODO, EDIT_TODO, TOGGLE_TODO_COMPLETE, DELETE_TODO, START_RECORDING, STOP_RECORDING, EXIT_RECORDING, PLAY_RECORDING, Recording } from '../store/types'
import { addTodo, editTodo, toggleTodoComplete, deleteTodo, startRecording, stopRecording, exitRecording, playRecording } from '../store/actions'

describe('testing redux actions creator', () => {
    it('should create an action to add a todo', () => {
        const name: string = 'Todo name',
            description: string = 'Todo description',
            created_at: Date = new Date('2020-04-23T21:32:48.871Z'),
            id: string = '123456';

        const expectedAction = {
            type: ADD_TODO,
            payload: { name, description, id, created_at }
        }
        expect(addTodo(name, description, id, created_at)).toEqual(expectedAction)
    })
    it('should create an action to edit a todo', () => {
        const id: string = '0',
            name: string = 'Todo name',
            description: string = 'Todo description';

        const expectedAction = {
            type: EDIT_TODO,
            payload: { id, name, description }
        }
        expect(editTodo(id, name, description)).toEqual(expectedAction)
    })

    it('should create an action to toggle todo complete/ incomlete', () => {
        const id: string = '0';
        const expectedAction = {
            type: TOGGLE_TODO_COMPLETE,
            payload: { id }
        }
        expect(toggleTodoComplete(id)).toEqual(expectedAction)
    })
    it('should create an action to delete a todo', () => {
        const id: string = '0';
        const expectedAction = {
            type: DELETE_TODO,
            payload: { id }
        }
        expect(deleteTodo(id)).toEqual(expectedAction)
    })

    it('should create an action to start recording', () => {
        const expectedAction = {
            type: START_RECORDING
        }
        expect(startRecording()).toEqual(expectedAction)
    })

    it('should create an action to stop recording', () => {
        const expectedAction = {
            type: STOP_RECORDING
        }
        expect(stopRecording()).toEqual(expectedAction)
    })

    it('should create an action to play recording', () => {
        const rec: Recording = {
            id: '0',
            created_at: new Date('2020-04-23T19:32:48.871Z'),
            actions: [{ type: TOGGLE_TODO_COMPLETE, payload: { id: '1' } }],
            initialTodos: []
        }
        const expectedAction = {
            type: PLAY_RECORDING,
            payload: rec
        }
        expect(playRecording(rec)).toEqual(expectedAction)
    })

    it('should create an action to exit recording', () => {
        const expectedAction = {
            type: EXIT_RECORDING
        }
        expect(exitRecording()).toEqual(expectedAction)
    })
})
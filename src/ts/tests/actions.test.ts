import { ADD_TODO, EDIT_TODO, TOGGLE_TODO_COMPLETE, DELETE_TODO } from '../store/types'
import { addTodo, editTodo, toggleTodoComplete, deleteTodo } from '../store/actions'

describe('testing redux actions creator', () => {
    it('should create an action to add a todo', () => {
        const name: string = 'Todo name',
            description: string = 'Todo description';

        const expectedAction = {
            type: ADD_TODO,
            payload: { name, description }
        }
        expect(addTodo(name, description)).toEqual(expectedAction)
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
})
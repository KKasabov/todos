import reducer, { initialState } from '../store/reducer';
import { TodosState, ADD_TODO, EDIT_TODO, DELETE_TODO } from '../store/types';
import 'jest-extended';

describe('testing reducer functionality', () => {
    it('should add a new todo', () => {
        const result = reducer(initialState, {
            type: ADD_TODO,
            payload: {
                name: 'Todo name',
                description: 'Todo description'
            }
        }).todos;

        expect(
            result.find(todo => todo.name === 'Todo name' && todo.description === 'Todo description')
        ).not.toBeUndefined;
    })

    it('should edit an existing todo', () => {
        const defaultState: TodosState = {
            todos: [
                { id: '0', name: 'First todo', description: 'First todo description', created_at: new Date(), is_complete: false },
                { id: '1', name: 'Second todo', description: 'Second todo description', created_at: new Date(), is_complete: false }
            ]
        };

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
        const defaultState: TodosState = {
            todos: [
                { id: '0', name: 'First todo', description: 'First todo description', created_at: new Date(), is_complete: false },
                { id: '1', name: 'Second todo', description: 'Second todo description', created_at: new Date(), is_complete: false }
            ]
        };

        const result = reducer(defaultState, {
            type: DELETE_TODO,
            payload: {
                id: '1'
            }
        }).todos;

        expect(result.find(todo => todo.id === '1')).toBeUndefined();
    })
})

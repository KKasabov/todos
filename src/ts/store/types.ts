export interface Todo {
    readonly id: string,
    name: string,
    description: string,
    readonly created_at: Date
};

export interface TodosState {
    todos: Todo[]
};

export const ADD_TODO = 'ADD_TODO';
export const EDIT_TODO = 'EDIT_TODO';
export const DELETE_TODO = 'DELETE_TODO';

interface AddTodoAction {
    type: typeof ADD_TODO,
    payload: {
        name: string,
        description: string
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

export type TodoActionType = AddTodoAction | EditTodoAction | DeleteTodoAction;

export type AddTodo = (name: string, description: string) => void
export type EditTodo = (id: string, name: string, description: string) => void
export type DeleteTodo = (id: string) => void
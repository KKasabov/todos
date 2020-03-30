import { Todo } from '../constants/types';

/**
 * Adds a new todo to the exisitng todos
 * 
 * @param todos The array of current todos
 * @param newTodo The todo to add
 * @returns An array of todos
 */
export const addTodo: (todos: Todo[], newTodo: Todo) => Todo[]
    = (todos, newTodo) => [...todos, newTodo];

/**
 * Edits an existing todo
 * 
 * @param todos The array of current todos
 * @param id The id for the todo to be edited
 * @param name The new name for the todo
 * @param description The new description for the todo 
 * @returns An array of todos
 */
export const editTodo: (todos: Todo[], id: number, name: string, description: string) => Todo[]
    = (todos, id, name, description) => {
        const todoToEdit = todos.find(todo => todo.id === id);

        if (!todoToEdit) {
            return todos;
        }

        const updatedTodo = {
            id,
            name,
            description,
            created_at: todoToEdit!.created_at
        };
        const currentTodos = todos.filter(todo => todo.id !== id);
        currentTodos.push(updatedTodo);

        return currentTodos;
    };

/**
 * Removes an existing todo
 * 
 * @param todos The array of current todos
 * @param todoId The id for the todo to be deleted
 */
export const deleteTodo: (todos: Todo[], todoId: number) => Todo[]
    = (todos, todoId) => todos.filter(todo => todo.id !== todoId);
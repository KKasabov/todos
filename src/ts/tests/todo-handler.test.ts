import { addTodo, editTodo, deleteTodo } from '../util/todo-handler'
import { generateRandomId } from '../util/id-randomiser'
import { Todo } from '../constants/types';
import puppeteer from 'puppeteer';
test('should add a new todo', () => {
    const emptyTodos: Todo[] = [];
    const initialTodo: Todo = {
        id: generateRandomId(),
        name: 'Initial todo',
        description: 'Initial description',
        created_at: new Date()
    };

    const populatedTodos: Todo[] = [...emptyTodos, initialTodo];
    const addedTodo: Todo = {
        id: generateRandomId(),
        name: 'Added todo',
        description: 'Added description',
        created_at: new Date()
    };

    expect(addTodo(emptyTodos, initialTodo))
        .toEqual([initialTodo]);

    expect(addTodo(populatedTodos, addedTodo))
        .toEqual([...populatedTodos, addedTodo]);
});

test('should edit a todo', () => {
    const todoToEditId = generateRandomId();
    const todoToEditCreatedAt = new Date();
    const newName = 'Edited name';
    const newDescription = 'Edited description';
    const initialTodos: Todo[] = [
        {
            id: generateRandomId(),
            name: 'Initial todo',
            description: 'Initial description',
            created_at: new Date()
        }, {
            id: todoToEditId,
            name: 'Todo to edit',
            description: 'Description to edit',
            created_at: todoToEditCreatedAt
        }, {
            id: generateRandomId(),
            name: 'Some other todo',
            description: 'Some other description',
            created_at: new Date()
        }
    ];
    const expectedTodo: Todo = {
        id: todoToEditId,
        name: newName,
        description: newDescription,
        created_at: todoToEditCreatedAt
    };

    // id with no match
    expect(editTodo(initialTodos, 123, '', ''))
        .toEqual(initialTodos);

    expect(
        editTodo(initialTodos, todoToEditId, newName, newDescription)
            .find(todo => todo.id === todoToEditId)
    )
        .toEqual(expectedTodo);
});

test('should delete a todo', () => {
    const todoToDeleteId = generateRandomId();
    const initialTodos: Todo[] = [
        {
            id: generateRandomId(),
            name: 'Initial todo',
            description: 'Initial description',
            created_at: new Date()
        }, {
            id: todoToDeleteId,
            name: 'Todo to edit',
            description: 'Description to edit',
            created_at: new Date()
        }, {
            id: generateRandomId(),
            name: 'Some other todo',
            description: 'Some other description',
            created_at: new Date()
        }
    ];

    // id with no match
    expect(deleteTodo(initialTodos, 123))
        .toEqual(initialTodos);

    expect(deleteTodo(initialTodos, todoToDeleteId))
        .toEqual([initialTodos[0], initialTodos[2]]);

});

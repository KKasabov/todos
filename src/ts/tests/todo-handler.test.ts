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

test('testing form validation and todo CRUD operations', async () => {
    const browser = await puppeteer.launch()

    const page = await browser.newPage();
    await page.goto('http://localhost:8008/');

    // try to submit an empty form
    await page.click('#addTodo');
    const nameError = await page.$eval('#name-error', el => el.textContent)
    expect(nameError).toStrictEqual('Required field');
    const descriptionError = await page.$eval('#description-error', el => el.textContent)
    expect(descriptionError).toStrictEqual('Required field');

    // add a todo
    await page.click('#name');
    await page.type('#name', 'Programmed todo');
    await page.click('#description');
    await page.type('#description', 'Programmed description');
    await page.click('#addTodo');

    const todoName = await page.$eval('.todo-item__name', el => el.textContent)
    expect(todoName).toStrictEqual('Programmed todo');

    // try adding a todo without a description or name
    await page.click('#name');
    await page.type('#name', 'This one has no description');
    await page.click('#addTodo');

    const validationError = await page.$eval('#description-error', el => el.textContent)
    expect(validationError).toStrictEqual('Required field');

    await page.click('#description');
    await page.type('#description', 'It does now, but let\'s delete the name');
    await page.click('#name');
    await page.evaluate(() => document.execCommand('selectall', false));
    await page.keyboard.press('Backspace');
    await page.click('#name');
    await page.type('#name', 'Re-added the name');
    await page.click('#addTodo');

    // edit name and description
    const todoItem = await page.$('.todo-item');
    await page.click('.todo-item__controls-edit');
    await page.evaluate(() => document.execCommand('selectall', false));
    await page.keyboard.press('Backspace');
    await todoItem!.type('Edited name');
    await page.keyboard.press('Tab');
    await todoItem!.type('Edited description');
    await todoItem!.press('Enter');

    const newName = await page.$eval('.todo-item__name', el => el.textContent)
    expect(newName).toStrictEqual('Edited name');

    const description = await page.$eval('.todo-item__description', el => el.textContent)
    expect(description).toStrictEqual('Edited description');

    // delete a todo
    const todoList = await page.$$('.todo-item');
    await page.click('.todo-item__controls-delete');
    const reducedTodoList = await page.$$('.todo-item');
    expect(reducedTodoList.length).toStrictEqual(todoList.length - 1);

    // delete the last todo
    await page.click('.todo-item__controls-delete');

    const emptyListMessage = await page.$eval('.todo-list__empty', el => el.textContent)
    expect(emptyListMessage).toStrictEqual('No todos found');

    browser.close();

}, 10000)
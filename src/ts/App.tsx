import React, { FC, useState, Fragment } from 'react';
import { hot } from 'react-hot-loader/root';
import TodoList from './components/todo-list';
import TodoForm from './components/todo-form';
import { Todo, AddTodo, RemoveTodo, EditTodo } from './constants/types';
import { addTodo, editTodo, deleteTodo } from './util/todo-handler';
import { generateRandomId } from './util/id-randomiser';
import '../styles/style.scss';

const App: FC = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const handleTodoAdded: AddTodo = (name, description) => {
        const newTodo = {
            id: generateRandomId(),
            name,
            description,
            created_at: new Date()
        };

        setTodos(prevTodos => addTodo(prevTodos, newTodo));
    };

    const handleTodoRemoved: RemoveTodo = (id) => {
        setTodos(prevTodos => deleteTodo(prevTodos, id))
    }

    const handleTodoEdited: EditTodo = (id, name, description) => {
        setTodos(prevTodos => editTodo(prevTodos, id, name, description));
    }

    return <Fragment>
        <TodoForm onAddTodo={handleTodoAdded} />
        <TodoList items={todos} onRemoveTodo={handleTodoRemoved} onEditTodo={handleTodoEdited} />
    </Fragment>;
}

export default hot(App);

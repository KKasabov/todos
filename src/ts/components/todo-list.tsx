import React, { FC } from 'react';
import TodoItem from './todo-item';
import { Todo, DeleteTodo, EditTodo } from '../store/types';

interface TodoListProps {
    todos: Todo[],
    onDeleteTodo: DeleteTodo,
    onEditTodo: EditTodo
}

const TodoList: FC<TodoListProps> = ({ todos, onDeleteTodo, onEditTodo }) => {
    return (
        <div className="wrapper">
            <div className="todo-list">
                {
                    todos.length > 0
                        ?
                        todos
                            .sort((a: Todo, b: Todo) => {
                                const current = a.created_at;
                                const next = b.created_at;

                                return current > next ? -1 : current < next ? 1 : 0;
                            })
                            .map(todo => <TodoItem key={todo.id} todo={todo} onDelete={onDeleteTodo} onEdit={onEditTodo} />)
                        : <div className="todo-list__empty">All done!</div>
                }
            </div>
        </div>
    );
};

export default TodoList;

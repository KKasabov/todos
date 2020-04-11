import React, { FC } from 'react';
import TodoItem from './todo-item';
import { Todo, DeleteTodo, EditTodo, ToggleTodoComplete } from '../store/types';

interface TodoListProps {
    todos: Todo[],
    onDeleteTodo: DeleteTodo,
    onEditTodo: EditTodo,
    onToggleTodoComplete: ToggleTodoComplete
}

const TodoList: FC<TodoListProps> = ({ todos, onDeleteTodo, onEditTodo, onToggleTodoComplete }) => {
    return (
        <div className="wrapper">
            <div className="todo-list">
                {
                    todos.length > 0
                        ?
                        todos
                            .sort((a: Todo, b: Todo) => {
                                const currentDate = a.created_at;
                                const currentComplete = a.is_complete;
                                const nextDate = b.created_at;
                                const nextComplete = b.is_complete;

                                return currentComplete
                                    ? 1
                                    : nextComplete
                                        ? -1
                                        : currentDate > nextDate
                                            ? -1
                                            : currentDate < nextDate
                                                ? 1
                                                : 0;
                            })
                            .map(todo => <TodoItem key={todo.id} todo={todo} onDelete={onDeleteTodo} onEdit={onEditTodo} onToggleComplete={onToggleTodoComplete} />)
                        : <div className="todo-list__empty">All done!</div>
                }
            </div>
        </div>
    );
};

export default TodoList;

import React, { FC } from 'react';
import TodoItem from './todo-item';
import { Todo, DeleteTodo, EditTodo, ToggleTodoComplete } from '../store/types';
import moment from 'moment';

interface TodoListProps {
    todos: Todo[],
    onDeleteTodo: DeleteTodo,
    onEditTodo: EditTodo,
    onToggleTodoComplete: ToggleTodoComplete,
    isPlaying: boolean
}

const TodoList: FC<TodoListProps> = ({ todos, onDeleteTodo, onEditTodo, onToggleTodoComplete, isPlaying }) => {

    return (
        <ul className="todo__list">
            {
                todos.length > 0
                    ?
                    todos
                        .sort((a: Todo, b: Todo) => {
                            const currentDate = moment(a.created_at);
                            const currentComplete = a.is_complete;
                            const nextDate = moment(b.created_at);
                            const nextComplete = b.is_complete;

                            return currentComplete
                                ? 1
                                : nextComplete
                                    ? -1
                                    : currentDate.isAfter(nextDate)
                                        ? -1
                                        : currentDate.isBefore(nextDate)
                                            ? 1
                                            : 0;
                        })
                        .map(todo => <TodoItem key={todo.id} todo={todo} onDelete={onDeleteTodo} onEdit={onEditTodo} onToggleComplete={onToggleTodoComplete} isPlaying={isPlaying} />)
                    : <div className="todo-list__empty">All done!</div>
            }
        </ul>
    );
};

export default TodoList;

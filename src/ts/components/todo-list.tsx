import React, { FC } from 'react';
import TodoItem from './todo-item';
import { Todo, RemoveTodo, EditTodo } from '../constants/types';

interface TodoListProps {
    items: Todo[],
    onRemoveTodo: RemoveTodo,
    onEditTodo: EditTodo
}

const TodoList: FC<TodoListProps> = ({ items, onRemoveTodo, onEditTodo }) => {
    return (
        <div className="wrapper">
            <div className="todo-list">
                {
                    items.length > 0
                        ? items
                            .sort((a: Todo, b: Todo) => {
                                const current = a.created_at;
                                const next = b.created_at;

                                return current > next ? -1 : current < next ? 1 : 0;
                            })
                            .map(item => <TodoItem key={item.id} todo={item} onRemove={onRemoveTodo} onEdit={onEditTodo} />)
                        : <div className="todo-list__empty">No todos found</div>
                }
            </div>
        </div>
    );
};

export default TodoList;

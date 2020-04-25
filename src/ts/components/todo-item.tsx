import React, { FC } from 'react';
import { Todo, EditTodo, DeleteTodo, ToggleTodoComplete } from '../store/types';
import TodoForm from './todo-form';
import moment, { Moment } from 'moment';

interface TodoItemPros {
    todo: Todo,
    onEdit: EditTodo,
    onDelete: DeleteTodo,
    onToggleComplete: ToggleTodoComplete,
    isPlaying: boolean
}

const fromNowOrJustNow = (m: Moment) => {
    if (Math.abs(m.diff()) < 60000) {
        return 'just now';
    }
    return m.fromNow();
}

const TodoItem: FC<TodoItemPros> = ({ todo, onDelete, onEdit, onToggleComplete, isPlaying }) => {
    const { id, name, description, created_at, is_complete } = todo;
    const formattedDate = isPlaying ? moment(created_at).format('HH:mm:ss') : fromNowOrJustNow(moment(created_at));
    const dates = {
        iso: moment(created_at).toISOString(),
        formatted: formattedDate
    }
    return (
        <li className="todo__list-item" key={id} value={id}>
            <TodoForm
                isItem={true}
                id={id}
                name={name}
                description={description}
                created_at={dates}
                is_complete={is_complete}
                onEditTodo={onEdit}
                onDeleteTodo={onDelete}
                onToggleTodo={onToggleComplete}
            />
        </li>
    );
};

export default TodoItem;

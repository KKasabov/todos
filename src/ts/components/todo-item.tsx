import React, { FC } from 'react';
import { Todo, EditTodo, DeleteTodo, ToggleTodoComplete } from '../store/types';
import { FiCheck, FiTrash2 } from 'react-icons/fi';
import TodoForm from './todo-form';
import { formatDate } from '../util/date-formatter';

interface TodoItemPros {
    todo: Todo,
    onEdit: EditTodo,
    onDelete: DeleteTodo,
    onToggleComplete: ToggleTodoComplete
}

const TodoItem: FC<TodoItemPros> = ({ todo, onDelete, onEdit, onToggleComplete }) => {
    const { id, name, description, created_at, is_complete } = todo;
    const isoDate = created_at.toISOString(),
        formattedDate = formatDate(created_at);

    return <li className={`todo-item${is_complete ? ' todo-item--complete' : ''}`} key={id} value={id}>
        <TodoForm
            isItem={true}
            onEditTodo={onEdit}
            id={id}
            name={name}
            description={description}
        />
        <div className="todo-item__control-list">
            <div className="todo-item__control-item js-todo-item-toggle-complete" onClick={() => onToggleComplete(id)}><FiCheck /></div>
            <div className="todo-item__control-item  js-todo-item-delete" onClick={() => onDelete(id)}><FiTrash2 /></div>
        </div>
        <time className="todo-item__date" dateTime={isoDate}>{formattedDate}</time>
    </li>;
};

export default TodoItem;

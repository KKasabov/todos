import React, { FC, Fragment, useState, useEffect } from 'react';
import { Todo, EditTodo, DeleteTodo, ToggleTodoComplete } from '../store/types';
import { FiCheck, FiEdit, FiTrash2 } from 'react-icons/fi';
import TodoForm from './todo-form';
import { formatDate } from '../util/date-formatter';

interface TodoItemPros {
    todo: Todo,
    onEdit: EditTodo,
    onDelete: DeleteTodo,
    onToggleComplete: ToggleTodoComplete
}

const TodoItem: FC<TodoItemPros> = ({ todo, onDelete, onEdit, onToggleComplete }) => {
    const [isBeingEdited, setIsBeingEdited] = useState<boolean>(false);
    const { id, name, description, created_at, is_complete } = todo;
    const isoDate = created_at.toISOString(),
        formattedDate = formatDate(created_at);

    const defaultContent =
        <li className={`todo-item${is_complete ? ' todo-item--complete' : ''}`} key={id} value={id}>
            <h1 className="todo-item__name">{name}</h1>
            <h2 className="todo-item__description">{description}</h2>
            <time className="todo-item__date" dateTime={isoDate}>{formattedDate}</time>
            <div className="todo-item__control-list">
                <FiCheck className="todo-item__control-item" onClick={() => onToggleComplete(id)} />
                <FiEdit className="todo-item__control-item" onClick={() => setIsBeingEdited(true)} />
                <FiTrash2 className="todo-item__control-item" onClick={() => onDelete(id)} />
            </div>
        </li>;

    const [content, setContent] = useState(defaultContent);

    const setEditComplete: () => void = () => {
        setIsBeingEdited(false);
    }

    useEffect(() => {
        isBeingEdited
            ? setContent(
                <Fragment>
                    <TodoForm
                        isEdit={true}
                        onEditTodo={onEdit}
                        handleEditComplete={setEditComplete}
                        id={id}
                        name={name}
                        description={description}
                    />
                    <time className="todo-item__date" dateTime={isoDate}>{formattedDate}</time>
                </Fragment>
            )
            : setContent(defaultContent);

    }, [isBeingEdited, todo]);

    return content;
};

export default TodoItem;

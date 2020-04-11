import React, { FC, Fragment, useState, useEffect } from 'react';
import { Todo, EditTodo, DeleteTodo } from '../store/types';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import TodoForm from './todo-form';
import { formatDate } from '../util/date-formatter';

interface TodoItemPros {
    todo: Todo,
    onEdit: EditTodo,
    onDelete: DeleteTodo
}

const TodoItem: FC<TodoItemPros> = ({ todo, onDelete, onEdit }) => {
    const [isBeingEdited, setIsBeingEdited] = useState<boolean>(false);
    const { id, name, description, created_at } = todo;
    const isoDate = created_at.toISOString(),
        formattedDate = formatDate(created_at);

    const defaultContent =
        <li className="todo-item" key={id} value={id}>
            <h1 className="todo-item__name">{name}</h1>
            <h2 className="todo-item__description">{description}</h2>
            <time className="todo-item__date" dateTime={isoDate}>{formattedDate}</time>
            <div className="todo-item__controls">
                <div className="todo-item__controls-edit">
                    <FiEdit size="1.5em" className="todo-item__edit" onClick={() => setIsBeingEdited(true)} />
                </div>
                <div className="todo-item__controls-delete">
                    <FiTrash2 size="1.5em" className="todo-item__delete" onClick={() => onDelete(id)} />
                </div>
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

import React, { FC, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { AddTodo, EditTodo, DeleteTodo, ToggleTodoComplete } from '../store/types';
import { Moment } from 'moment';

interface TodoFormProps {
    isItem?: boolean,
    id?: string,
    name?: string,
    description?: string,
    is_complete?: boolean,
    created_at?: {
        iso: string,
        formatted: string
    },
    onAddTodo?: AddTodo,
    onEditTodo?: EditTodo
    onDeleteTodo?: DeleteTodo
    onToggleTodo?: ToggleTodoComplete
}
type FormData = {
    name: string,
    description: string
}

const TodoForm: FC<TodoFormProps> = ({ isItem, id, name, description, is_complete, created_at, onAddTodo, onEditTodo, onDeleteTodo, onToggleTodo }) => {
    const todoFormRef = useRef<HTMLFormElement>(null);
    const { handleSubmit, register, errors } = useForm<FormData>();

    const onSubmit = handleSubmit((formData, e) => {
        const nameInputValue = formData.name.trim();
        const descriptionInputValue = formData.description.trim();

        if (isItem) {
            if (id) {
                if (nameInputValue !== name || descriptionInputValue !== description) {
                    onEditTodo!(id, nameInputValue, descriptionInputValue);
                }
                todoFormRef.current!.classList.remove('is-toggled')
                e!.target.reset();
            }
        } else {
            onAddTodo!(nameInputValue, descriptionInputValue, id);
            e!.target.reset();
        }
    });

    if (isItem) {
        const dropdownRef = useRef<HTMLDivElement>(null);

        return (
            <form className={`form form--inner ${is_complete ? 'is-completed' : ''}`} onSubmit={onSubmit} ref={todoFormRef}>
                <ul className="form__list">
                    <li className="form__list-item">
                        <label htmlFor="todo-completed-1" className="custom-checkbox toggle-visible">
                            <input type="checkbox" name="todo-completed-1" id="todo-completed-1" className="custom-checkbox__input" />
                            <span className="custom-checkbox__text" onClick={() => {
                                todoFormRef.current!.classList.toggle('is-completed');
                                dropdownRef.current!.classList.remove('is-active');
                                onToggleTodo ? onToggleTodo(id!) : null;
                            }}>
                                <strong className="custom-checkbox__text-title">{name}</strong>
                            </span>
                        </label>
                        <div className="form__component toggle-hidden">
                            <label htmlFor="todo-name" className="form__label">Title</label>
                            <input id="todo-name" name="name" className="form__input" type="text"
                                autoComplete="off" defaultValue={name} autoFocus={!isItem} ref={
                                    register({
                                        required: true,
                                        pattern: /^(?!\s*$).+/
                                    })
                                } />
                            {errors.name && errors.name.type === 'required'
                                && <span id="name-error" className="form__error">Please enter a name</span>}
                            {errors.name && errors.name.type === 'pattern'
                                && <span id="name-error" className="form__error">Please enter at least one non-empty character</span>}
                        </div>
                    </li>
                    <li className="form__list-item">
                        <p className="todo__description toggle-visible">{description}</p>
                        <div className="form__component toggle-hidden">
                            <label htmlFor="todo-description" className="form__label">Description</label>
                            <input id="todo-description" name="description" className="form__input" type="text"
                                autoComplete="off" defaultValue={description?.trim()} ref={register()} />
                        </div>
                    </li>
                </ul>
                <div className="toggle-hidden">
                    <div className="button-holder button-holder--right">
                        <button type="submit" className="button button--main">
                            <span className="button__text">Save</span>
                        </button>
                        <button type="button" className="button button--outline" onClick={() => {
                            todoFormRef.current!.classList.remove('is-toggled')
                        }}>
                            <span className="button__text">Cancel</span>
                        </button>
                    </div>
                </div>
                <div className="dropdown toggle-visible" ref={dropdownRef}>
                    <button type="button" className="dropdown__controller" onClick={() => {
                        dropdownRef.current!.classList.toggle('is-active');
                    }}>
                        <span className="dropdown__controller-text sr-only">dropdown button</span>
                    </button>
                    <ul className="dropdown-list">
                        <li className="dropdown-list__item">
                            <button type="button" className="dropdown-list__button dropdown-list__button--edit" onClick={() => {
                                todoFormRef.current!.classList.remove('is-completed');
                                todoFormRef.current!.classList.add('is-toggled');
                                dropdownRef.current!.classList.remove('is-active');
                            }}>
                                <span className="dropdown-list__button-text">Edit</span>
                            </button>
                        </li>
                        <li className="dropdown-list__item">
                            <button type="button" className="dropdown-list__button dropdown-list__button--delete" onClick={() => {
                                dropdownRef.current!.classList.remove('is-active');
                                onDeleteTodo!(id!);
                            }}>
                                <span className="dropdown-list__button-text">Delete</span>
                            </button>
                        </li>
                    </ul>
                </div>
                <time className="todo__time" dateTime={created_at!.iso}>{created_at!.formatted}</time>
            </form>
        );
    } else {
        return (
            <form className="form" onSubmit={onSubmit} ref={todoFormRef}>
                <fieldset className="form__fieldset">
                    <div className="site-form__element">
                        <legend className="form__legend">Test Todo TEEEEEEST</legend>
                        <ul className="form__list">
                            <li className="form__list-item">
                                <div className="form__component">
                                    <label htmlFor="todo-name" className="form__label">Title</label>
                                    <input id="todo-name" name="name" className="form__input" type="text"
                                        autoComplete="off" defaultValue={name} autoFocus={!isItem} ref={
                                            register({
                                                required: true,
                                                pattern: /^(?!\s*$).+/
                                            })
                                        } />
                                    {errors.name && errors.name.type === 'required'
                                        && <span id="name-error" className="form__error">Please enter a name</span>}
                                    {errors.name && errors.name.type === 'pattern'
                                        && <span id="name-error" className="form__error">Please enter at least one non-empty character</span>}
                                </div>
                            </li>
                            <li className="form__list-item">
                                <div className="form__component">
                                    <label htmlFor="todo-description" className="form__label">Description</label>
                                    <input id="todo-description" name="description" className="form__input" type="text"
                                        autoComplete="off" defaultValue={description} ref={register()} />
                                </div>
                            </li>

                        </ul>
                    </div>
                    <div className="button-holder">
                        <button type="submit" className="button button--main">
                            <span className="button__text">Add</span>
                        </button>
                    </div>
                </fieldset>
            </form>
        );
    }
};

export default TodoForm

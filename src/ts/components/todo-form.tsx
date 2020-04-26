import React, { FC, useRef, RefObject } from 'react';
import { useForm } from 'react-hook-form';
import {
  AddTodo,
  EditTodo,
  DeleteTodo,
  ToggleTodoComplete,
} from '../store/types';

interface TodoFormProps {
  isItem?: boolean;
  id?: string;
  name?: string;
  description?: string;
  isComplete?: boolean;
  createdAt?: {
    iso: string;
    formatted: string;
  };
  onAddTodo?: AddTodo;
  onEditTodo?: EditTodo;
  onDeleteTodo?: DeleteTodo;
  onToggleTodo?: ToggleTodoComplete;
}
type FormData = {
  name: string;
  description: string;
};

const TodoForm: FC<TodoFormProps> = ({
  isItem,
  id,
  name,
  description,
  isComplete,
  createdAt,
  onAddTodo,
  onEditTodo,
  onDeleteTodo,
  onToggleTodo,
}) => {
  const todoFormRef = useRef<HTMLFormElement>(null);
  const titleComponentRef = useRef<HTMLDivElement>(null);
  const { handleSubmit, register, errors } = useForm<FormData>();

  const onSubmit = handleSubmit((formData, e) => {
    const nameInputValue = formData.name.trim();
    const descriptionInputValue = formData.description.trim();

    if (isItem) {
      if (id) {
        if (nameInputValue !== name || descriptionInputValue !== description) {
          onEditTodo && onEditTodo(id, nameInputValue, descriptionInputValue);
        }
        todoFormRef.current?.classList.remove('is-toggled');
        e?.target.reset();
      }
    } else {
      onAddTodo && onAddTodo(nameInputValue, descriptionInputValue, id);
      e?.target.reset();
    }
  });

  const toggleComponentHasError = (componentRef: RefObject<HTMLDivElement>) => {
    if (componentRef.current) {
      if (errors.name) {
        componentRef.current.classList.add('has-error');
      } else {
        componentRef.current.classList.remove('has-error');
      }
    }
  };

  if (isItem) {
    const dropdownRef = useRef<HTMLDivElement>(null);

    return (
      <form
        className={`js-form form form--inner ${
          isComplete ? 'is-completed' : ''
        }`}
        onSubmit={onSubmit}
        onBlur={() => toggleComponentHasError(titleComponentRef)}
        ref={todoFormRef}>
        <ul className="form__list">
          <li className="form__list-item">
            <label
              htmlFor="todo-completed"
              className="custom-checkbox toggle-visible">
              <input
                type="checkbox"
                name="todo-completed"
                id="todo-completed"
                className="custom-checkbox__input"
                defaultChecked={isComplete}
              />
              <span
                className="custom-checkbox__text js-todo-toggle"
                onClick={() => {
                  todoFormRef.current?.classList.toggle('is-completed');
                  dropdownRef.current?.classList.remove('is-active');
                  onToggleTodo ? id && onToggleTodo(id) : null;
                }}>
                <strong className="custom-checkbox__text-title">{name}</strong>
              </span>
            </label>

            <div
              className={`form__component toggle-hidden ${
                errors.name ? 'has-error' : ''
              }`}>
              <label htmlFor="todo-name-inner" className="form__label">
                Title
              </label>
              <input
                id="todo-name-inner"
                name="name"
                className="form__input js-todo-name-inner"
                type="text"
                autoComplete="off"
                defaultValue={name}
                autoFocus={!isItem}
                ref={register({
                  required: true,
                  pattern: /^(?!\s*$).+/,
                })}
              />
              {errors.name && errors.name.type === 'required' && (
                <span id="name-error" className="form__error">
                  Please enter a name
                </span>
              )}
              {errors.name && errors.name.type === 'pattern' && (
                <span id="name-error" className="form__error">
                  Please enter at least one non-empty character
                </span>
              )}
            </div>
          </li>
          <li className="form__list-item">
            <p className="todo__description toggle-visible">{description}</p>
            <div className="form__component toggle-hidden">
              <label htmlFor="todo-description-inner" className="form__label">
                Description
              </label>
              <input
                id="todo-description-inner"
                name="description"
                className="form__input js-todo-description-inner"
                type="text"
                autoComplete="off"
                defaultValue={description?.trim()}
                ref={register()}
              />
            </div>
          </li>
        </ul>
        <div className="toggle-hidden">
          <div className="button-holder button-holder--right">
            <button type="submit" className="button button--main js-todo-save">
              <span className="button__text">Save</span>
            </button>
            <button
              type="button"
              className="button button--outline"
              onClick={() => {
                todoFormRef.current?.classList.remove('is-toggled');
                todoFormRef.current?.reset();
              }}>
              <span className="button__text">Cancel</span>
            </button>
          </div>
        </div>
        <div className="dropdown toggle-visible" ref={dropdownRef}>
          <button
            type="button"
            className="dropdown__controller"
            onMouseOver={() => {
              dropdownRef.current?.classList.toggle('is-active');
            }}
            onMouseOut={() => {
              if (dropdownRef.current?.classList.contains('is-active')) {
                dropdownRef.current?.classList.remove('is-active');
              }
            }}>
            <span className="dropdown__controller-text sr-only">
              dropdown button
            </span>
          </button>
          <ul
            className="dropdown-list"
            onMouseOver={() => {
              dropdownRef.current?.classList.add('is-active');
            }}
            onMouseOut={() => {
              if (dropdownRef.current?.classList.contains('is-active')) {
                dropdownRef.current?.classList.remove('is-active');
              }
            }}>
            <li className="dropdown-list__item">
              <button
                type="button"
                className="dropdown-list__button dropdown-list__button--edit js-todo-edit"
                onClick={() => {
                  todoFormRef.current?.classList.remove('is-completed');
                  todoFormRef.current?.classList.add('is-toggled');
                  dropdownRef.current?.classList.remove('is-active');
                }}>
                <span className="dropdown-list__button-text">Edit</span>
              </button>
            </li>
            <li className="dropdown-list__item">
              <button
                type="button"
                className="dropdown-list__button dropdown-list__button--delete js-todo-delete"
                onClick={() => {
                  dropdownRef.current?.classList.remove('is-active');
                  id && onDeleteTodo && onDeleteTodo(id);
                }}>
                <span className="dropdown-list__button-text">Delete</span>
              </button>
            </li>
          </ul>
        </div>
        <time className="todo__time" dateTime={createdAt?.iso}>
          {createdAt?.formatted}
        </time>
      </form>
    );
  } else {
    return (
      <form
        className="form js-form-main"
        onSubmit={onSubmit}
        onBlur={() => toggleComponentHasError(titleComponentRef)}
        ref={todoFormRef}>
        <fieldset className="form__fieldset">
          <legend className="form__legend">Todo</legend>
          <ul className="form__list">
            <li className="form__list-item">
              <div className="form__component" ref={titleComponentRef}>
                <label htmlFor="todo-name" className="form__label">
                  Title
                </label>
                <input
                  id="todo-name"
                  name="name"
                  className="form__input js-todo-name"
                  type="text"
                  autoComplete="off"
                  defaultValue={name}
                  autoFocus={!isItem}
                  ref={register({
                    required: true,
                    pattern: /^(?!\s*$).+/,
                  })}
                />
                {errors.name && errors.name.type === 'required' && (
                  <span id="name-error" className="form__error">
                    Please enter a name
                  </span>
                )}
                {errors.name && errors.name.type === 'pattern' && (
                  <span id="name-error" className="form__error">
                    Please enter at least one non-empty character
                  </span>
                )}
              </div>
            </li>
            <li className="form__list-item">
              <div className="form__component">
                <label htmlFor="todo-description" className="form__label">
                  Description
                </label>
                <input
                  id="todo-description"
                  name="description"
                  className="form__input js-todo-description"
                  type="text"
                  autoComplete="off"
                  defaultValue={description}
                  ref={register()}
                />
              </div>
            </li>
          </ul>
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

export default TodoForm;

import React, { FC, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { AddTodo, EditTodo } from '../constants/types';

interface TodoFormProps {
    isEdit?: boolean,
    id?: number,
    name?: string,
    description?: string,
    onAddTodo?: AddTodo,
    onEditTodo?: EditTodo,
    handleEditComplete?: () => void
}

const TodoForm: FC<TodoFormProps> = ({ isEdit, id, name, description, onAddTodo, onEditTodo, handleEditComplete }) => {
    const todoFormRef = useRef<HTMLFormElement>(null);
    const { handleSubmit, register, errors } = useForm({ mode: 'onSubmit' });

    const onSubmit = (values: any) => {
        const { name, description } = values;
        if (isEdit) {
            if (id) {
                onEditTodo!(id, name, description);
                handleEditComplete!();
            }
        } else {
            todoFormRef.current!.reset();
            onAddTodo!(name, description);
        }
    };

    return (
        <form className="site-form" name="todo-form" onSubmit={handleSubmit(onSubmit)} ref={todoFormRef}>
            <div className="site-form__element">
                {isEdit ? null : <label htmlFor="name">Name</label>}
                <input id="name" name="name" type="text" autoComplete="off" ref={register({ required: true })} defaultValue={name || undefined} autoFocus={true} />
                {errors.name && <span id="name-error" className="site-form__error">Required field</span>}
            </div>
            <div className="site-form__element">
                {isEdit ? null : <label htmlFor="description">Description</label>}
                <input id="description" name="description" type="text" autoComplete="off" ref={register({ required: true })} defaultValue={description || undefined} />
                {errors.description && <span id="description-error" className="site-form__error">Required field</span>}
            </div>
            <button id="addTodo" className="site-form__button site-form__button-save" type="submit">{isEdit ? 'Save changes' : 'Add Todo'}</button>
            {isEdit ? <button className="site-form__button-cancel" onClick={handleEditComplete}>Cancel</button> : null}
        </form>
    );
};

export default TodoForm

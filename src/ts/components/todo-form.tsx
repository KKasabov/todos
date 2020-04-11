import React, { FC, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { AddTodo, EditTodo } from '../store/types';

interface TodoFormProps {
    isEdit?: boolean,
    id?: string,
    name?: string,
    description?: string,
    onAddTodo?: AddTodo,
    onEditTodo?: EditTodo,
    handleEditComplete?: () => void
}
type FormData = {
    name: string,
    description: string
}

const TodoForm: FC<TodoFormProps> = ({ isEdit, id, name, description, onAddTodo, onEditTodo, handleEditComplete }) => {
    const todoFormRef = useRef<HTMLFormElement>(null);
    const { handleSubmit, register, errors } = useForm<FormData>({
        reValidateMode: 'onSubmit',
    });

    const onSubmit = handleSubmit(({ name, description }, e) => {
        if (isEdit) {
            if (id) {
                onEditTodo!(id, name, description);
                handleEditComplete!();
            }
        } else {
            e!.target.reset();
            // name.current.focus();
            onAddTodo!(name, description);
        }
    });

    return (
        <form className="site-form" name="todo-form" onSubmit={onSubmit} ref={todoFormRef}>
            <div className="site-form__element">
                {isEdit ? null : <label htmlFor="name">Title</label>}
                <input id="name" name="name" type="text" autoComplete="off" ref={
                    register({
                        required: true,
                        pattern: /^[\w ]*[^\W_][\w ]*$/
                    })
                } defaultValue={name} autoFocus={true} />
                {errors.name && errors.name.type === 'required'
                    && <span id="name-error" className="site-form__error">Please enter a name</span>}
                {errors.name && errors.name.type === 'pattern'
                    && <span id="name-error" className="site-form__error">Please enter at least one non-empty character</span>}
            </div>
            <div className="site-form__element">
                {isEdit ? null : <label htmlFor="description">Description</label>}
                <input id="description" name="description" type="text" autoComplete="off" ref={register()} defaultValue={description} />
            </div>
            <button id="addTodo" className="site-form__button site-form__button-save" type="submit">{isEdit ? 'Save changes' : 'Add Todo'}</button>
            {isEdit ? <button className="site-form__button-cancel" onClick={handleEditComplete}>Cancel</button> : null}
        </form>
    );
};

export default TodoForm

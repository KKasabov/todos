import React, { FC, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { AddTodo, EditTodo } from '../store/types';

interface TodoFormProps {
    isItem?: boolean,
    id?: string,
    name?: string,
    description?: string,
    onAddTodo?: AddTodo,
    onEditTodo?: EditTodo
}
type FormData = {
    name: string,
    description: string
}

const TodoForm: FC<TodoFormProps> = ({ isItem, id, name, description, onAddTodo, onEditTodo }) => {
    const todoFormRef = useRef<HTMLFormElement>(null);
    const { handleSubmit, register, errors } = useForm<FormData>({
        reValidateMode: 'onSubmit',
    });

    const onSubmit = handleSubmit((formData, e) => {
        const nameInputValue = formData.name.trim();
        const descriptionInputValue = formData.description.trim();

        if (isItem) {
            if (id) {
                if (nameInputValue !== name || descriptionInputValue !== description) {
                    onEditTodo!(id, nameInputValue, descriptionInputValue);
                }
            }
        } else {
            onAddTodo!(nameInputValue, descriptionInputValue, id);
            e!.target.reset();
        }
    });

    return (
        <form className="site-form" name="todo-form" onSubmit={onSubmit} ref={todoFormRef}>
            <div className="site-form__element">
                {isItem ? null : <label htmlFor="name">Title</label>}
                <input id='name' name="name" type="text" autoComplete="off" ref={
                    register({
                        required: true,
                        pattern: /^(?!\s*$).+/
                    })
                } defaultValue={name} autoFocus={!isItem} onBlur={isItem ? onSubmit : undefined} />
                {errors.name && errors.name.type === 'required'
                    && <span id="name-error" className="site-form__error">Please enter a name</span>}
                {errors.name && errors.name.type === 'pattern'
                    && <span id="name-error" className="site-form__error">Please enter at least one non-empty character</span>}
            </div>
            <div className="site-form__element">
                {isItem ? null : <label htmlFor="description">Description</label>}
                <input id="description" name="description" type="text" autoComplete="off" ref={register()}
                    defaultValue={description} onBlur={isItem ? onSubmit : undefined} />
            </div>
            {isItem ? <input type="submit" hidden /> : <button id="addTodo" className="site-form__button site-form__button-save" type="submit">Add Todo</button>}
        </form>
    );
};

export default TodoForm

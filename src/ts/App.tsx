import React, { FC, Fragment, MouseEvent } from 'react';
import { hot } from 'react-hot-loader/root';
import TodoList from './components/todo-list';
import TodoForm from './components/todo-form';
import { TodosState, AddTodo, EditTodo, DeleteTodo, ToggleTodoComplete, AppState, Recording, TodoActionType, ADD_TODO, EDIT_TODO, DELETE_TODO, TOGGLE_TODO_COMPLETE } from './store/types';
import * as todoActions from './store/actions'
import '../styles/style.scss';
import { connect, ConnectedProps } from 'react-redux';
import { bindActionCreators, Dispatch, Action } from 'redux';
import store from './store/'
const mapStateToProps = (state: AppState) => {
    const { todos, recordings, isRecording } = state;

    return {
        todos,
        recordings,
        isRecording
    }
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
    actions: bindActionCreators(todoActions, dispatch)
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type AppProps = ConnectedProps<typeof connector>;
const App: FC<AppProps> = ({ todos, recordings, isRecording, actions: { addTodo, editTodo, deleteTodo, toggleTodoComplete, startRecording, stopRecording, playRecording, exitRecording } }) => {
    const addNewTodo: AddTodo = (name, description) => {
        const nameInput: HTMLInputElement = document.getElementById('name')! as HTMLInputElement;
        addTodo(name, description);
        nameInput.focus();
    }

    const programmaticallyAddTodo = (id: string, name: string, description: string, timestamp: Date) => {
        const nameInput: HTMLInputElement = document.getElementById('name')! as HTMLInputElement;
        const descriptionInput: HTMLInputElement = document.getElementById('description')! as HTMLInputElement;

        return new Promise<string>((resolve) => {
            if (nameInput.value !== name) {
                typeText(nameInput, name).then(() => {
                    if (descriptionInput.value !== description) {
                        typeText(descriptionInput, description).then(() => {
                            addTodo(name, description, id, timestamp);
                            nameInput.value = descriptionInput.value = '';
                            resolve();
                        })
                    } else {
                        addTodo(name, description, id, timestamp);
                        nameInput.value = descriptionInput.value = '';
                        resolve();
                    }
                });
            } else if (descriptionInput.value !== description) {
                typeText(descriptionInput, description).then(() => {
                    addTodo(name, description, id, timestamp);
                    nameInput.value = descriptionInput.value = '';
                    resolve();
                })
            }
        });
    }

    const programmaticallyEditTodo = (id: string, name: string, description: string) => {
        return new Promise<string>((resolve, reject) => {
            const todoItem = document.querySelector(`li[value='${id}']`)!;
            if (!todoItem) {
                reject(`Todo with id ${id} was deleted prior to playing this action`);
            }
            const form = todoItem.querySelector(`form`)!;
            const nameInput = form.querySelector('#name')! as HTMLInputElement;
            const descriptionInput = form.querySelector('#description')! as HTMLInputElement;

            if (name !== nameInput.value) {
                typeText(nameInput, name).then(() => {
                    if (description !== descriptionInput.value) {
                        typeText(descriptionInput, description).then(() => {
                            form.blur();
                            resolve();
                        });
                    } else {
                        form.blur();
                        resolve();
                    }
                });
            } else if (description !== descriptionInput.value) {
                typeText(descriptionInput, description).then(() => {
                    form.blur();
                    resolve();
                });
            }
        });
    }

    const programaticallyToggleTodoComplete = (id: string) => {
        const todoItem = document.querySelector(`li[value='${id}']`)!;
        const toggle = todoItem.querySelector('.js-todo-item-toggle-complete')! as HTMLElement;

        return new Promise<string>((resolve) => {
            toggle.click();
            resolve();
        });
    }
    const programmaticallyDeleteTodo = (id: string) => {
        const todoItem = document.querySelector(`li[value='${id}']`)!;
        const deleteButton = todoItem.querySelector('.js-todo-item-delete')! as HTMLElement;

        return new Promise<string>((resolve) => {
            deleteButton.click();
            resolve();
        });
    }

    const typeText = (input: HTMLInputElement, text: string, speed = 75) => {
        input.value = '';
        let i = 0;

        return new Promise<string>((resolve) => {
            input.focus();
            const typeChar = () => {
                if (i < text.length) {
                    input.value += text.charAt(i)
                    i++;
                    if (input.value === text) {
                        setTimeout(resolve, speed * 5) //delay callback
                    }
                    setTimeout(typeChar, speed)
                }
            }
            typeChar();
        })
    }

    const playAction = (action: TodoActionType) => {
        switch (action.type) {
            case ADD_TODO: {
                const { name, description, id, created_at } = action.payload;
                return programmaticallyAddTodo(id, name, description, created_at);
            }
            case EDIT_TODO: {
                const { id, name, description } = action.payload;
                return programmaticallyEditTodo(id, name, description);
            }
            case DELETE_TODO: {
                const { id } = action.payload;
                return programmaticallyDeleteTodo(id);
            }
            case TOGGLE_TODO_COMPLETE: {
                const { id } = action.payload;
                return programaticallyToggleTodoComplete(id);
            }
            default: {
                return new Promise<string>((resolve) => resolve());
            }
        }
    }

    function timer(ms: number) {
        return new Promise(res => setTimeout(res, ms));
    }

    const playActionChain = (actions: TodoActionType[]) => {
        const nextAction = actions.shift();
        if (nextAction) {
            return playAction(nextAction).then(async _ => {
                await timer(1000);
                playActionChain(actions)
            }, error => alert(error))
        } else {
            return Promise.resolve();
        }
    }

    const play = async (recording: Recording) => {
        playRecording(recording);
        await timer(2000);
        playActionChain(recording.actions!).then(async () => {
            await timer(3000);
            exit(recording);
        });
    }

    const exit = (recording: Recording) => {
        exitRecording();
    }

    return <Fragment>
        <ul>
            {recordings.map(rec => <li key={rec.id!}>{rec.created_at!.toLocaleString()}<button onClick={() => play(rec)}>Play</button><button onClick={() => exit(rec)}>Exit</button></li>)}
        </ul>
        <button onClick={() => isRecording ? stopRecording() : startRecording()}>{isRecording ? 'Stop' : 'Start'} recording</button>
        <br />
        <br />
        <TodoForm onAddTodo={addNewTodo} />
        <br />
        <br />
        <TodoList todos={todos} onDeleteTodo={deleteTodo} onEditTodo={editTodo} onToggleTodoComplete={toggleTodoComplete} />
    </Fragment>;
}


export default connector(hot(App));
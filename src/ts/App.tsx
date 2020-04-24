import React, { FC, Fragment } from 'react';
import { hot } from 'react-hot-loader/root';
import TodoList from './components/todo-list';
import TodoForm from './components/todo-form';
import RecordingsList from './components/recordings-list';
import { AppState, Recording, TodoActionType, ADD_TODO, EDIT_TODO, DELETE_TODO, TOGGLE_TODO_COMPLETE } from './store/types';
import * as todoActions from './store/actions'
import { connect, ConnectedProps } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import '../styles/style.scss';
import { Moment } from 'moment';

const mapStateToProps = (state: AppState) => {
    const { todos, recordings, isRecording, isPlaying } = state;

    return {
        todos,
        recordings,
        isRecording,
        isPlaying
    }
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
    actions: bindActionCreators(todoActions, dispatch)
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type AppProps = ConnectedProps<typeof connector>;
const App: FC<AppProps> = (
    {
        todos,
        recordings,
        isRecording,
        isPlaying,
        actions: {
            addTodo,
            editTodo,
            deleteTodo,
            toggleTodoComplete,
            startRecording,
            stopRecording,
            playRecording,
            exitRecording
        }
    }
) => {
    const programmaticallyAddTodo = (id: string, name: string, description: string, timestamp: Moment) => {
        return new Promise<string>((resolve) => {
            const nameInput: HTMLInputElement = document.getElementById('name')! as HTMLInputElement;
            const descriptionInput: HTMLInputElement = document.getElementById('description')! as HTMLInputElement;

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
        return new Promise<string>(resolve => {
            const todoItem = document.querySelector(`li[value='${id}']`)!;
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
        return new Promise<string>((resolve) => {
            const todoItem = document.querySelector(`li[value='${id}']`)!;
            const toggle = todoItem.querySelector('.js-todo-item-toggle-complete')! as HTMLElement;

            toggle.click();
            resolve();
        });
    }

    const programmaticallyDeleteTodo = (id: string) => {
        return new Promise<string>((resolve) => {
            const todoItem = document.querySelector(`li[value='${id}']`)!;
            const deleteButton = todoItem.querySelector('.js-todo-item-delete')! as HTMLElement;

            deleteButton.click();
            resolve();
        });
    }

    const typeText = (input: HTMLInputElement, text: string, speed = 75) => {
        return new Promise<string>((resolve) => {
            input.value = '';
            let i = 0;

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

    const timer = (ms: number) => {
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

    const playRec = async (recording: Recording) => {
        playRecording(recording);
        await timer(2000);
        playActionChain([...recording.actions!]);
    }

    return <Fragment>
        <RecordingsList
            recordings={recordings}
            isPlaying={isPlaying}
            isRecording={isRecording}
            onPlay={playRec}
            onExit={exitRecording}
            onStartRecodring={startRecording}
            onStopRrecording={stopRecording}
        />
        <br />
        <br />
        <TodoForm onAddTodo={addTodo} />
        <br />
        <br />
        <TodoList
            todos={todos}
            onDeleteTodo={deleteTodo}
            onEditTodo={editTodo}
            onToggleTodoComplete={toggleTodoComplete}
            isPlaying={isPlaying}
        />
    </Fragment>;
}

export default connector(hot(App));
import React, { useRef, useEffect } from 'react';
import { hot } from 'react-hot-loader/root';
import TodoList from './components/todo-list';
import TodoForm from './components/todo-form';
import RecordingsList from './components/recordings-list';
import {
  AppState,
  Recording,
  TodoActionType,
  ADD_TODO,
  EDIT_TODO,
  DELETE_TODO,
  TOGGLE_TODO_COMPLETE,
} from './store/types';
import * as todoActions from './store/actions';
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
    isPlaying,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  actions: bindActionCreators(todoActions, dispatch),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type AppProps = ConnectedProps<typeof connector>;
const App = ({
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
    exitRecording,
    deleteRecording,
    deleteAllRecordings,
  },
}: AppProps) => {
  const typeText = (input: HTMLInputElement, text: string, speed = 75) => {
    return new Promise<void>((resolve) => {
      input.value = '';
      let i = 0;

      input.focus();
      const typeChar = () => {
        if (i < text.length) {
          input.value += text.charAt(i);
          i++;
          if (input.value === text) {
            setTimeout(resolve, speed * 5); //delay callback
          }
          setTimeout(typeChar, speed);
        }
      };
      typeChar();
    });
  };

  const timer = (ms: number) => {
    return new Promise((res) => setTimeout(res, ms));
  };

  const programmaticallyAddTodo = (
    id: string,
    name: string,
    description: string,
    timestamp: Moment
  ) => {
    return new Promise<void>((resolve) => {
      const form = document.querySelector('.js-form-main') as HTMLFormElement;
      const nameInput = form?.querySelector(
        '.js-todo-name'
      ) as HTMLInputElement;
      const descriptionInput = form?.querySelector(
        '.js-todo-description'
      ) as HTMLInputElement;

      if (nameInput.value !== name) {
        typeText(nameInput, name).then(() => {
          if (descriptionInput.value !== description) {
            typeText(descriptionInput, description).then(() => {
              addTodo(name, description, id, timestamp);
              nameInput.value = descriptionInput.value = '';
              resolve();
            });
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
        });
      }
    });
  };

  const programmaticallyEditTodo = (
    id: string,
    name: string,
    description: string
  ) => {
    return new Promise<void>((resolve) => {
      const todoItem = document.querySelector(
        `li[value='${id}']`
      ) as HTMLLIElement;
      const form = todoItem?.querySelector('.js-form');
      const nameInput = form?.querySelector(
        '.js-todo-name-inner'
      ) as HTMLInputElement;
      const descriptionInput = form?.querySelector(
        '.js-todo-description-inner'
      ) as HTMLInputElement;
      const editButton = form?.querySelector(
        '.js-todo-edit'
      ) as HTMLButtonElement;
      const saveButton = form?.querySelector(
        '.js-todo-save'
      ) as HTMLButtonElement;

      editButton.click();
      timer(2000).then(() => {
        if (name !== nameInput.value) {
          typeText(nameInput, name).then(() => {
            if (description !== descriptionInput.value) {
              typeText(descriptionInput, description).then(() => {
                saveButton.click();
                resolve();
              });
            } else {
              saveButton.click();
              resolve();
            }
          });
        } else if (description !== descriptionInput.value) {
          typeText(descriptionInput, description).then(() => {
            saveButton.click();
            resolve();
          });
        }
      });
    });
  };

  const programaticallyToggleTodoComplete = (id: string) => {
    return new Promise<void>((resolve) => {
      const todoItem = document.querySelector(
        `li[value='${id}']`
      ) as HTMLLIElement;
      const toggle = todoItem?.querySelector('.js-todo-toggle') as HTMLElement;

      toggle.click();
      resolve();
    });
  };

  const programmaticallyDeleteTodo = (id: string) => {
    return new Promise<void>((resolve) => {
      const todoItem = document.querySelector(
        `li[value='${id}']`
      ) as HTMLLIElement;
      const deleteButton = todoItem?.querySelector(
        '.js-todo-delete'
      ) as HTMLElement;

      deleteButton.click();
      resolve();
    });
  };

  const playAction = (action: TodoActionType) => {
    switch (action.type) {
      case ADD_TODO: {
        const { name, description, id, createdAt } = action.payload;
        return programmaticallyAddTodo(id, name, description, createdAt);
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
        return new Promise<void>((resolve) => resolve());
      }
    }
  };

  const playActionChain = async (actions: TodoActionType[]) => {
    const todo = document.querySelector('.js-todo') as HTMLDivElement;
    const nextAction = actions.shift();
    todo.classList.add('has-overlay');
    await timer(1500);
    if (nextAction) {
      return playAction(nextAction).then(
        () => {
          timer(1000).then(() => {
            playActionChain(actions);
          });
        },
        (error) => alert(error)
      );
    } else {
      todo.classList.remove('has-overlay');
      exitRecording();
    }
  };

  const playRec = async (recording: Recording) => {
    if (recording.actions) {
      playRecording(recording);
      playActionChain([...recording.actions]);
    }
  };

  const recListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isPlaying) {
      exitRecording();
    }
  }, []);

  return (
    <div className="todo js-todo">
      <div className="wrapper">
        <header
          className="todo__header"
          style={isPlaying ? { pointerEvents: 'none' } : {}}
        >
          <button
            type="button"
            className={`button button--light button-video ${
              isRecording ? 'is-active' : ''
            }`}
            onClick={() => (isRecording ? stopRecording() : startRecording())}
          >
            <span className="button-video__icons">
              <i className="button__icon button__icon--video-on" />
              <i className="button__icon button__icon--video-off" />
            </span>
            <span className="button__text">
              {isRecording ? 'Stop' : 'Start'} recording
            </span>
          </button>
          {recordings.length > 0 ? (
            <div ref={recListRef}>
              <div className="todo-recording" ref={recListRef}>
                <ul className="todo-recording__list">
                  <RecordingsList
                    recordings={recordings}
                    onPlay={playRec}
                    onDelete={deleteRecording}
                    isPlaying={isPlaying}
                    isRecording={isRecording}
                  />
                </ul>
              </div>
              <div className="button-holder button-holder--right button-holder--no-padding">
                <button
                  type="button"
                  className="button button--accent"
                  onClick={() => {
                    recListRef.current?.classList.add('fade-out');
                    setTimeout(() => {
                      deleteAllRecordings();
                    }, 500);
                  }}
                  disabled={isPlaying || isRecording}
                >
                  <span className="button__text">Delete all recordings</span>
                </button>
              </div>
            </div>
          ) : null}
        </header>
        <main className="todo__content">
          <TodoForm onAddTodo={addTodo} />
          <TodoList
            todos={todos}
            onDeleteTodo={deleteTodo}
            onEditTodo={editTodo}
            onToggleTodoComplete={toggleTodoComplete}
            isPlaying={isPlaying}
          />
        </main>
      </div>
    </div>
  );
};

export default connector(hot(App));

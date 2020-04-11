import React, { FC, Fragment } from 'react';
import { hot } from 'react-hot-loader/root';
import TodoList from './components/todo-list';
import TodoForm from './components/todo-form';
import { TodosState, AddTodo, EditTodo, DeleteTodo, Todo } from './store/types';
import * as todoActions from './store/actions'
import '../styles/style.scss';
import { connect, ConnectedProps } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

const mapStateToProps = (state: TodosState) => ({
    todos: state.todos
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    actions: bindActionCreators(todoActions, dispatch)
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type AppProps = ConnectedProps<typeof connector>;

const App: FC<AppProps> = ({ todos, actions: { addTodo, editTodo, deleteTodo } }) => {
    const handleTodoAdded: AddTodo = (name, description) => {
        addTodo(name, description);
    };

    const handleTodoEdited: EditTodo = (id, name, description) => {
        editTodo(id, name, description);
    }

    const handleTodoDeleted: DeleteTodo = (id) => {
        deleteTodo(id);
    }

    return <Fragment>
        <TodoForm onAddTodo={handleTodoAdded} />
        <TodoList todos={todos} onDeleteTodo={handleTodoDeleted} onEditTodo={handleTodoEdited} />
    </Fragment>;
}


export default connector(hot(App));
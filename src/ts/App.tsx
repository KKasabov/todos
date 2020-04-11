import React, { FC, Fragment } from 'react';
import { hot } from 'react-hot-loader/root';
import TodoList from './components/todo-list';
import TodoForm from './components/todo-form';
import { TodosState, AddTodo, EditTodo, DeleteTodo, ToggleTodoComplete } from './store/types';
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

const App: FC<AppProps> = ({ todos, actions: { addTodo, editTodo, deleteTodo, toggleTodoComplete } }) => {
    return <Fragment>
        <TodoForm onAddTodo={addTodo} />
        <TodoList todos={todos} onDeleteTodo={deleteTodo} onEditTodo={editTodo} onToggleTodoComplete={toggleTodoComplete} />
    </Fragment>;
}


export default connector(hot(App));
import React from 'react';
import { Todo, EditTodo, DeleteTodo, ToggleTodoComplete } from '../store/types';
import TodoForm from './todo-form';
import moment, { Moment } from 'moment';

interface TodoItemProps {
  todo: Todo;
  onEdit: EditTodo;
  onDelete: DeleteTodo;
  onToggleComplete: ToggleTodoComplete;
  isPlaying: boolean;
}

const fromNowOrJustNow = (m: Moment) => {
  // for anything under a minute show 'just now'
  if (Math.abs(m.diff()) < 60000) {
    return 'just now';
  }
  return m.fromNow();
};

const TodoItem = ({
  todo,
  onDelete,
  onEdit,
  onToggleComplete,
  isPlaying,
}: TodoItemProps) => {
  const { id, name, description, createdAt, isComplete } = todo;
  const formattedDate = isPlaying
    ? moment(createdAt).format('HH:mm:ss')
    : fromNowOrJustNow(moment(createdAt));
  const dates = {
    iso: moment(createdAt).toISOString(),
    formatted: formattedDate,
  };
  return (
    <li className="todo__list-item fade-in-down" key={id} value={id}>
      <TodoForm
        isItem={true}
        id={id}
        name={name}
        description={description}
        createdAt={dates}
        isComplete={isComplete}
        onEditTodo={onEdit}
        onDeleteTodo={onDelete}
        onToggleTodo={onToggleComplete}
      />
    </li>
  );
};

export default TodoItem;

import React from 'react';
import TodoItem from './todo-item';
import { Todo, DeleteTodo, EditTodo, ToggleTodoComplete } from '../store/types';
import moment from 'moment';

interface TodoListProps {
  todos: Todo[];
  onDeleteTodo: DeleteTodo;
  onEditTodo: EditTodo;
  onToggleTodoComplete: ToggleTodoComplete;
  isPlaying: boolean;
}

const TodoList = ({
  todos,
  onDeleteTodo,
  onEditTodo,
  onToggleTodoComplete,
  isPlaying,
}: TodoListProps) => {
  return (
    <ul className="todo__list">
      {todos
        .sort((a: Todo, b: Todo) => {
          const currentDate = moment(a.createdAt);
          const currentComplete = a.isComplete;
          const nextDate = moment(b.createdAt);
          const nextComplete = b.isComplete;

          return currentComplete
            ? 1
            : nextComplete
            ? -1
            : currentDate.isAfter(nextDate)
            ? -1
            : currentDate.isBefore(nextDate)
            ? 1
            : 0;
        })
        .map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onDelete={onDeleteTodo}
            onEdit={onEditTodo}
            onToggleComplete={onToggleTodoComplete}
            isPlaying={isPlaying}
          />
        ))}
    </ul>
  );
};

export default TodoList;

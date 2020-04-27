import React from 'react';
import { Recording, PlayRecording, DeleteRecording } from '../store/types';
import moment from 'moment';

interface RecordingsListProps {
  recordings?: Recording[];
  onPlay?: PlayRecording;
  onExit?: PlayRecording;
  onDelete?: DeleteRecording;
}

const RecordingsList = ({
  recordings,
  onPlay,
  onExit,
  onDelete,
}: RecordingsListProps) => {
  return (
    <div className="todo-recording">
      <ul className="todo-recording__list">
        {recordings &&
          recordings
            .sort((a: Recording, b: Recording) => {
              const currentDate = moment(a.createdAt);
              const nextDate = moment(b.createdAt);

              return currentDate.isAfter(nextDate)
                ? -1
                : currentDate.isBefore(nextDate)
                ? 1
                : 0;
            })
            .map((rec) => {
              return (
                <li
                  key={rec.id}
                  className="todo-recording__list-item fade-in-right"
                >
                  <div className="todo-recording__component">
                    <div className="button-holder button-holder--no-padding">
                      <button
                        type="button"
                        className="button"
                        onClick={() => onPlay && onPlay(rec)}
                      >
                        <i className="button__icon button__icon--play"></i>
                      </button>
                    </div>
                    <span className="todo-recording__title">
                      {moment(rec.createdAt).format('DD MMM YYYY HH:mm:ss')}
                    </span>
                    <div className="button-holder button-holder--no-padding">
                      <button
                        type="button"
                        className="button"
                        onClick={() => {
                          setTimeout(() => {
                            onDelete && onDelete(rec.id);
                          }, 2000);
                        }}
                      >
                        <i className="button__icon button__icon--delete"></i>
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
      </ul>
    </div>
  );
};

export default RecordingsList;

import React, { Fragment } from 'react';
import { Recording, PlayRecording, DeleteRecording } from '../store/types';
import moment from 'moment';

interface RecordingsListProps {
  recordings?: Recording[];
  onPlay?: PlayRecording;
  onDelete?: DeleteRecording;
  isPlaying?: boolean;
}

const RecordingsList = ({
  recordings,
  onPlay,
  onDelete,
  isPlaying,
}: RecordingsListProps) => {
  return (
    <Fragment>
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
                value={rec.id}
                className="todo-recording__list-item fade-in-right"
              >
                <div className="todo-recording__component">
                  <div className="button-holder button-holder--no-padding">
                    <button
                      type="button"
                      className="button"
                      onClick={() => (isPlaying ? null : onPlay && onPlay(rec))}
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
                        if (!isPlaying) {
                          const todoItem = document.querySelector(
                            `li[value='${rec.id}']`
                          ) as HTMLLIElement;
                          todoItem.classList.add('fade-out-left');
                          setTimeout(() => {
                            onDelete && onDelete(rec.id);
                          }, 500);
                        }
                      }}
                    >
                      <i className="button__icon button__icon--delete"></i>
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
    </Fragment>
  );
};

export default RecordingsList;

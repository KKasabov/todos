import React, { FC, Fragment } from 'react'
import { Recording, SetIsRecording, PlayRecording, DeleteRecording, DeleteAllRecordings } from '../store/types'
import moment from 'moment';

interface RecordingsListProps {
    recordings: Recording[],
    isPlaying: boolean,
    isRecording: boolean,
    onPlay: PlayRecording,
    onExit: PlayRecording,
    onDelete: DeleteRecording,
    onDeleteAll: DeleteAllRecordings,
    onStartRecording: SetIsRecording,
    onStopRecording: SetIsRecording
}

const RecordingsList: FC<RecordingsListProps> = ({ recordings, isRecording, isPlaying, onPlay, onExit, onDelete, onDeleteAll, onStopRecording, onStartRecording }) => {
    return <Fragment>
        <ul>
            {recordings.map(rec => {
                return (
                    <li key={rec.id!}>
                        {moment(rec.created_at!).format('DD MMM YYYY HH:mm:ss')}
                        {isPlaying
                            ? <button onClick={() => onExit(rec)}>Exit</button>
                            : <button onClick={() => onPlay(rec)}>Play</button>
                        }
                        <button onClick={() => onDelete(rec.id!)}>Delete</button>
                    </li>
                );
            })}
            <button onClick={() => onDeleteAll()}>Delete all</button>
        </ul>
        <button onClick={() => isRecording ? onStopRecording() : onStartRecording()}>{isRecording ? 'Stop' : 'Start'} recording</button>
    </Fragment>;

}

export default RecordingsList

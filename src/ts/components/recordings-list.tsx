import React, { FC, Fragment } from 'react'
import { Recording, SetIsRecording, PlayRecording } from '../store/types'
import moment from 'moment';

interface RecordingsListProps {
    recordings: Recording[],
    isPlaying: boolean,
    isRecording: boolean,
    onPlay: PlayRecording,
    onExit: PlayRecording,
    onStartRecodring: SetIsRecording,
    onStopRrecording: SetIsRecording
}

const RecordingsList: FC<RecordingsListProps> = ({ recordings, isRecording, isPlaying, onPlay, onExit, onStopRrecording, onStartRecodring }) => {
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
                    </li>
                );
            })}
        </ul>
        <button onClick={() => isRecording ? onStopRrecording() : onStartRecodring()}>{isRecording ? 'Stop' : 'Start'} recording</button>
    </Fragment>;

}

export default RecordingsList

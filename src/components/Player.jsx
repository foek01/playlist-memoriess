import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlay,
    faPause,
    faStepForward,
} from "@fortawesome/free-solid-svg-icons";
import { observer } from "mobx-react-lite";

import serviceContext from "../utils/context";

const Player = observer(() => {
    const {
        playerService: { current_song, paused, togglePlayback, nextSong },
    } = useContext(serviceContext);

    return (
        <div className="player">
            <div className="image">
                <img src={current_song?.img} alt="" />
            </div>
            <div className="text">
                <div className="title">{current_song?.title}</div>
                <div className="description">
                    {current_song?.artists?.join(", ")}
                </div>
            </div>
            <div className="playback">
                <FontAwesomeIcon
                    icon={paused ? faPlay : faPause}
                    onClick={togglePlayback}
                />
                <FontAwesomeIcon icon={faStepForward} onClick={nextSong} />
            </div>
        </div>
    );
});

export default Player;

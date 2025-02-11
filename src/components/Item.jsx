import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faList } from "@fortawesome/free-solid-svg-icons";

const Item = ({
    title,
    artist,
    image,
    onClick,
    active,
    show_actions,
    onPlay,
    onQueue,
}) => (
    <div className={`item${active ? " active" : ""}`} onClick={onClick}>
        <div className="image">
            <img src={image} alt="" />
        </div>
        <div className="text">
            <div className="title">{title}</div>
            <div className="description">{artist}</div>
        </div>
        {show_actions && (
            <div className="actions">
                <FontAwesomeIcon icon={faPlay} onClick={onPlay} />
                <FontAwesomeIcon icon={faList} onClick={onQueue} />
            </div>
        )}
    </div>
);

export default Item;

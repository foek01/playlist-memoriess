import React, { useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import serviceContext from "../utils/context";
import "../styles/memories.css";

const Memory = ({ memory }) => (
    <div className="memory">
        <img src={memory?.image} alt="" />
        <textarea
            type="text"
            placeholder="Memory"
            value={memory?.text}
            disabled
        />
    </div>
);

const CreateMemory = observer(() => {
    const {
        playerService: { createMemory },
    } = useContext(serviceContext);

    const [image, setImage] = useState(null);
    const [text, setText] = useState(null);

    const uploadImage = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.addEventListener(
            "load",
            function () {
                setImage(reader.result);
            },
            false
        );

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="memory">
            <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                    uploadImage(e);
                }}
            />
            <img src={image} alt="" />
            <textarea
                type="text"
                placeholder="Type your memory here"
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
        </div>
    );
});

const Memories = observer(() => {
    const {
        playerService: { song_id, memories, memory_song, newMemory },
    } = useContext(serviceContext);

    return (
        <>
            {song_id && (
                <div className="memories">
                    <div className="meta">
                        <h1>{memory_song?.title}</h1>
                        <h2>{memory_song?.artists?.join(", ")}</h2>
                        <div className="new" onClick={newMemory}>
                            <FontAwesomeIcon icon={faPlus} />
                            <div>Add memory</div>
                        </div>
                    </div>
                    <div className={`list ${!memories?.length ? "empty" : ""}`}>
                        {!memories?.length && (
                            <div className="empty">Add memories!</div>
                        )}
                        {memories?.map((memory) => (
                            <Memory memory={memory} key={memory?.id} />
                        ))}
                    </div>
                </div>
            )}
        </>
    );
});

export default Memories;

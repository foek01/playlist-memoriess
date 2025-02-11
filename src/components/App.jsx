import React, { useEffect, useContext, useState } from "react";
import { observer } from "mobx-react-lite";

import Spotify from "./Spotify";
import Memories from "./Memories";
import serviceContext from "../utils/context";

const CreateRoom = observer(() => {
    const {
        playerService: { generateRoom },
    } = useContext(serviceContext);

    const [name, setName] = useState("");

    return (
        <div>
            <input
                type="text"
                value={name}
                onChange={(e) => {
                    setName(e.target.value);
                }}
            />
            <button
                disabled={!name}
                onClick={() => generateRoom({ room_name: name })}
            >
                Create room
            </button>
        </div>
    );
});

const App = observer(() => {
    const {
        playerService: { initialize, room_code },
    } = useContext(serviceContext);

    useEffect(() => {
        initialize();
    }, [initialize]);

    return (
        <div className="container">
            {!room_code ? (
                <CreateRoom />
            ) : (
                <>
                    <div>
                        <Spotify />
                    </div>
                    <div>
                        <Memories />
                    </div>
                </>
            )}
        </div>
    );
});

export default App;

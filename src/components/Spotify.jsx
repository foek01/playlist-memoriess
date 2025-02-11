import React, { useContext } from "react";
import { observer } from "mobx-react-lite";

import Nav from "./Nav";
import Item from "./Item";
import Player from "./Player";
import serviceContext from "../utils/context";
import "../styles/spotify.css";

const Spotify = observer(() => {
    const {
        playerService: {
            songs,
            playlists,
            setPlaylist,
            playSong,
            queueSong,
            setSong,
            song_id,
            nav,
        },
    } = useContext(serviceContext);

    return (
        <div className="spotify">
            <Nav />
            <div className="items">
                <>
                    {nav === "playlists" && (
                        <>
                            {playlists.map(({ title, img, owner, id }) => {
                                return (
                                    <Item
                                        title={title}
                                        image={img}
                                        artist={owner}
                                        onClick={() => setPlaylist(id)}
                                    />
                                );
                            })}
                        </>
                    )}
                    {nav === "songs" && (
                        <>
                            {songs.map(({ id, uri, title, img, artists }) => {
                                if (!id) return null;
                                return (
                                    <Item
                                        title={title}
                                        image={img}
                                        artist={artists.join(", ")}
                                        onClick={() => setSong(id)}
                                        onPlay={(e) => {
                                            e.stopPropagation();
                                            playSong(uri);
                                        }}
                                        onQueue={() => queueSong(uri)}
                                        active={id === song_id}
                                        show_actions
                                    />
                                );
                            })}
                        </>
                    )}
                </>
            </div>
            <Player />
        </div>
    );
});

export default Spotify;

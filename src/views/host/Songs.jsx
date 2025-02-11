import React from "react";
import { observer } from "mobx-react-lite";
import { makeStyles } from "@material-ui/core/styles";
import {
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Divider,
    ListItemSecondaryAction,
    Chip,
} from "@material-ui/core";
import { PlayArrow, Queue } from "@material-ui/icons";

import { useStores } from "../../stores";

const useStyles = makeStyles((theme) => ({
    songs: {
        overflow: "scroll",
        width: "100%",
        flex: "1 1 auto",
    },
    song: {
        cursor: "pointer",
        "&:hover": {
            background: theme.palette.background.default,
        },
    },
}));

const Songs = observer(({ onSelectSong }) => {
    const {
        applicationStore: { memories, setSelectedSong },
        spotifyStore: { songs, playSong, queueSong },
    } = useStores();

    const classes = useStyles();

    return (
        <List className={classes.songs}>
            {songs.map((song, index) => (
                <div key={song?.id || index}>
                    <ListItem alignItems="flex-start" className={classes.song}>
                        <ListItemAvatar>
                            <Avatar alt="" src={song?.img || ""} />
                        </ListItemAvatar>
                        <ListItemText
                            primary={song?.title || ""}
                            secondary={<>{song?.artists?.join(", ") || ""}</>}
                        />
                        <ListItemSecondaryAction>
                            <Chip
                                color="secondary"
                                label={`${
                                    memories?.filter(
                                        (memory) => memory?.song_id === song?.id
                                    )?.length
                                }`}
                                onClick={() => {
                                    setSelectedSong(song?.id);
                                    onSelectSong();
                                }}
                            />
                            <IconButton
                                aria-label="play"
                                onClick={() => playSong(song?.uri)}
                            >
                                <PlayArrow />
                            </IconButton>
                            <IconButton
                                aria-label="queue"
                                onClick={() => queueSong(song?.uri)}
                            >
                                <Queue />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                    <Divider variant="inset" component="li" />
                </div>
            ))}
        </List>
    );
});

export default Songs;

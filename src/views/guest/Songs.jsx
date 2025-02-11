import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Divider,
    Typography,
    Button,
} from "@material-ui/core";
import { RateReview } from "@material-ui/icons";
import { observer } from "mobx-react-lite";

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

const Songs = observer(() => {
    const {
        applicationStore: { openAddMemoryPopup, openAddSongPopup },
        spotifyStore: { songs, playlist },
    } = useStores();

    const classes = useStyles();

    return (
        <>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <div>&nbsp;</div>
                <Button color="primary" onClick={openAddSongPopup}>
                    Add a song
                </Button>
            </div>
            <List className={classes.songs}>
                <Typography component="h5" variant="h5">
                    {`${playlist?.title || ""}`}
                </Typography>
                {songs.map((song, index) => (
                    <div key={song?.id || index}>
                        <ListItem
                            alignItems="flex-start"
                            className={classes.song}
                        >
                            <ListItemAvatar>
                                <Avatar alt="" src={song?.img || ""} />
                            </ListItemAvatar>
                            <ListItemText
                                primary={song?.title || ""}
                                secondary={
                                    <>{song?.artists?.join(", ") || ""}</>
                                }
                            />
                            <ListItemSecondaryAction>
                                <IconButton
                                    aria-label="add-memory"
                                    onClick={() => openAddMemoryPopup(song?.id)}
                                >
                                    <RateReview />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                        <Divider variant="inset" component="li" />
                    </div>
                ))}
            </List>
        </>
    );
});

export default Songs;

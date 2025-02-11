import React from "react";
import { observer } from "mobx-react-lite";
import { makeStyles } from "@material-ui/core/styles";
import { SkipNext, PlayArrow, Pause } from "@material-ui/icons";
import {
    Card,
    CardContent,
    Typography,
    IconButton,
    CardMedia,
} from "@material-ui/core";

import { useStores } from "../../stores";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flexGrow: "1",
    },
    details: {
        display: "flex",
        flex: "1 1 auto",
        flexDirection: "column",
    },
    content: {
        flex: "1 0 auto",
    },
    cover: {
        width: 151,
    },
    controls: {
        display: "flex",
        alignItems: "center",
        paddingLeft: theme.spacing(1),
        paddingBottom: theme.spacing(1),
    },
    playIcon: {
        height: 38,
        width: 38,
    },
}));

const MediaControlCard = observer(() => {
    const classes = useStyles();

    const {
        spotifyStore: { paused, current_song, togglePlayback, nextSong },
    } = useStores();

    return !current_song ? null : (
        <Card className={classes.root}>
            <div className={classes.details}>
                <CardContent className={classes.content}>
                    <Typography component="h5" variant="h5">
                        {current_song?.title || ""}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        {current_song?.artists?.join(", ") || ""}
                    </Typography>
                </CardContent>
                <div className={classes.controls}>
                    <IconButton
                        aria-label="play/pause"
                        disabled={!current_song}
                        onClick={togglePlayback}
                    >
                        {paused ? (
                            <PlayArrow className={classes.playIcon} />
                        ) : (
                            <Pause className={classes.playIcon} />
                        )}
                    </IconButton>
                    <IconButton
                        aria-label="next"
                        disabled={!current_song}
                        onClick={nextSong}
                    >
                        <SkipNext />
                    </IconButton>
                </div>
            </div>
            <CardMedia
                className={classes.cover}
                image={current_song?.img || ""}
                title="Album cover"
            />
        </Card>
    );
});

export default MediaControlCard;

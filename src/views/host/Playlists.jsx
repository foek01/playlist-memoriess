import React from "react";
import { observer } from "mobx-react-lite";
import { makeStyles } from "@material-ui/core/styles";
import {
    Paper,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Divider,
    ListItemSecondaryAction,
    Button,
    Typography,
} from "@material-ui/core";

import { useStores } from "../../stores";

const useStyles = makeStyles((theme) => ({
    paper: { padding: theme.spacing(3), height: "100%", overflow: "hidden" },
    playlists: {
        width: "100%",
        height: "100%",
        overflow: "scroll",
    },
    playlist: {
        cursor: "pointer",
        "&:hover": {
            background: theme.palette.background.default,
        },
    },
    choosePlaylistBanner: { display: "flex", alignItems: "center" },
}));

const Playlists = observer(() => {
    const {
        spotifyStore: { playlists, setPlaylist, createPlaylist },
    } = useStores();

    const classes = useStyles();

    return (
        <Paper className={classes.paper}>
            <div className={classes.choosePlaylistBanner}>
                <Typography variant="subtitle1">
                    Choose a playlist... Or&nbsp;
                </Typography>
                <Button color="primary" onClick={createPlaylist}>
                    Create a playlist
                </Button>
            </div>
            <List className={classes.playlists}>
                {playlists.map((playlist, index) => (
                    <div key={playlist?.id || index}>
                        <ListItem
                            alignItems="flex-start"
                            className={classes.playlist}
                        >
                            <ListItemAvatar>
                                <Avatar alt="" src={playlist?.img || ""} />
                            </ListItemAvatar>
                            <ListItemText
                                primary={playlist?.title || ""}
                                secondary={<>{playlist?.owner || ""}</>}
                            />
                            <ListItemSecondaryAction>
                                <Button
                                    color="primary"
                                    onClick={() => setPlaylist(playlist?.id)}
                                >
                                    Select
                                </Button>
                            </ListItemSecondaryAction>
                        </ListItem>
                        <Divider variant="inset" component="li" />
                    </div>
                ))}
            </List>
        </Paper>
    );
});

export default Playlists;

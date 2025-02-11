import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
    Grid,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Dialog,
    TextField,
    ListItem,
    List,
    ListItemAvatar,
    Avatar,
    ListItemText,
    ListItemSecondaryAction,
    Divider,
    IconButton,
} from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { observer } from "mobx-react-lite";

import { useToaster } from "../../hooks/useToaster";
import { useStores } from "../../stores";
import { useScreenSize } from "../../hooks/screensize";

const useStyles = makeStyles((theme) => ({
    "@global": {
        ".dropzone": {
            height: "10rem",
            minHeight: "unset",
        },
        ".dropzone .MuiDropzonePreviewList-root": {
            marginLeft: "-28px",
            marginTop: "-119px",
        },
    },
    dialog: {
        [theme.breakpoints.up("sm")]: {
            width: "34rem",
        },
    },
    dialogcontent: {
        height: "23rem",
        display: "flex",
        flexDirection: "column",
    },
}));

const AddSongDialog = observer(() => {
    const {
        applicationStore: { closeAddSongPopup, addSong },
        spotifyStore: { playlist, search },
    } = useStores();

    const classes = useStyles();
    const { addToast } = useToaster();
    const screensize = useScreenSize();

    const [query, setQuery] = useState("");
    const [debounceId, setDebounceId] = useState(null);
    const [results, setResults] = useState([]);

    const doSearch = (q) => {
        setQuery(q);
        clearTimeout(debounceId);
        setDebounceId(
            setTimeout(
                () =>
                    search(q)
                        .then((result) => {
                            setResults(result || []);
                        })
                        .catch(() => {}),
                500
            )
        );
    };

    return (
        <Dialog
            onClose={() => {}}
            open
            fullScreen={screensize === "mobile"}
            classes={{ paper: classes.dialog }}
        >
            <DialogTitle>
                Add song to playlist: {playlist?.title || ""}
            </DialogTitle>
            <DialogContent className={classes.dialogcontent}>
                <div style={{ flex: "0 0 auto" }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label={"Search"}
                        onChange={(e) => {
                            doSearch(e.target.value);
                        }}
                        value={query}
                    />
                </div>
                <div style={{ overflow: "auto", flex: "1 1 auto" }}>
                    <List>
                        {results.map((song, index) => (
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
                                            <>
                                                {song?.artists?.join(", ") ||
                                                    ""}
                                            </>
                                        }
                                    />
                                    <ListItemSecondaryAction>
                                        <IconButton
                                            aria-label="play"
                                            onClick={() =>
                                                addSong(song?.uri)
                                                    .then(() => {
                                                        addToast(`Song added`, {
                                                            variant: "success",
                                                        });
                                                    })
                                                    .catch(() => {
                                                        addToast(
                                                            `Something went wrong`,
                                                            {
                                                                variant:
                                                                    "error",
                                                            }
                                                        );
                                                    })
                                            }
                                        >
                                            <Add />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                                <Divider variant="inset" component="li" />
                            </div>
                        ))}
                    </List>
                </div>
            </DialogContent>
            <DialogActions>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Button
                            fullWidth
                            size={"medium"}
                            color={"secondary"}
                            variant={"contained"}
                            onClick={closeAddSongPopup}
                        >
                            Done
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Dialog>
    );
});

export default AddSongDialog;

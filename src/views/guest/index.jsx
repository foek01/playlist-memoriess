import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Container, Grid, Box, Paper } from "@material-ui/core";
import { observer } from "mobx-react-lite";

import { useStores } from "../../stores";
import Songs from "./Songs";
import AddMemoryDialog from "./AddMemoryDialog";
import AddSongDialog from "../shared/AddSongDialog";
import NoPlaylist from "./NoPlaylist";

const useStyles = makeStyles((theme) => ({
    container: {
        flex: "1 1 auto",
        overflow: "hidden",
    },
    box: {
        height: "100%",
        overflow: "hidden",
        paddingTop: theme.spacing(3),
    },
    gridRoot: {
        height: "100%",
        flexWrap: "unset",
    },
    songscontainer: {
        overflow: "hidden",
        flex: "1 1 auto",
    },
    songspaper: {
        padding: theme.spacing(3),
        height: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
    },
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
    noplaylist: {
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    dialog: {
        [theme.breakpoints.up("sm")]: {
            width: "34rem",
        },
    },
    dialogcontent: {
        height: "23rem",
    },
    dropzone: {
        height: "6rem",
    },
}));

const Guest = observer(() => {
    const {
        applicationStore: { popup },
        spotifyStore: { songs },
    } = useStores();

    const classes = useStyles();

    return (
        <>
            {popup === "addMemory" && <AddMemoryDialog />}
            {popup === "addSong" && <AddSongDialog />}
            <Container className={classes.container}>
                <Box className={classes.box}>
                    <Grid
                        container
                        spacing={2}
                        direction="column"
                        className={classes.gridRoot}
                    >
                        <Grid item xs={12} className={classes.songscontainer}>
                            <Paper className={classes.songspaper}>
                                {songs?.length ? <Songs /> : <NoPlaylist />}
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </>
    );
});

export default Guest;

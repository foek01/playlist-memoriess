import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { makeStyles } from "@material-ui/core/styles";
import {
    Container,
    Typography,
    Grid,
    Box,
    Paper,
    Tabs,
    Tab,
    Button,
} from "@material-ui/core";

import { useStores } from "../../stores";
import MediaControlCard from "./MediaControlCard";
import Playlists from "./Playlists";
import Memories from "./Memories";
import Songs from "./Songs";
import AddSongDialog from "../shared/AddSongDialog";

const useStyles = makeStyles((theme) => ({
    container: { flex: "1 1 auto", overflow: "hidden" },
    box: {
        height: "100%",
        overflow: "hidden",
        paddingTop: theme.spacing(3),
    },
    songspaper: {
        padding: theme.spacing(3),
        height: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
    },
    gridRoot: {
        height: "100%",
        flexWrap: "unset",
    },
    flexshrink: {
        flex: "0 0 auto",
    },
    playlistscontainer: {
        overflow: "hidden",
        flex: "1 1 auto",
    },
    songsBanner: {
        display: "flex",
        flex: "0 0 auto",
        alignItems: "center",
        justifyContent: "space-between",
    },
    tabs: {
        flex: "0 0 auto",
    },
}));

const SongsAndMemories = observer(() => {
    const {
        applicationStore: { openAddSongPopup },
        spotifyStore: { playlist },
    } = useStores();

    const classes = useStyles();
    const [currentTab, setCurrentTab] = useState(0);

    return (
        <Paper className={classes.songspaper}>
            <div className={classes.songsBanner}>
                <Typography component="h5" variant="h5">
                    {`${playlist?.title || ""}`}
                </Typography>
                <Button color="primary" onClick={openAddSongPopup}>
                    Add a song
                </Button>
            </div>
            <Tabs
                className={classes.tabs}
                value={currentTab}
                onChange={(_, tab) => setCurrentTab(tab)}
                aria-label="tabs"
                variant="fullWidth"
            >
                <Tab label="Play or queue songs" id="songs" />
                <Tab label="Memories" id="memories" />
            </Tabs>
            {currentTab === 0 && (
                <Songs onSelectSong={() => setCurrentTab(1)} />
            )}
            {currentTab === 1 && <Memories />}
        </Paper>
    );
});

const Host = observer(() => {
    const {
        applicationStore: { popup },
        spotifyStore: { playlist_id },
    } = useStores();

    const classes = useStyles();

    return (
        <>
            {popup === "addSong" && <AddSongDialog />}
            <Container className={classes.container}>
                <Box className={classes.box}>
                    <Grid
                        container
                        spacing={2}
                        direction="column"
                        className={classes.gridRoot}
                    >
                        <Grid item xs={12} className={classes.flexshrink}>
                            <MediaControlCard />
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            className={classes.playlistscontainer}
                        >
                            {playlist_id ? <SongsAndMemories /> : <Playlists />}
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </>
    );
});

export default Host;

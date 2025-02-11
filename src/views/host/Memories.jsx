import React from "react";
import { observer } from "mobx-react-lite";
import { makeStyles } from "@material-ui/core/styles";
import {
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    Typography,
    CardMedia,
    Grid,
    Avatar,
    Button,
    Chip,
} from "@material-ui/core";

import { useStores } from "../../stores";

const useStyles = makeStyles((theme) => ({
    card: {
        background: "#f0f0f0",
    },
    memories: {
        marginTop: ".5rem",
        flex: "1 1 auto",
    },
    image: {
        height: "10rem",
    },
    selectedSong: { marginTop: ".5rem" },
    selectedSongText: { marginRight: ".5rem" },
}));

const Memories = observer(() => {
    const {
        applicationStore: {
            memories,
            deleteMemory,
            selectedSong,
            setSelectedSong,
        },
        spotifyStore: { current_song },
    } = useStores();

    const classes = useStyles();

    const song_memories = memories.filter(
        (memory) => memory.song_id === (selectedSong?.id || current_song?.id)
    );

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                flex: "1 1 auto",
                overflowY: "auto",
                overflowX: "hidden",
            }}
        >
            <div style={{ flex: "0 0 auto" }}>
                {selectedSong ? (
                    <Grid container className={classes.selectedSong}>
                        <Typography
                            variant="h5"
                            className={classes.selectedSongText}
                        >
                            Memories for selected song:{" "}
                        </Typography>
                        <Chip
                            color="secondary"
                            label={selectedSong?.title || "Selected song"}
                            avatar={<Avatar>S</Avatar>}
                            onDelete={() => {
                                setSelectedSong();
                            }}
                        />
                    </Grid>
                ) : (
                    <Typography
                        variant="h5"
                        className={classes.selectedSong}
                    >{`Memories for current song: ${
                        current_song?.title || "-"
                    }`}</Typography>
                )}
            </div>
            <Grid container spacing={2} className={classes.memories}>
                {song_memories.map((memory, index) => (
                    <Grid key={memory?.id || index} item xs={4}>
                        <Card className={classes.card}>
                            <CardActionArea>
                                <CardMedia
                                    className={classes.image}
                                    square
                                    image={memory?.downloadUrl || ""}
                                    title="Memory"
                                />
                                <CardContent>
                                    <Typography
                                        gutterBottom
                                        variant="h5"
                                        component="h2"
                                    >
                                        {memory?.user || "-"}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        component="p"
                                    >
                                        {memory?.text || "-"}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                            <CardActions>
                                <Button
                                    size="small"
                                    color="primary"
                                    onClick={() => deleteMemory(memory?.pk)}
                                >
                                    Remove
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
});

export default Memories;

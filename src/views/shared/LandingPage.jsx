import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Button } from "@material-ui/core";
import { Grid, TextField } from "@material-ui/core";

import { useStores } from "../../stores";
import { useScreenSize } from "../../hooks/screensize";

const useStyles = makeStyles((theme) => ({
    dialog: {
        [theme.breakpoints.up("sm")]: {
            width: "34rem",
            height: "15rem",
        },
    },
}));

const Initial = ({ onCreate, onJoin }) => {
    return (
        <>
            <DialogTitle>Playlist Memories</DialogTitle>
            <DialogContent>
                Share the memories you've made with a song from your favorite
                playlist!
            </DialogContent>
            <DialogActions>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Button
                            fullWidth
                            size={"medium"}
                            color={"primary"}
                            variant={"contained"}
                            onClick={onCreate}
                        >
                            Create room
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            fullWidth
                            size={"medium"}
                            color={"primary"}
                            variant={"contained"}
                            onClick={onJoin}
                        >
                            Join room
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </>
    );
};

const Create = ({ onCreate, onGoBack }) => {
    const [name, setName] = useState("");
    return (
        <>
            <DialogTitle>Create room</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    variant="outlined"
                    size={"small"}
                    label={"Room name"}
                    onChange={(e) => {
                        setName(e.target.value);
                    }}
                    value={name}
                />
            </DialogContent>
            <DialogActions>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Button
                            fullWidth
                            size={"medium"}
                            color={"secondary"}
                            variant={"contained"}
                            onClick={onGoBack}
                        >
                            Go back
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            fullWidth
                            size={"medium"}
                            color={"primary"}
                            variant={"contained"}
                            disabled={!name}
                            onClick={() => {
                                onCreate(name);
                            }}
                        >
                            Create room
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </>
    );
};

const Join = ({ onJoin, onGoBack }) => {
    const [user, setUser] = useState("");
    const [code, setCode] = useState("");
    return (
        <>
            <DialogTitle>Join room</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            size={"small"}
                            label={"Username"}
                            onChange={(e) => {
                                setUser(e.target.value);
                            }}
                            value={user}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            size={"small"}
                            label={"Room code"}
                            onChange={(e) => {
                                setCode(e.target.value);
                            }}
                            value={code}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Button
                            fullWidth
                            size={"medium"}
                            color={"secondary"}
                            variant={"contained"}
                            onClick={onGoBack}
                        >
                            Go back
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            fullWidth
                            size={"medium"}
                            color={"primary"}
                            variant={"contained"}
                            disabled={!user || code?.length !== 5}
                            onClick={() => {
                                onJoin(user, code);
                            }}
                        >
                            Join room
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </>
    );
};

const LandingPage = observer(() => {
    const {
        applicationStore: { generateRoom, joinRoom },
    } = useStores();

    const classes = useStyles();
    const screensize = useScreenSize();
    const [stage, setStage] = useState("initial");

    return (
        <Dialog
            onClose={() => {}}
            open
            fullScreen={screensize === "mobile"}
            classes={{ paper: classes.dialog }}
        >
            {stage === "initial" && (
                <Initial
                    onCreate={() => setStage("create")}
                    onJoin={() => setStage("join")}
                />
            )}
            {stage === "create" && (
                <Create
                    onCreate={(name) => generateRoom(name)}
                    onGoBack={() => setStage("initial")}
                />
            )}
            {stage === "join" && (
                <Join
                    onJoin={(user, code) => joinRoom(user, code)}
                    onGoBack={() => setStage("initial")}
                />
            )}
        </Dialog>
    );
});

export default LandingPage;

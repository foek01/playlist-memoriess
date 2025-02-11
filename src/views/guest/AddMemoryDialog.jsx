import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
    Grid,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Button,
    Dialog,
} from "@material-ui/core";
import { observer } from "mobx-react-lite";
import { DropzoneArea } from "material-ui-dropzone";

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
    },
}));

const AddMemoryDialog = observer(() => {
    const {
        applicationStore: { selectedSong, closeAddMemoryPopup, addMemory },
    } = useStores();

    const classes = useStyles();
    const screensize = useScreenSize();

    const [memory, setMemory] = useState({});

    const handleFiles = async (files) => {
        const [file] = files;
        if (!file) return;
        setMemory({ ...memory, file });
    };

    return (
        <Dialog
            onClose={() => {}}
            open
            fullScreen={screensize === "mobile"}
            classes={{ paper: classes.dialog }}
        >
            <DialogTitle>
                Add memory to song: {selectedSong?.title || ""}
            </DialogTitle>
            <DialogContent className={classes.dialogcontent}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            multiline
                            rows={7}
                            label={"Memory"}
                            onChange={(e) => {
                                setMemory({
                                    ...memory,
                                    text: `${e.target.value}`.substr(0, 300),
                                });
                            }}
                            value={memory?.text || ""}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <DropzoneArea
                            dropzoneClass="dropzone"
                            onChange={handleFiles}
                            filesLimit={1}
                            acceptedFiles={["image/*"]}
                            dropzoneText="Upload an image"
                            showAlerts={false}
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
                            onClick={closeAddMemoryPopup}
                        >
                            Cancel
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            fullWidth
                            disabled={
                                !memory?.file || memory?.text?.length < 10
                            }
                            size={"medium"}
                            color={"primary"}
                            variant={"contained"}
                            onClick={() => {
                                addMemory(memory);
                                closeAddMemoryPopup();
                            }}
                        >
                            Send
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Dialog>
    );
});

export default AddMemoryDialog;

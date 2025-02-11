import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    noplaylist: {
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
}));

const NoPlaylist = () => {
    const classes = useStyles();

    return (
        <div className={classes.noplaylist}>
            <Typography variant="subtitle1">
                The host is still choosing a playlist
            </Typography>
        </div>
    );
};

export default NoPlaylist;

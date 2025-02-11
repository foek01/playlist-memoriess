import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Menu, MenuItem, Chip } from "@material-ui/core";
import { AccountCircle, Room } from "@material-ui/icons";

import { useStores } from "../../stores";

const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
    },
    appbar: {
        flex: "0 0 auto",
    },
    chip: {
        marginRight: theme.spacing(1),
    },
}));

const Navbar = observer(() => {
    const {
        applicationStore: { nav, username, leaveRoom, closeRoom, room, guests },
    } = useStores();

    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);

    const copyRoomCode = () => {
        navigator.clipboard.writeText(room?.code);
    };

    return (
        <AppBar position="static" className={classes.appbar}>
            <Toolbar>
                <Chip
                    icon={<Room />}
                    label={`${room?.name}`}
                    className={classes.chip}
                />
                {nav === "guest" && (
                    <Chip
                        icon={<AccountCircle />}
                        label={`${username}`}
                        className={classes.chip}
                    />
                )}
                {nav === "host" && (
                    <Chip
                        icon={<AccountCircle />}
                        label={`${guests}`}
                        className={classes.chip}
                    />
                )}
                <div className={classes.grow} />
                {room && (
                    <>
                        <Button
                            color="inherit"
                            aria-controls="simple-menu"
                            aria-haspopup="true"
                            onClick={(event) =>
                                setAnchorEl(event.currentTarget)
                            }
                        >
                            Code: {room.code}
                        </Button>
                        <Menu
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={() => setAnchorEl(null)}
                        >
                            {nav === "host" && (
                                <MenuItem onClick={copyRoomCode}>
                                    Copy room code
                                </MenuItem>
                            )}
                            <MenuItem
                                onClick={
                                    nav === "guest" ? leaveRoom : closeRoom
                                }
                            >
                                {nav === "guest" ? "Leave" : "Close"} room
                            </MenuItem>
                        </Menu>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
});

export default Navbar;

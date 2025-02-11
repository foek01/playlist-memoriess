import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { observer } from "mobx-react-lite";

import serviceContext from "../utils/context";

const Nav = observer(() => {
    const {
        playerService: { goBack, nav, playlist },
    } = useContext(serviceContext);

    return (
        <div className="nav">
            {nav === "connect" && "Connect with Spotify"}
            {nav === "playlists" && "Playlists"}
            {nav === "songs" && (
                <>
                    <FontAwesomeIcon icon={faArrowLeft} onClick={goBack} />
                    <img src={playlist?.img} alt="" />
                    {playlist?.title}
                </>
            )}
        </div>
    );
});

export default Nav;

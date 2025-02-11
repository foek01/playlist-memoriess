import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Helmet } from "react-helmet";

import { useStores } from "../../stores";

import LandingPage from "./LandingPage";
import Navbar from "./Navbar";
import Host from "../host";
import Guest from "../guest";

const App = observer(() => {
    const {
        applicationStore: { initialize, nav },
    } = useStores();

    useEffect(() => {
        initialize();
    }, [initialize]);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                overflow: "hidden",
            }}
        >
            <Helmet>
                <meta charSet="utf-8" />
                <meta name="theme-color" content="#237fb1" />

                <title>Playlist Memories</title>
            </Helmet>
            {nav !== "landing_page" && <Navbar />}
            {nav === "landing_page" && <LandingPage />}
            {nav === "host" && <Host />}
            {nav === "guest" && <Guest />}
        </div>
    );
});

export default App;

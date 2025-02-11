import { createContext } from "react";

import PlayerService from "../stores/player";
import SpotifyApi from "../apis/spotify";
import BackendApi from "../apis/backend";

const context = createContext({
    playerService: new PlayerService(new SpotifyApi(), new BackendApi()),
});

export default context;

import { createContext, useContext } from "react";

import { ApplicationStore } from "../stores/application";
import { SpotifyStore } from "../stores/spotify";
// import PlayerService from "../stores/player";
import SpotifyApi from "../apis/spotify";
import BackendApi from "../apis/backend";

const api = new BackendApi();
const spotify_api = new SpotifyApi();
const spotifyStore = new SpotifyStore(api, spotify_api);
const applicationStore = new ApplicationStore(api, spotifyStore);
const context = createContext({ applicationStore, spotifyStore });

export const useStores = () => useContext(context);

import * as uuid from "uuid";
import { observable, action, computed, decorate } from "mobx";

class PlayerService {
    constructor(spotify_api, backend_api) {
        this.spotify_api = spotify_api;
        this.backend_api = backend_api;

        // initialize data
        this.token = null;
        this.player = null;
        this.device_id = null;
        this.initialized = null;
        this.player_state = null;

        // spotify data
        this.playlists = [];
        this.playlist_id = null;
        this.songs = [];
        this.song_id = null;

        // memory data
        this.memories = [];
    }

    initialize = async () => {
        const search = window.location.href;
        if (search.includes("?code")) {
            const code = search.split("?code=")[1];
            window.localStorage.setItem("code", code);
            window.location = window.location.origin;
            return;
        }
        const code = window.localStorage.getItem("code");
        if (code) {
            try {
                const access_token = await this.backend_api.authorize({ code });
                this.token = access_token;
                this.initialized = true;
                this.preparePlayer();
                this.getPlaylists();
            } catch (e) {
                console.error(e, "Failed to authorize backend!");
            } finally {
                window.localStorage.setItem("code", null);
            }
        }
    };

    connect = async () => {
        const redirect = await this.backend_api.oauth();
        window.location = redirect;
    };

    preparePlayer = () =>
        new Promise((resolve, reject) => {
            if (!window.onSpotifyWebPlaybackSDKReady) {
                window.onSpotifyWebPlaybackSDKReady = this.startPlayer;
            } else {
                this.startPlayer();
            }

            const scriptTag = document.getElementById("spotify-player");

            if (!scriptTag) {
                const script = document.createElement("script");

                script.id = "spotify-player";
                script.type = "text/javascript";
                script.async = false;
                script.defer = true;
                script.src = "https://sdk.scdn.co/spotify-player.js";
                script.onload = () => resolve();
                script.onerror = (error) =>
                    reject(new Error(`loadScript: ${error.message}`));

                document.head.appendChild(script);
            } else {
                resolve();
            }
        });

    startPlayer = () => {
        this.player = new window.Spotify.Player({
            getOAuthToken: (cb) => {
                cb(this.token);
            },
            name: "Playlist Memories",
            volume: 1,
        });

        this.player.addListener("ready", (e) => {
            this.device_id = e.device_id;
        });
        this.player.addListener("not_ready", (e) => {
            console.log("not_ready", e);
        });
        this.player.addListener("player_state_changed", (player_state) => {
            this.player_state = player_state;
            console.log("👳‍♀️", player_state);
        });
        this.player.addListener("initialization_error", (error) =>
            console.log("initialization_error", error.message)
        );
        this.player.addListener("authentication_error", (error) =>
            console.log("authentication_error", error.message)
        );
        this.player.addListener("account_error", (error) =>
            console.log("account_error", error.message)
        );
        this.player.addListener("playback_error", (error) =>
            console.log("playback_error", error.message)
        );

        this.player.connect();
    };

    getPlaylists = async () => {
        try {
            this.playlists = await this.backend_api.getPlaylists();
        } catch (e) {
            console.error(e, "Failed to get playlists!");
        }
    };

    setPlaylist = (playlist_id) => {
        this.playlist_id = playlist_id;
        if (playlist_id) this.getSongs();
    };

    getSongs = async () => {
        this.songs = [];
        try {
            this.songs = await this.backend_api.getSongs({
                playlist_id: this.playlist_id,
            });
        } catch (e) {
            console.error(e, "Failed to get songs!");
        }
    };

    setSong = async (song_id) => {
        if (this.song_id === song_id) return;
        this.song_id = song_id;
        this.emptyMemory();
        this.getMemories();
    };

    playSong = async (uri) => {
        try {
            await this.spotify_api.playSong({
                device_id: this.device_id,
                token: this.token,
                uri,
            });
        } catch (e) {
            console.error(e, "Failed to play song!");
        }
    };

    queueSong = async (uri) => {
        try {
            await this.spotify_api.queueSong({
                device_id: this.device_id,
                token: this.token,
                uri,
            });
        } catch (e) {
            console.error(e, "Failed to queue song!");
        }
    };

    setText = (text, id) => {
        const index = this.memories?.findIndex((memory) => memory.id === id);

        if (index > -1) {
            this.memories[index].text = text;
        }

        this.saveMemories();
    };

    setImage = (image, id) => {
        const index = this.memories?.findIndex((memory) => memory.id === id);

        if (index > -1) {
            this.memories[index].image = image;
        }

        this.saveMemories();
    };

    emptyMemory = () => {
        this.memories = [];
    };

    newMemory = () => {
        this.memories?.unshift({ id: uuid.v4(), text: "", image: null });
    };

    getMemories = async () => {
        const test = await this.backend_api.getMemories({
            song_id: this.song_id,
        });
        console.log("👩‍✈️", test);
        const raw_memories = window.localStorage.getItem(this.song_id);
        if (raw_memories) {
            const memories = JSON.parse(raw_memories);
            this.memories = memories;
        }
    };

    saveMemories = async () => {
        if (this.songs_id) return;
        for (const memory of this.memories.map((m) => ({
            pk: m.id,
            image: m.image,
            text: m.text,
            user: "Lucas",
        }))) {
            await this.backend_api.saveMemory({
                memory,
                song_id: this.song_id,
            });
        }
        window.localStorage.setItem(
            this.song_id,
            JSON.stringify(this.memories)
        );
    };

    goBack = () => {
        this.playlist_id = null;
    };

    togglePlayback = async () => {
        try {
            await this.spotify_api.togglePlayback({
                playback: this.paused ? "play" : "pause",
                device_id: this.device_id,
                token: this.token,
            });
        } catch (e) {
            console.error(e, "Failed to toggle playback!");
        }
    };

    nextSong = async () => {
        try {
            await this.spotify_api.next({
                device_id: this.device_id,
                token: this.token,
            });
        } catch (e) {
            console.error(e, "Failed to toggle playback!");
        }
    };

    get nav() {
        if (!this.initialized) return "connect";
        if (!this.playlist_id) return "playlists";
        return "songs";
    }

    get playlist() {
        return this.playlists?.find((e) => e.id === this.playlist_id);
    }

    get paused() {
        return this.player_state?.paused ?? true;
    }

    get current_song() {
        const current_track = this.player_state?.track_window?.current_track;
        return {
            img: current_track?.album?.images?.[0]?.url,
            artists: current_track?.artists?.map((e) => e?.name),
            title: current_track?.name,
        };
    }

    get memory_song() {
        return this.songs?.find((song) => song.id === this.song_id);
    }
}

decorate(PlayerService, {
    token: observable,
    player: observable,
    device_id: observable,
    initialized: observable,
    player_state: observable,
    playlists: observable,
    playlist_id: observable,
    songs: observable,
    song_id: observable,
    memories: observable,
    initialize: action,
    startPlayer: action,
    getPlaylists: action,
    setPlaylist: action,
    getSongs: action,
    setSong: action,
    setText: action,
    setImage: action,
    emptyMemory: action,
    getMemories: action,
    goBack: action,
    nav: computed,
    playlist: computed,
    paused: computed,
    current_song: computed,
    memory_song: computed,
});

export default PlayerService;

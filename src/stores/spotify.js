import { observable, action, computed, decorate } from "mobx";

export class SpotifyStore {
    constructor(api, spotify_api) {
        this.api = api;
        this.spotify_api = spotify_api;

        // initialize data
        this.token = null;
        this.room_code = null;
        this.room_name = null;
        this.player = null;
        this.device_id = null;
        this.player_state = null;

        // spotify data
        this.playlists = [];
        this.playlist_id = null;
        this.songs = [];
        this.song_id = null;

        this.socket = null;
        this.hostOrGuest = null;
    }

    initialize = async (room, hostOrGuest, socket) => {
        this.token = room.access_token;
        this.room_code = room.code;
        this.room_name = room.name;
        this.hostOrGuest = hostOrGuest;
        if (this.isHost) {
            this.socket = socket;
            this.preparePlayer();
            this.getPlaylists();
        }

        if (this.isGuest && room.playlist_id) {
            this.setPlaylist(room.playlist_id);
        }
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
            this.playlists = await this.api.getPlaylists({
                room_code: this.room_code,
            });
        } catch (e) {
            console.error(e, "Failed to get playlists!");
        }
    };

    setPlaylist = async (playlist_id) => {
        if (this.isHost) {
            const success = await this.api.setPlaylist({
                room_code: this.room_code,
                playlist_id,
            });
            if (!success) {
                console.log("👲", "Failed to set playlist in room!!");
                return;
            }

            this.sendMessage("PLAYLIST_SET", { playlist_id });
        }

        this.playlist_id = playlist_id;
        if (playlist_id) this.getSongs();
    };

    createPlaylist = async () => {
        if (this.isGuest) {
            throw new Error(
                "Trying to create playlist as guest, this should not be possible!"
            );
        }
        const playlist_id = await this.api.createPlaylist({
            room_code: this.room_code,
            name: this.room_name,
            description: "A playlist created with Playlist Memories",
        });
        if (!playlist_id) {
            console.log("👩‍🎤", "Failed to create playlist!");
            return;
        }
        await this.getPlaylists();
        this.setPlaylist(playlist_id);
    };

    search = async (query) =>
        this.api.search({
            query,
            room_code: this.room_code,
        });

    getSongs = async () => {
        this.songs = [];
        try {
            this.songs = await this.api.getSongs({
                room_code: this.room_code,
            });
        } catch (e) {
            console.error(e, "Failed to get songs!");
        }
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

    setCurrentSong = (song_id) => {
        this.player_state = {
            track_window: { current_track: { id: song_id } },
        };
    };

    sendMessage(action, args) {
        this.socket.send(
            JSON.stringify({
                action,
                from: this.hostOrGuest,
                ...args,
            })
        );
    }

    get paused() {
        return this.player_state?.paused ?? true;
    }

    get current_song() {
        const current_track = this.songs.find(
            (song) =>
                song.id === this.player_state?.track_window?.current_track?.id
        );
        return current_track;
    }

    get playlist() {
        return this.playlists?.find(
            (playlist) => playlist?.id === this.playlist_id
        );
    }

    get isHost() {
        return this.hostOrGuest === "host";
    }

    get isGuest() {
        return this.hostOrGuest === "guest";
    }
}

decorate(SpotifyStore, {
    token: observable,
    player: observable,
    device_id: observable,
    player_state: observable,
    playlists: observable,
    playlist_id: observable,
    room_code: observable,
    room_name: observable,
    songs: observable,
    song_id: observable,
    initialize: action,
    startPlayer: action,
    getPlaylists: action,
    setPlaylist: action,
    getSongs: action,
    setSong: action,
    setCurrentSong: action,
    goBack: action,
    paused: computed,
    current_song: computed,
    isHost: computed,
    isGuest: computed,
});

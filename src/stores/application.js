import { observable, action, decorate, computed } from "mobx";
import autoBind from "auto-bind";

const generateRoomCode = () => Math.floor(Math.random() * 90000) + 10000;

const getSpotifyAuthCode = () => {
    const search = window.location.href;
    if (!search.includes("?code")) return;
    const code = search.split("?code=")[1];
    window.history.replaceState({}, "", window.location.origin);
    return code;
};

export class ApplicationStore {
    api = null;
    spotifyStore = null;
    hostOrGuest = null;
    room = null;
    username = null;
    memories = [];
    socket = null;
    guests = 0;
    songIdForMemory = null;
    popup = null;
    intervalId = null;

    constructor(api, spotifyStore) {
        autoBind(this);
        this.api = api;
        this.spotifyStore = spotifyStore;
    }

    initialize() {
        const authCode = getSpotifyAuthCode();
        if (authCode) {
            this.createRoom(authCode);
        }
    }

    initializeSocket() {
        return new Promise((resolve) => {
            this.socket = this.api.getSocket();

            this.socket.onopen = () => {
                this.sendMessage("SET_CLIENT_META", {
                    room: this.room.code,
                    hostOrGuest: this.hostOrGuest,
                });
                resolve();
            };
            this.socket.onmessage = (e) => {
                const message = JSON.parse(e.data);
                console.log("Received: '" + e.data + "'");
                this.handleMessage(message.action, message);
            };

            this.spotifyStore.initialize(
                this.room,
                this.hostOrGuest,
                this.socket
            );

            this.intervalId = setInterval(() => {
                if (this.socket.readyState === WebSocket.CLOSED) {
                    this.initializeSocket();
                }
            }, 30000);
        });
    }

    handleMessage(action, message_data) {
        if (action === "PING") {
            this.sendMessage("PONG");
            return;
        }
        if (action === "NEW_SONG") {
            this.spotifyStore.getSongs();
            return;
        }
        if (this.isHost) {
            this.handleMessageFromGuest(action, message_data);
        }
        if (this.isGuest) {
            this.handleMessageFromHost(action, message_data);
        }
    }

    handleMessageFromGuest(action, message_data) {
        if (action === "UPDATE_GUEST_COUNT") {
            const { count } = message_data;
            this.guests = Number(count);
        }
        if (action === "NEW_MEMORY") {
            this.getMemories();
        }
    }

    handleMessageFromHost(action, message_data) {
        if (action === "ROOM_CLOSED") {
            window.location.reload();
        }
        if (action === "PLAYLIST_SET") {
            const { playlist_id } = message_data;
            this.spotifyStore.setPlaylist(playlist_id);
        }
    }

    async sendMessage(action, args = {}) {
        if (this.socket.readyState === WebSocket.CLOSED) {
            await this.initializeSocket();
        }

        this.socket.send(
            JSON.stringify({
                action,
                from: this.hostOrGuest,
                ...args,
            })
        );
    }

    get nav() {
        if (!this.hostOrGuest) return "landing_page";
        if (this.hostOrGuest === "host") return "host";
        return "guest";
    }

    leaveRoom() {
        clearInterval(this.intervalId);
        this.intervalId = null;
        this.room = null;
        this.username = null;
        this.hostOrGuest = null;
        this.socket?.close();
        this.socket = null;
    }

    async closeRoom() {
        window.location.reload();
    }

    async createRoom(code) {
        let room;
        const room_code = window.localStorage.getItem("code");
        const room_name = window.localStorage.getItem("name");
        try {
            room = await this.api.createRoom({
                code,
                room: { code: room_code, name: room_name },
            });
        } catch (e) {
            console.log("🧙‍♂️", e);
        }

        window.localStorage.removeItem("code");
        window.localStorage.removeItem("name");
        if (!room) {
            this.room = null;
            this.hostOrGuest = null;
            return;
        }

        this.room = room;
        this.hostOrGuest = "host";

        this.initializeSocket();
    }

    async generateRoom(name) {
        const code = generateRoomCode();
        window.localStorage.setItem("name", name);
        window.localStorage.setItem("code", code);
        const redirect = await this.api.oauth();
        window.location = redirect;
    }

    async joinRoom(username, code) {
        let room;
        room = await this.api.getRoom({
            code,
        });
        if (!room) return;

        this.room = room;
        this.username = username;
        this.hostOrGuest = "guest";

        this.initializeSocket();
    }

    openAddMemoryPopup(songId) {
        this.songIdForMemory = songId;
        this.popup = "addMemory";
    }

    openAddSongPopup() {
        this.popup = "addSong";
    }

    closeAddMemoryPopup() {
        this.popup = null;
        this.songIdForMemory = null;
    }

    closeAddSongPopup() {
        this.popup = null;
    }

    async addSong(uri) {
        await this.api.addSong({ room_code: this.room.code, uri });
        this.spotifyStore.getSongs();
        this.sendMessage("NEW_SONG");
    }

    async addMemory({ text, file }) {
        try {
            const upload_url = await this.api.saveMemory({
                room_code: this.room.code,
                song_id: this.songIdForMemory,
                user: this.username,
                text,
                filename: file.name,
            });
            await this.api.saveMemoryImage({
                upload_url,
                file,
            });
            this.sendMessage("NEW_MEMORY");
        } catch (e) {
            console.log("🧙‍♂️", e);
        }
    }

    async deleteMemory(memory_id) {
        try {
            await this.api.deleteMemory({
                room_code: this.room.code,
                memory_id,
            });
            this.memories = this.memories.filter(
                (memory) => memory?.pk !== memory_id
            );
        } catch (e) {
            console.log("🧙‍♂️", e);
        }
    }

    async getMemories() {
        try {
            this.memories = await this.api.getMemories({
                room_code: this.room.code,
            });
            console.log(JSON.parse(JSON.stringify(this.memories)));
        } catch (e) {
            console.log("🧙‍♂️", e);
        }
    }

    get isHost() {
        return this.hostOrGuest === "host";
    }

    get isGuest() {
        return this.hostOrGuest === "guest";
    }

    get selectedSong() {
        const current_track = this.spotifyStore.songs.find(
            (song) => song.id === this.songIdForMemory
        );
        return current_track;
    }

    setSelectedSong(song_id) {
        this.songIdForMemory = song_id;
    }
}

decorate(ApplicationStore, {
    hostOrGuest: observable,
    username: observable,
    room: observable,
    guests: observable,
    memories: observable,
    songIdForMemory: observable,
    popup: observable,
    initialize: action,
    createRoom: action,
    leaveRoom: action,
    openAddMemoryPopup: action,
    openAddSongPopup: action,
    closeAddMemoryPopup: action,
    closeAddSongPopup: action,
    deleteMemory: action,
    setSelectedSong: action,
    nav: computed,
    isHost: computed,
    isGuest: computed,
    selectedSong: computed,
});

import superagent from "superagent";
import env from "react-dotenv";

class BackendApi {
    constructor() {
        this.base =
            env.NODE_ENV === "development"
                ? `${env.PROTOCOL_DEV}://${env.BACKEND_BASE_DEV}`
                : `${env.PROTOCOL_PRD}://${env.BACKEND_BASE_PRD}`;
    }

    getSocket = () =>
        new WebSocket(
            `${env.NODE_ENV === "development" ? "ws" : "wss"}://${
                env.NODE_ENV === "development"
                    ? env.BACKEND_BASE_DEV
                    : env.BACKEND_BASE_PRD
            }`
        );

    oauth = async () => {
        try {
            const response = await superagent.get(`${this.base}/authorize`);
            return response?.text;
        } catch (e) {
            console.log("👑", e);
        }
    };

    getRoom = async ({ code }) => {
        try {
            const response = await superagent.get(`${this.base}/room/${code}`);
            return response?.body?.room;
        } catch (e) {
            console.log("🦸‍♂️", e);
            return false;
        }
    };

    createRoom = async ({ room, code }) => {
        try {
            const response = await superagent
                .post(`${this.base}/room`)
                .send({ room, code });
            return response?.body?.room;
        } catch (e) {
            console.log("👨‍👨‍👦‍👦", e);
        }
    };

    getPlaylists = async ({ room_code }) => {
        try {
            const response = await superagent.get(
                `${this.base}/room/${room_code}/playlists`
            );
            return response.body || [];
        } catch (e) {
            console.log("👁", e);
        }
    };

    setPlaylist = async ({ room_code, playlist_id }) => {
        try {
            await superagent
                .put(`${this.base}/room/${room_code}/playlist`)
                .send({ playlist_id });
            return true;
        } catch (e) {
            console.log("👁", e);
            return false;
        }
    };

    createPlaylist = async ({ room_code, name, description }) => {
        try {
            const response = await superagent
                .post(`${this.base}/room/${room_code}/playlist`)
                .send({ name, description });

            return response?.text;
        } catch (e) {
            console.log("😐", e);
            return false;
        }
    };

    getSongs = async ({ room_code }) => {
        try {
            const response = await superagent.get(
                `${this.base}/room/${room_code}/songs`
            );
            return response?.body || [];
        } catch (e) {
            console.log("👂", e);
        }
    };

    addSong = async ({ room_code, uri }) => {
        await superagent.put(`${this.base}/room/${room_code}/songs/${uri}`);
    };

    search = async ({ room_code, query }) => {
        try {
            const response = await superagent.get(
                `${this.base}/room/${room_code}/search/${query}`
            );
            return response?.body || [];
        } catch (e) {
            console.log("👨‍👧‍👦", e);
        }
    };

    getMemories = async ({ room_code }) => {
        try {
            const response = await superagent.get(
                `${this.base}/room/${room_code}/memories`
            );
            return response?.body || [];
        } catch (e) {
            console.log("🙏", e);
        }
    };

    saveMemory = async ({ room_code, song_id, ...data }) => {
        try {
            const response = await superagent
                .put(`${this.base}/room/${room_code}/memories`)
                .send({ ...data, song_id });
            return response?.body?.upload_url;
        } catch (e) {
            console.log("🙏", e);
        }
    };

    saveMemoryImage = async ({ file, upload_url }) => {
        try {
            await superagent
                .put(upload_url)
                .set("Content-Type", file.type)
                .send(file);
            return true;
        } catch (e) {
            console.log("🙏", e.response);
        }
    };

    deleteMemory = async ({ room_code, memory_id }) => {
        try {
            await superagent.delete(
                `${this.base}/room/${room_code}/memories/${memory_id}`
            );
            return true;
        } catch (e) {
            console.log("🙏", e);
        }
    };
}

export default BackendApi;

import superagent from "superagent";

class SpotifyApi {
    constructor() {
        this.base = `https://api.spotify.com/v1`;
    }

    playSong = async ({ token, device_id, uri }) => {
        await superagent
            .put(`${this.base}/me/player/play`)
            .set({ Authorization: `Bearer ${token}` })
            .query({ device_id })
            .send({ uris: [uri] });
    };

    queueSong = async ({ token, device_id, uri }) => {
        await superagent
            .post(`${this.base}/me/player/queue`)
            .set({ Authorization: `Bearer ${token}` })
            .query({ device_id, uri });
    };

    togglePlayback = async ({ token, device_id, playback }) => {
        await superagent
            .put(`${this.base}/me/player/${playback}`)
            .set({ Authorization: `Bearer ${token}` })
            .query({ device_id });
    };

    next = async ({ token, device_id }) => {
        await superagent
            .post(`${this.base}/me/player/next`)
            .set({ Authorization: `Bearer ${token}` })
            .query({ device_id });
    };
}

export default SpotifyApi;

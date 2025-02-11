const superagent = require("superagent");
const dotenv = require("dotenv");
dotenv.config();

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri =
    process.env.NODE_ENV === "development"
        ? process.env.REDIRECT_DEV
        : process.env.REDIRECT_PRD;

const getBasicAuth = () => {
    return Buffer.from(`${client_id}:${client_secret}`).toString("base64");
};

const getAuthorizationURL = () => {
    if (!redirect_uri) return;

    const scopes =
        "streaming user-read-private user-read-email user-read-playback-state user-modify-playback-state playlist-modify-public";

    return `https://accounts.spotify.com/authorize?response_type=code&client_id=${client_id}&scope=${encodeURIComponent(
        scopes
    )}&redirect_uri=${redirect_uri}`;
};

const postOAuthToken = async ({ code, refresh_token }) => {
    try {
        const response = await superagent
            .post("https://accounts.spotify.com/api/token")
            .set("Authorization", `basic ${getBasicAuth()}`)
            .set("Content-Type", "application/x-www-form-urlencoded")
            .send({
                grant_type: code ? "authorization_code" : "refresh_token",
                refresh_token: code ? null : refresh_token,
                code: refresh_token ? null : code,
                redirect_uri,
            });
        return response.body;
    } catch (e) {
        console.log(e, "Failed to update OAuth token!");
        return null;
    }
};

const getPlaylists = async (access_token) => {
    const response = await superagent
        .get("https://api.spotify.com/v1/me/playlists")
        .auth(access_token, { type: "bearer" });

    return (response?.body?.items || []).map((e) => ({
        id: e.id,
        title: e.name,
        img: e.images?.[0]?.url,
        owner: e.owner?.display_name,
    }));
};

const createPlaylist = async (access_token, { name, description }) => {
    const response = await superagent
        .post("https://api.spotify.com/v1/me/playlists")
        .auth(access_token, { type: "bearer" })
        .send({ name, description });

    return response?.body?.id;
};

const getSongs = async (access_token, playlist_id) => {
    const response = await superagent
        .get(`https://api.spotify.com/v1/playlists/${playlist_id}`)
        .auth(access_token, { type: "bearer" });

    return (response?.body?.tracks?.items || []).map((e) => ({
        id: e.track?.id,
        uri: e.track?.uri,
        title: e.track?.name,
        img: e.track?.album?.images?.[0]?.url,
        artists: (e.track?.artists || []).map((e) => e?.name),
    }));
};

const addSong = async (access_token, { playlist_id, uri }) => {
    await superagent
        .post(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks`)
        .auth(access_token, { type: "bearer" })
        .send({ uris: [uri] });

    return true;
};

const getSong = async (access_token, song_id) => {
    const response = await superagent
        .get(`https://api.spotify.com/v1/tracks/${song_id}`)
        .auth(access_token, { type: "bearer" });

    const track = response?.body;

    if (!track) {
        throw new Error("Could not find song!");
    }

    return {
        id: track?.id,
        uri: track?.uri,
        title: track?.name,
        img: track?.album?.images?.[0]?.url,
        artists: (track?.artists || []).map((e) => e?.name),
    };
};

const search = async (access_token, { query }) => {
    const response = await superagent
        .get(`https://api.spotify.com/v1/search`)
        .auth(access_token, { type: "bearer" })
        .query({ q: query, type: "track", market: "from_token" });

    return (response?.body?.tracks?.items || []).map((e) => ({
        id: e?.id,
        uri: e?.uri,
        title: e?.name,
        img: e?.album?.images?.[0]?.url,
        artists: (e?.artists || []).map((e) => e?.name),
    }));
};

module.exports = {
    getAuthorizationURL,
    postOAuthToken,
    getPlaylists,
    createPlaylist,
    getSongs,
    addSong,
    getSong,
    search,
};

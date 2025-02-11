const uuid = require("uuid");

const spotifyAdapter = require("../adapters/spotify");
const blobStorage = require("../s3");
const store = require("../stores");

const getSpotifyAuthURL = () => {
    return spotifyAdapter.getAuthorizationURL();
};

const getRoom = async (room_code) => {
    const room = await store.getSingle("room", room_code);
    return room ? { ...room, code: room.pk } : null;
};

const deleteRoom = async (room_code) => {
    store.remove("room", room_code);
    const memory_ids = await store.removeMultiple(`room:${room_code}:memory`);
    for (const memory_id of memory_ids) {
        await blobStorage.deleteBlob({ id: memory_id }).catch(() => {});
    }
    return true;
};

const createRoom = async (room, spotify_auth_code) => {
    const existing_room = await store.getSingle("room", room.code);
    if (existing_room) return { ...existing_room, code: existing_room.pk };
    const access_information = await spotifyAdapter.postOAuthToken({
        code: spotify_auth_code,
    });

    if (!access_information?.access_token) {
        throw new Error("Failed to create room!");
    }

    await store.put("room", {
        pk: room.code,
        name: room.name,
        access_token: access_information.access_token,
        access_token_expiration: new Date(
            Date.now() + access_information.expires_in * 1000
        ).toISOString(),
        refresh_token: access_information.refresh_token,
    });

    return { ...access_information, ...room };
};

const getPlaylists = async (room_code) => {
    const room = await store.getSingle("room", room_code);
    return spotifyAdapter.getPlaylists(room.access_token);
};

const createPlaylist = async (room_code, playlist) => {
    const room = await store.getSingle("room", room_code);
    return spotifyAdapter.createPlaylist(room.access_token, playlist);
};

const setPlaylist = async (room_code, playlist_id) => {
    const room = await store.getSingle("room", room_code);
    await store.put("room", { ...room, playlist_id });
};

const getSongs = async (room_code) => {
    const room = await store.getSingle("room", room_code);
    if (!room?.playlist_id) {
        throw new Error("Room does not have a playlist yet!");
    }
    return spotifyAdapter.getSongs(room.access_token, room.playlist_id);
};

const addSong = async (room_code, uri) => {
    const room = await store.getSingle("room", room_code);
    if (!room?.playlist_id) {
        throw new Error("Room does not have a playlist yet!");
    }
    return spotifyAdapter.addSong(room.access_token, {
        playlist_id: room.playlist_id,
        uri,
    });
};

const getSong = async (room_code, song_id) => {
    const room = await store.getSingle("room", room_code);
    if (!room?.playlist_id) {
        throw new Error("Room does not have a playlist yet!");
    }
    return spotifyAdapter.getSong(room.access_token, song_id);
};

const search = async (room_code, query) => {
    const room = await store.getSingle("room", room_code);
    return spotifyAdapter.search(room.access_token, { query });
};

const getMemories = async (room_code) => {
    const memories = await store.getMultiple(`room:${room_code}:memory`);
    for (const memory of memories) {
        memory.downloadUrl = await await blobStorage
            .getSignedUrl({
                id: memory.pk,
                name: memory.filename,
            })
            .catch(() => undefined);
    }

    return memories;
};

const createMemory = async (room_code, memory) => {
    const memory_id = uuid.v4();
    const room = await store.getSingle("room", room_code);
    if (!room) {
        throw new Error("Room does not exist!");
    }
    await store.put(`room:${room_code}:memory`, {
        pk: memory_id,
        ...memory,
    });

    const upload_url = await blobStorage.getSignedUrl({
        action: "putObject",
        id: memory_id,
        name: memory.filename,
    });

    return { upload_url };
};

const removeMemory = async (room_code, memory_id) => {
    await store.remove(`room:${room_code}:memory`, memory_id);
    await blobStorage.deleteBlob({ id: memory_id }).catch(() => {});
};

module.exports = {
    getSpotifyAuthURL,
    getRoom,
    createRoom,
    deleteRoom,
    getPlaylists,
    setPlaylist,
    createPlaylist,
    getSongs,
    addSong,
    getSong,
    search,
    getMemories,
    createMemory,
    removeMemory,
};

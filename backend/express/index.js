const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const http = require("http");

const service = require("../services");
const ws = require("./ws");

const initialize = () => {
    const app = express();
    app.options("*", cors());
    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json({ limit: "5mb" }));

    app.get("/authorize", async (_, response) => {
        const auth_url = service.getSpotifyAuthURL();

        if (!auth_url) {
            response.sendStatus(500);
            return;
        }

        response.send(auth_url);
    });

    app.get("/room/:room_code", async (request, response) => {
        let room;
        try {
            room = await service.getRoom(request.params.room_code);
            if (!room) throw new Error("Room does not exist!");
        } catch (e) {
            console.error("GET /room", e.message);
            response.sendStatus(400);
            return;
        }

        response.send({ room });
    });

    app.post("/room", async (request, response) => {
        let room;
        try {
            room = await service.createRoom(
                request.body.room,
                request.body.code
            );
        } catch (e) {
            console.error("POST /room", e.message);
            response.sendStatus(400);
            return;
        }

        response.send({ room });
    });

    app.get("/room/:room_code/playlists", async (request, response) => {
        try {
            response.send(await service.getPlaylists(request.params.room_code));
        } catch (e) {
            console.error("GET /room/:room_code/playlists", e.message);
            response.sendStatus(400);
            return;
        }
    });

    app.put("/room/:room_code/playlist", async (request, response) => {
        try {
            await service.setPlaylist(
                request.params.room_code,
                request.body.playlist_id
            );
            response.sendStatus(201);
        } catch (e) {
            console.error("PUT /room/:room_code/playlist", e.message);
            response.sendStatus(400);
            return;
        }
    });

    app.post("/room/:room_code/playlist", async (request, response) => {
        try {
            const playlist_id = await service.createPlaylist(
                request.params.room_code,
                request.body
            );
            response.send(playlist_id);
        } catch (e) {
            console.error("POST /room/:room_code/playlist", e.message);
            response.sendStatus(400);
            return;
        }
    });

    app.get("/room/:room_code/songs", async (request, response) => {
        try {
            response.send(await service.getSongs(request.params.room_code));
        } catch (e) {
            console.error("GET /room/:room_code/songs", e.message);
            response.sendStatus(400);
            return;
        }
    });

    app.get("/room/:room_code/songs/:song_id", async (request, response) => {
        try {
            response.send(
                await service.getSong(
                    request.params.room_code,
                    request.params.song_id
                )
            );
        } catch (e) {
            console.error("GET /room/:room_code/songs/:song_id", e.message);
            response.sendStatus(400);
            return;
        }
    });

    app.put("/room/:room_code/songs/:uri", async (request, response) => {
        try {
            response.send(
                await service.addSong(
                    request.params.room_code,
                    request.params.uri
                )
            );
        } catch (e) {
            console.log("✍", e);
            console.error("PUT /room/:room_code/songs/:uri", e.message);
            response.sendStatus(400);
            return;
        }
    });

    app.get("/room/:room_code/search/:query", async (request, response) => {
        try {
            response.send(
                await service.search(
                    request.params.room_code,
                    request.params.query
                )
            );
        } catch (e) {
            console.error("GET /room/:room_code/search/:query", e.message);
            response.sendStatus(400);
            return;
        }
    });

    app.get("/room/:room_code/memories", async (request, response) => {
        try {
            response.send(await service.getMemories(request.params.room_code));
        } catch (e) {
            console.error("GET /room/:room_code/memories", e.message);
            response.sendStatus(400);
            return;
        }
    });

    app.put("/room/:room_code/memories", async (request, response) => {
        try {
            const res = await service.createMemory(
                request.params.room_code,
                request.body
            );
            response.send(res);
        } catch (e) {
            console.error("PUT /room/:room_code/memories", e.message);
            response.sendStatus(400);
            return;
        }
    });

    app.delete(
        "/room/:room_code/memories/:memory_id",
        async (request, response) => {
            try {
                await service.removeMemory(
                    request.params.room_code,
                    request.params.memory_id
                );
                response.sendStatus(200);
            } catch (e) {
                console.error(
                    "DEL /room/:room_code/memories/:memory_id",
                    e.message
                );
                response.sendStatus(400);
                return;
            }
        }
    );

    const server = http.createServer(app);
    ws.initialize(server);

    server.listen(process.env.PORT || 5000, () => {
        console.log(`Server started on port ${server.address().port} :)`);
    });
};

module.exports = {
    initialize,
};

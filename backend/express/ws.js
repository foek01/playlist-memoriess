const WebSocket = require("ws");
const uuid = require("uuid");

const service = require("../services");

let sockets = [];

const getHost = (room) =>
    sockets.find(
        (socket) => socket.hostOrGuest === "host" && socket.room === room
    );

const getGuests = (room) =>
    sockets.filter(
        (socket) => socket.hostOrGuest === "guest" && socket.room === room
    );

const removeSocket = (id) => {
    sockets = sockets.filter((socket) => socket.id !== id);
};

const updateSocket = (id, key, value) => {
    const index = sockets.findIndex((socket) => socket.id === id);
    if (index === -1) return;
    sockets[index][key] = value;
};

const getSocket = (id) => sockets.find((socket) => socket.id === id);

const setClientMeta = ({ hostOrGuest, room }, id) => {
    updateSocket(id, "room", room);
    updateSocket(id, "hostOrGuest", hostOrGuest);

    if (hostOrGuest === "guest") {
        const host = getHost(room);
        if (!host) return;
        const guests = getGuests(room);
        host.ws.send(
            JSON.stringify({
                action: "UPDATE_GUEST_COUNT",
                count: guests.length,
            })
        );
    }
};

const onGuestLeft = (room) => {
    console.log("guest left!");
    const host = getHost(room);
    const guests = getGuests(room);
    host?.ws.send(
        JSON.stringify({
            action: "UPDATE_GUEST_COUNT",
            count: guests.length,
        })
    );
};

const onHostLeft = async (room) => {
    for (const guest of getGuests(room)) {
        guest?.ws.send(JSON.stringify({ action: "ROOM_CLOSED" }));
    }
    console.log("room closed!");
    try {
        await service.deleteRoom(room);
    } catch (e) {
        console.error(e, "Failed to delete room!");
    }
};

const publishMessage = (message, socket_id) => {
    const data = JSON.parse(message);

    if (data.action === "PONG") return;

    if (data.action === "SET_CLIENT_META") {
        setClientMeta(data, socket_id);
        return;
    }

    if (data.from === "host") {
        const host = getSocket(socket_id);
        if (!host) return;
        for (const guest of getGuests(host.room)) {
            guest?.ws.send(message);
        }
    } else {
        const guest = getSocket(socket_id);
        const host = getHost(guest.room);
        host?.ws.send(message);
    }
};

const initialize = (server) => {
    const wss = new WebSocket.Server({ server });

    wss.on("connection", (ws) => {
        const id = uuid.v4();
        sockets.push({ id, ws, isAlive: true });

        ws.on("message", (message) => {
            publishMessage(message, id);
        });

        ws.on("close", () => {
            const closedSocket = getSocket(id);
            if (!closedSocket) return;
            removeSocket(id);
            if (closedSocket.hostOrGuest === "guest") {
                onGuestLeft(closedSocket.room);
            } else {
                onHostLeft(closedSocket.room);
            }
        });
    });

    const interval = setInterval(function ping() {
        sockets.forEach((ws) => {
            ws.ws.send(JSON.stringify({ action: "PING" }));
        });
    }, 30000);

    wss.on("close", function close() {
        clearInterval(interval);
    });
};

module.exports = {
    initialize,
};

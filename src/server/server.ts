import type { PartyKitServer } from "partykit/server";

import * as serverConnections from '../providers'
const connections = Object.values(serverConnections.default)

export default {
    async onConnect(conn, room) {
        for (let connection of connections) {
            if (connection.onConnect) {
                await connection.onConnect(conn, room)
            }
        }
    },

    async onClose(conn, room) {
        for (let connection of connections) {
            if (connection.onClose) {
                await connection.onClose(conn, room)
            }
        }
    },

    async onMessage(msg, conn, room) {
        for (let connection of connections) {
            if (connection.onMessage) {
                await connection.onMessage(msg, conn, room)
            }
        }
    },
} satisfies PartyKitServer;

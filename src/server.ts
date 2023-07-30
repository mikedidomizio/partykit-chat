import type { PartyKitServer } from "partykit/server";

export default {
    async onConnect(conn, room) {
        const list = await room.storage.list()

        room.broadcast(JSON.stringify({
            newUser: conn.id
        }))

        await list.set("users", [list.get("users"), conn.id])

        conn.send(JSON.stringify({
            userId: conn.id,
            users: list.get("users")
        }))
    },

    async onClose(conn, room) {
        const list = await room.storage.list()

        room.broadcast(JSON.stringify({
            removeUser: conn.id
        }))
    },

    async onMessage(msg, conn, room) {
        const parsedMsg = JSON.parse(msg as string)

        if (parsedMsg.newUser) {
            room.broadcast(msg as string)
        }
    },
} satisfies PartyKitServer;

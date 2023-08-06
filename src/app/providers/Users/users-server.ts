import {PartyKitServer} from "partykit/server";

export default {
    async onConnect(conn, room) {
        room.broadcast(JSON.stringify({
            newUser: conn.id
        }))

        // updates user storage list with newly connected user
        const users = await room.storage.get<string[]>("users") ?? []
        const usersListWithNewUser = [...users, conn.id]
        await room.storage.put("users", usersListWithNewUser)

        conn.send(JSON.stringify({
            userId: conn.id,
            users: usersListWithNewUser
        }))
    },

    async onClose(conn, room) {
        room.broadcast(JSON.stringify({
            removeUser: conn.id
        }))

        // updates storage with user list with user removed
        const users = await room.storage.get<string[]>("users") ?? []
        const removedThisUser = users.filter(user => user !== conn.id)

        await room.storage.put("users", removedThisUser)
    },

    async onMessage(msg, conn, room) {
        const parsedMsg = JSON.parse(msg as string)

        if (parsedMsg.newUser) {
            room.broadcast(msg as string)
        }
    },
} satisfies PartyKitServer;

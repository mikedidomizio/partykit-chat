import {PartyKitServer} from "partykit/server";

export type User = {
    id: string,
    name?: string,
}

export enum UserMessages {
    "nameChanged" = "nameChanged",
    "newUser"= "newUser",
    "removeUser" = "removeUser",
    "userId" = "userId",
    "users" = "users",
}

type Users = Map<string, User>

export default {
    async onConnect(conn, room) {
        // updates user storage list with newly connected user
        let users = await room.storage.get<Users>("users")

        // initial setup
        if (!users) {
           await room.storage.put<Users>("users", new Map())
        }

        users = await room.storage.get<Users>("users") as Users

        users.set(conn.id, {
            id: conn.id,
        })

        await room.storage.put<Users>("users", users)
        const flatUsersArrId = Array.from(users, ([, value]) => value)

        // ⚠️ `conn.send` before broadcast otherwise the `send` doesn't fire
        conn.send(JSON.stringify({
            [UserMessages.userId]: conn.id,
            [UserMessages.users]: flatUsersArrId
        }))

        room.broadcast(JSON.stringify({
            [UserMessages.newUser]: {
                id: conn.id
            }
        }), [conn.id])
    },

    async onClose(conn, room) {
        // updates storage with user list with user removed
        const users = await room.storage.get<Map<string, User>>("users")


        if (users) {
            users.delete(conn.id)

            await room.storage.put("users", users)

            room.broadcast(JSON.stringify({
                [UserMessages.removeUser]: conn.id
            }))
        }
    },

    async onMessage(msg, conn, room) {
        const parsedMsg = JSON.parse(msg as string)

        if (parsedMsg.newUser) {
            room.broadcast(msg as string)
        }

        if (parsedMsg.changeName) {
            const users = await room.storage.get<Users>("users")

            if (users) {
                const user = users.get(conn.id)

                if (user) {
                    user.name = parsedMsg.changeName
                    users.set(conn.id, user)

                    await room.storage.put<Users>("users", users)

                    room.broadcast(JSON.stringify({
                        [UserMessages.nameChanged]: {
                            id: conn.id,
                            name: parsedMsg.changeName
                        }
                    }))
                }
            }
        }
    },
} satisfies PartyKitServer;

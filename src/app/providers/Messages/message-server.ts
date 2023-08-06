import {PartyKitServer} from "partykit/server";

export default {
    async onConnect(conn, room) {
    },
    async onClose(conn, room) {
        // on close, we force remove the user
        const isTyping = await room.storage.get<string[]>("isTyping") ?? []
        const userRemovedFromTypingList = isTyping.filter(user => user !== conn.id)
        await room.storage.put("isTyping", userRemovedFromTypingList)

        room.broadcast(JSON.stringify({
            isTyping: userRemovedFromTypingList
        }))
    },
    async onMessage(msg, conn, room) {
        const parsedMsg = JSON.parse(msg as string)

        if (parsedMsg.newMessage) {
            room.broadcast(msg as string)
        }

        if (parsedMsg.isTyping) {
            const isTyping = await room.storage.get<string[]>("isTyping") ?? []
            const userAddedToTypingList = [...new Set([...isTyping, parsedMsg.isTyping])]
            await room.storage.put("isTyping", userAddedToTypingList)

            room.broadcast(JSON.stringify({
                isTyping: userAddedToTypingList
            }))
        }

        if (parsedMsg.isNotTyping) {
            const isTyping = await room.storage.get<string[]>("isTyping") ?? []
            const userRemovedFromTypingList = isTyping.filter(user => user !== parsedMsg.isNotTyping)
            await room.storage.put("isTyping", userRemovedFromTypingList)

            room.broadcast(JSON.stringify({
                isTyping: userRemovedFromTypingList
            }))
        }
    },
} satisfies PartyKitServer;

import {PartyKitServer} from "partykit/server";

export type ChatMessage = {
    id: string,
    text: string,
}

export type WsMessageProviderMessages = {
    newMessage: ChatMessage,
    isTyping: string,
    isNotTyping: string
}

export default {
    async onConnect(conn, room) {
        const messages: ChatMessage[] = await room.storage.get("messages") ?? []

        if (messages.length) {
            conn.send(JSON.stringify({
                messages
            }))
        }
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
        const parsedMsg: WsMessageProviderMessages = JSON.parse(msg as string)

        if (parsedMsg.newMessage) {
            const messages: ChatMessage[] = await room.storage.get("messages") ?? []
            messages.push(parsedMsg.newMessage)
            await room.storage.put("messages", messages)
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

import {PartyKitServer} from "partykit/server";

export default {
    async onConnect(conn, room) {
    },
    async onClose() {},
    async onMessage(msg, conn, room) {
        const parsedMsg = JSON.parse(msg as string)

        if (parsedMsg.newMessage) {
            room.broadcast(msg as string)
        }
    },
} satisfies PartyKitServer;

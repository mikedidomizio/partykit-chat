import {
  PartyKitExtended,
  PartyKitServerWithMoreFun,
} from "@/server/partykit-extended";

export type ChatMessage = {
  id: string;
  text: string;
};

export type WsMessageProviderMessages = {
  newMessage: ChatMessage;
  messages: ChatMessage[];
  usersTyping: string[];
  isTyping: string;
  isNotTyping: string;
};

export const MessageMessages = {
  isTyping: "isTyping",
  isNotTyping: "isNotTyping",
  newMessage: "newMessage",
  messages: "messages",
  newUser: "newUser",
  removeUser: "removeUser",
  userId: "userId",
  users: "users",
} as const;

const Storage = {
  messages: "messages",
  usersTyping: "usersTyping",
} as const;

export default {
  ...PartyKitExtended,
  async onConnectExtended(conn, room) {
    const messages =
      (await room.storage.get<ChatMessage[]>(Storage.messages)) ?? [];

    if (messages.length) {
      conn.sendJson({
        messages,
      });
    }
  },
  async onCloseExtended(conn, room) {
    // on close, we force remove the user
    const usersTyping =
      (await room.storage.get<string[]>(Storage.usersTyping)) ?? [];
    const userRemovedFromTypingList = usersTyping.filter(
      (user) => user !== conn.id,
    );
    await room.storage.put(Storage.usersTyping, userRemovedFromTypingList);

    room.broadcastJson({
      [MessageMessages.isTyping]: userRemovedFromTypingList,
    });
  },
  async onMessageExtended(msg, conn, room) {
    const parsedMsg: WsMessageProviderMessages = JSON.parse(msg as string);

    if (parsedMsg.newMessage) {
      const messages: ChatMessage[] =
        (await room.storage.get(Storage.messages)) ?? [];
      messages.push(parsedMsg.newMessage);
      await room.storage.put(Storage.messages, messages);
      room.broadcast(msg as string);
    }

    if (parsedMsg.isTyping) {
      const isTyping =
        (await room.storage.get<string[]>(Storage.messages)) ?? [];
      const userAddedToTypingList = [
        ...new Set([...isTyping, parsedMsg.isTyping]),
      ];
      await room.storage.put(Storage.usersTyping, userAddedToTypingList);

      room.broadcastJson({
        [MessageMessages.isTyping]: userAddedToTypingList,
      });
    }

    if (parsedMsg.isNotTyping) {
      const isTyping =
        (await room.storage.get<string[]>(Storage.usersTyping)) ?? [];
      const userRemovedFromTypingList = isTyping.filter(
        (user) => user !== parsedMsg.isNotTyping,
      );
      await room.storage.put(Storage.usersTyping, userRemovedFromTypingList);

      room.broadcastJson({
        [MessageMessages.isTyping]: userRemovedFromTypingList,
      });
    }
  },
} satisfies PartyKitServerWithMoreFun;

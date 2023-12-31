import {
  PartyKitExtended,
  PartyKitServerWithMoreFun,
} from "@/server/partykit-extended";

export type MessagesIncoming = {
  newMessage: ChatMessage;
  isTyping: string;
  isNotTyping: string;
};

export const MessagesOutgoing: Record<keyof MessagesOutgoingType, string> = {
  isTyping: "isTyping",
  isNotTyping: "isNotTyping",
  newMessage: "newMessage",
  messages: "messages",
  newUser: "newUser",
  removeUser: "removeUser",
  userId: "userId",
  users: "users",
} as const;

export type MessagesOutgoingType = {
  isTyping: string;
  isNotTyping: string;
  newMessage: ChatMessage;
  messages: unknown;
  newUser: unknown;
  removeUser: unknown;
  userId: unknown;
  users: unknown;
};

const Storage = {
  messages: "messages",
  usersTyping: "usersTyping",
} as const;

export type ChatMessage = {
  id: string;
  text: string;
};

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
      [MessagesOutgoing.isTyping]: userRemovedFromTypingList,
    });
  },
  async onMessageExtended(msg, conn, room) {
    const parsedMsg: MessagesIncoming = JSON.parse(msg as string);

    if (parsedMsg.newMessage) {
      const messages: ChatMessage[] =
        (await room.storage.get(Storage.messages)) ?? [];
      messages.push(parsedMsg.newMessage);
      await room.storage.put(Storage.messages, messages);
      room.broadcast(msg as string);
    }

    if (parsedMsg.isTyping) {
      const isTyping =
        (await room.storage.get<string[]>(Storage.usersTyping)) ?? [];
      const currentUsersTyping = [
        ...new Set([...isTyping, parsedMsg.isTyping]),
      ];

      await room.storage.put(Storage.usersTyping, currentUsersTyping);

      room.broadcastJson({
        [MessagesOutgoing.isTyping]: currentUsersTyping,
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
        [MessagesOutgoing.isTyping]: userRemovedFromTypingList,
      });
    }
  },
} satisfies PartyKitServerWithMoreFun;

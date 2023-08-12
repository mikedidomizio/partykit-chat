import { PartyKitServer } from "partykit/server";
import {
  PartyKitExtended,
  PartyKitServerWithMoreFun,
} from "@/server/partykit-extended";

export type User = {
  id: string;
  name?: string;
};

export const UserMessages = {
  nameChanged: "nameChanged",
  newUser: "newUser",
  removeUser: "removeUser",
  userId: "userId",
  users: "users",
} as const;

const Storage = {
  users: "users",
} as const;

type Users = Map<string, User>;

export default {
  ...PartyKitExtended,
  async onConnectExtended(conn, room) {
    // updates user storage list with newly connected user
    let users = await room.storage.get<Users>(Storage.users);

    // initial setup
    if (!users) {
      await room.storage.put<Users>(Storage.users, new Map());
    }

    users = (await room.storage.get<Users>(Storage.users)) as Users;

    users.set(conn.id, {
      id: conn.id,
    });

    await room.storage.put<Users>(Storage.users, users);
    const flatUsersArrId = Array.from(users, ([, value]) => value);

    // ⚠️ `conn.send` before broadcast otherwise the `send` doesn't fire
    conn.sendJson({
      [UserMessages.userId]: conn.id,
      [UserMessages.users]: flatUsersArrId,
    });

    room.broadcastJson(
      {
        [UserMessages.newUser]: {
          id: conn.id,
        },
      },
      [conn.id],
    );
  },

  async onCloseExtended(conn, room) {
    // updates storage with user list with user removed
    const users = await room.storage.get<Map<string, User>>(Storage.users);

    if (users) {
      users.delete(conn.id);

      await room.storage.put("users", users);

      room.broadcastJson({
        [UserMessages.removeUser]: conn.id,
      });
    }
  },

  async onMessageExtended(msg, conn, room) {
    const parsedMsg = JSON.parse(msg as string);

    if (parsedMsg.newUser) {
      room.broadcast(msg as string);
    }

    if (parsedMsg.changeName) {
      const users = await room.storage.get<Users>(Storage.users);

      if (users) {
        const user = users.get(conn.id);

        if (user) {
          user.name = parsedMsg.changeName;
          users.set(conn.id, user);

          await room.storage.put<Users>(Storage.users, users);

          room.broadcastJson({
            [UserMessages.nameChanged]: {
              id: conn.id,
              name: parsedMsg.changeName,
            },
          });
        }
      }
    }
  },
} satisfies PartyKitServerWithMoreFun;

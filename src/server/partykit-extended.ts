import { PartyKitConnection, PartyKitRoom } from "partykit/server";

function sendJson(obj: Object) {
  // @ts-ignore
  this.send(JSON.stringify(obj));
}

function broadcastJson(obj: Object, without?: string[] | undefined) {
  // @ts-ignore
  this.broadcast(JSON.stringify(obj), without);
}

type PartyKitConnectionWithMoreFun = PartyKitConnection & {
  sendJson: (obj: Object) => void;
};

type PartyKitRoomWithMoreFun = PartyKitRoom & {
  broadcastJson: (obj: Object, without?: string[] | undefined) => void;
};

export type PartyKitServerWithMoreFun = {
  onConnect: (
    conn: PartyKitConnectionWithMoreFun,
    room: PartyKitRoomWithMoreFun,
  ) => void;
  onClose: (
    conn: PartyKitConnectionWithMoreFun,
    room: PartyKitRoomWithMoreFun,
  ) => void;
  onMessage: (
    msg: string | ArrayBuffer,
    conn: PartyKitConnectionWithMoreFun,
    room: PartyKitRoomWithMoreFun,
  ) => void;
  onConnectExtended: (
    conn: PartyKitConnectionWithMoreFun,
    room: PartyKitRoomWithMoreFun,
  ) => void;
  onCloseExtended: (
    conn: PartyKitConnectionWithMoreFun,
    room: PartyKitRoomWithMoreFun,
  ) => void;
  onMessageExtended: (
    msg: string | ArrayBuffer,
    conn: PartyKitConnectionWithMoreFun,
    room: PartyKitRoomWithMoreFun,
  ) => void;
};

export const PartyKitExtended = {
  onConnect(conn, room) {
    conn.sendJson = sendJson;
    room.broadcastJson = broadcastJson;
    this.onConnectExtended(conn, room);
  },
  onClose(conn, room) {
    conn.sendJson = sendJson;
    room.broadcastJson = broadcastJson;
    this.onCloseExtended(conn, room);
  },
  onMessage(msg, conn, room) {
    conn.sendJson = sendJson;
    room.broadcastJson = broadcastJson;
    this.onMessageExtended(msg, conn, room);
  },
  onMessageExtended(msg, conn, room) {
    /**/
  },
  onConnectExtended(conn, room) {
    /**/
  },
  onCloseExtended(conn, room) {
    /**/
  },
} satisfies PartyKitServerWithMoreFun;

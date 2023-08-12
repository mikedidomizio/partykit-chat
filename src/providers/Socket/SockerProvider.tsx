import * as React from "react";
import usePartySocket from "partysocket/react";
import { ReactNode, useCallback, useEffect, useState } from "react";

type SocketContextType<T> = {
  /**
   * Ideally use the useSocketMessage hook instead to narrow down the data you are looking for
   */
  messages: Record<keyof T, any>;
  setMessages: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  sendJson: (obj: Partial<{ [key in keyof T]: T[key] }>) => void;
};

const SocketContext = React.createContext<
  SocketContextType<unknown> | undefined
>(undefined);

/**
 * The provider that should wrap everything PartyKit
 * @param children  All Child providers need to be under this Provider
 * @param room      The PartyKit room
 * @constructor
 */
export function SocketProvider({
  children,
  room,
}: {
  children: ReactNode;
  room: string;
}) {
  const [messages, setMessages] = useState<Record<string, string>>({});

  const socket = usePartySocket({
    host: "localhost:1999",
    room,
    onClose() {},
    // onOpen(event) {
    // },
    onMessage(event) {
      setMessages(JSON.parse(event.data));
    },
  });

  const sendJson = useCallback(
    (msg: Object) => {
      socket.send(JSON.stringify(msg));
    },
    [socket],
  );

  const value = {
    messages,
    setMessages,
    sendJson,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}

/**
 * Gives the ability to access the SocketProvider return values like `sendJson` and `messages`
 *
 * This should only be used by child providers and shouldn't be used in components
 */
export function useSocket<T>() {
  const context = React.useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context as SocketContextType<T>;
}

/**
 * Use this in your React components as a sort of subscriber to messages
 * @param callbackFn    The callbackFn that is called when the matching message is found
 * @param message       When a message with this key is found, the callbackFn is called
 */
export function useSocketMessage<T>(
  callbackFn: (args: T) => void,
  message: string,
) {
  const { messages, setMessages } = useSocket<T>();
  // @ts-ignore
  const possibleMessage = messages[message];

  useEffect(() => {
    if (possibleMessage) {
      // clear the message so providers don't have to handle things, they will only fire once
      // this is done before the `callbackFn`.  I feel if it fails it may not continue therefore if it fails, that message is discarded
      setMessages({});
      callbackFn(possibleMessage);
    }
  }, [callbackFn, possibleMessage, setMessages]);
}

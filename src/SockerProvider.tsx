import * as React from 'react'
import usePartySocket from "partysocket/react";
import {ReactNode, useCallback, useEffect, useState} from "react";
import {PartialRecord} from "@/types/PartialRecord";

type SocketContextType<T> = {
    /**
     * Ideally use the useMessages hook instead to narrow down the data you are looking for
     */
    messages: Record<keyof T, any>,
    setMessages:  React.Dispatch<React.SetStateAction<Record<string, string>>>,
    sendJson: (obj: PartialRecord<any, any>) => void,
}

const SocketContext = React.createContext<SocketContextType<unknown> | undefined>(undefined)

function SocketProvider({children, room}: { children: ReactNode, room: string}) {
    const [messages, setMessages] = useState<Record<string, string>>({})

    const socket = usePartySocket({
        host: "localhost:1999",
        room,
        onClose() {
        },
        // onOpen(event) {
        // },
        onMessage(event) {
            setMessages(JSON.parse(event.data))
        },
    })

    const sendJson = useCallback((msg: Object) => {
        socket.send(JSON.stringify(msg))
    }, [socket])

    const value = {
        messages,
        setMessages,
        sendJson,
    }

    return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
}

function useSocketMessage<T>(callbackFn: (args: T) => void, message: string) {
    const {messages, setMessages} = useSocket<T>()
    // @ts-ignore
    const possibleMessage = messages[message]

    useEffect(() => {
        if (possibleMessage) {
            // clear the message so providers don't have to handle things, they will only fire once
            // this is done before the `callbackFn`.  I feel if it fails it may not continue therefore if it fails, that message is discarded
            setMessages({})
            callbackFn(possibleMessage)
        }
    }, [callbackFn, possibleMessage, setMessages])
}

function useSocket<T>() {
    const context = React.useContext(SocketContext)
    if (context === undefined) {
        throw new Error('useSocket must be used within a SocketProvider')
    }
    return context as SocketContextType<T>
}

export {SocketProvider, useSocketMessage, useSocket}

import * as React from 'react'
import usePartySocket from "partysocket/react";
import {ReactNode, useCallback, useEffect, useState} from "react";
import {PartialRecord} from "@/types/PartialRecord";

type SocketContextType<T> = {
    messages: Record<keyof T, any>,
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
        sendJson,
    }

    return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
}

function useSocketMessage<T>(callbackFn: (args: T) => void, message: string) {
    const context = useSocket<T>()
    // @ts-ignore
    const possibleMessage = context.messages[message]

    useEffect(() => {
        if (possibleMessage) {
            callbackFn(possibleMessage)
        }
    }, [callbackFn, possibleMessage])
}

function useSocket<T>() {
    const context = React.useContext(SocketContext)
    if (context === undefined) {
        throw new Error('useSocket must be used within a SocketProvider')
    }
    return context as SocketContextType<T>
}

export {SocketProvider, useSocketMessage, useSocket}

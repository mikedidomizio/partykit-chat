import * as React from 'react'
import usePartySocket from "partysocket/react";
import {ReactNode, useEffect, useMemo, useState} from "react";
import {Message} from "partysocket/ws";

const SocketContext = React.createContext<any>(undefined)

function SocketProvider({children, room = 'my-room'}: { children: ReactNode, room?: string}) {
    const [messages, setMessages] = useState<Message[]>([])

    const socket = usePartySocket({
        host: "localhost:1999",
        room,
        onClose() {
        },
        onOpen(event) {
        },
        onMessage(event) {
            setMessages(JSON.parse(event.data))
        },
    })

    const sendJson = (msg: Object) => socket.send(JSON.stringify(msg))

    const value = {
        messages,
        sendJson,
        socket,
    }

    const memoizedValue = useMemo(() => {
     return {
         messages,
         sendJson,
         socket,
     }
    }, [messages, sendJson, socket])

    return <SocketContext.Provider value={memoizedValue}>{children}</SocketContext.Provider>
}

function useSocket() {
    const context = React.useContext(SocketContext)
    if (context === undefined) {
        throw new Error('useSocket must be used within a SocketProvider')
    }
    return context
}

export {SocketProvider, useSocket}

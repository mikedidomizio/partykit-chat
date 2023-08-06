import * as React from 'react'
import usePartySocket from "partysocket/react";
import {ReactNode, useState} from "react";
import PartySocket from "partysocket";

type SocketContextType = {
    messages: Record<string, any>,
    sendJson: (obj: Object) => void,
    socket: PartySocket,
}

const SocketContext = React.createContext<SocketContextType | undefined>(undefined)

function SocketProvider({children, room = 'my-room'}: { children: ReactNode, room?: string}) {
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

    const sendJson = (msg: Object) => socket.send(JSON.stringify(msg))

    const value = {
        messages,
        sendJson,
        socket,
    }

    return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
}

function useSocket() {
    const context = React.useContext(SocketContext)
    if (context === undefined) {
        throw new Error('useSocket must be used within a SocketProvider')
    }
    return context
}

export {SocketProvider, useSocket}

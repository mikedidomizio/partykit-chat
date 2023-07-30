import * as React from 'react'
import usePartySocket from "partysocket/react";
import {ReactNode, useEffect, useState} from "react";
import {Message} from "partysocket/ws";

const SocketContext = React.createContext<any>(undefined)

function SocketProvider({children, room = 'my-room'}: { children: ReactNode, room?: string}) {
    const [messages, setMessages] = useState<Message[]>([])
    const [users, setUsers] = useState<string[]>([])

    const socket = usePartySocket({
        host: "localhost:1999",
        room,
        onClose() {


        },
        onOpen(event) {
            // console.log(event)
            // setUsers([rand])

            console.log(event)
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
        users,
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

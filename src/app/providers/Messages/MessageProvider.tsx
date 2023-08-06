import * as React from 'react'
import {ReactNode, useEffect, useMemo, useState} from "react";
import {useSocket} from "@/app/SockerProvider";

const MessageContext = React.createContext<any>(undefined)

type Message = {
    id: string,
    text: string,
}

function MessageProvider({children}: { children: ReactNode}) {
    const {messages, sendJson} = useSocket()
    const [chatMessages, setChatMessages] = useState<Message[]>([])

    useEffect(() => {
        if (messages.newMessage) {
            setChatMessages(messages.newMessage)
        }

    }, [messages])

    const sendMessage = (id: string, text: string) => {
        sendJson({
            newMessage: {
                id,
                text,
            }
        })
    }

    const value = {
        chatMessages,
        sendMessage,
    }

    return <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
}

function useMessage() {
    const context = React.useContext(MessageContext)
    if (context === undefined) {
        throw new Error('useMessage must be used within a UsersProvider')
    }
    return context
}

export {MessageProvider, useMessage}

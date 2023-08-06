import * as React from 'react'
import {ReactNode, useEffect, useState} from "react";
import {useSocket} from "@/app/SockerProvider";

type MessageContextType = {
    chatMessages: Message[],
    sendMessage: (userId: string, text: string) => void,
    sendIsTyping: (userIdTyping: string, isTyping: boolean) => void,
    usersWhoAreTyping: string[]
}

const MessageContext = React.createContext<MessageContextType | undefined>(undefined)

type Message = {
    id: string,
    text: string,
}

function MessageProvider({children}: { children: ReactNode}) {
    const {messages, sendJson} = useSocket()
    const [chatMessages, setChatMessages] = useState<Message[]>([])
    const [usersWhoAreTyping, setUsersWhoAreTyping] = useState<string[]>([])

    useEffect(() => {
        if (messages.newMessage) {
            setChatMessages(messages.newMessage)
        }

        if (messages.isTyping) {
            setUsersWhoAreTyping(messages.isTyping)
        }

    }, [messages])

    const sendMessage = (userId: string, text: string) => {
        sendJson({
            newMessage: {
                id: userId,
                text,
            }
        })
    }

    const sendIsTyping = (userTyping: string, isTyping: boolean) => {
        if (isTyping) {
            sendJson({
                isTyping: userTyping
            })
        } else {
            sendJson({
                isNotTyping: userTyping
            })
        }
    }

    const value = {
        chatMessages,
        sendMessage,
        sendIsTyping,
        usersWhoAreTyping
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

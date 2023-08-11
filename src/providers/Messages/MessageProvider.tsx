import * as React from 'react'
import {ReactNode, useCallback, useState} from "react";
import {ChatMessage, MessageMessages, WsMessageProviderMessages} from "@/providers/Messages/message-server";
import {useSocket, useSocketMessage} from "@/SockerProvider";

type MessageContextType = {
    chatMessages: Partial<ChatMessage>[],
    sendMessage: (userId: string, text: string) => void,
    sendIsTyping: (userIdTyping: string, isTyping: boolean) => void,
    usersWhoAreTyping: string[]
}

const MessageContext = React.createContext<MessageContextType | undefined>(undefined)

export function MessageProvider({children}: { children: ReactNode}) {
    const {sendJson} = useSocket<WsMessageProviderMessages>()
    const [chatMessages, setChatMessages] = useState<Partial<ChatMessage>[]>([])
    const [usersWhoAreTyping, setUsersWhoAreTyping] = useState<string[]>([])

    useSocketMessage<ChatMessage>((obj) => {
        setChatMessages([obj])
    }, MessageMessages.newMessage)

    useSocketMessage<string[]>((obj) => {
        setUsersWhoAreTyping(obj)
    }, MessageMessages.isTyping)

    useSocketMessage<ChatMessage[]>((obj) => {
        setChatMessages(obj)
    }, MessageMessages.messages)

    // need to useCallback as the function change will
    const sendMessage = useCallback((userId: string, text: string) => {
        sendJson({
            newMessage: {
                id: userId,
                text,
            },
        })
    }, [sendJson])

    const sendIsTyping = useCallback((userTyping: string, isTyping: boolean) => {
        if (isTyping) {
            sendJson({
                isTyping: userTyping
            })
        } else {
            console.log('send is not typing')
            sendJson({
                isNotTyping: userTyping
            })
        }
    }, [sendJson])

    const value = {
        chatMessages,
        sendMessage,
        sendIsTyping,
        usersWhoAreTyping
    }

    return <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
}

export function useMessage() {
    const context = React.useContext(MessageContext)
    if (context === undefined) {
        throw new Error('useSocketMessage must be used within a MessageProvider')
    }
    return context
}

import {ChatMessage, useMessage} from "@/app/providers/Messages/MessageProvider";
import {useEffect, useState} from "react";

export const ChatArea = () => {
    const {chatMessages } = useMessage()
    const [messages, setMessages] = useState<Partial<ChatMessage>[]>([])

    useEffect(() => {
        if (chatMessages.id) {
            setMessages([...messages, chatMessages])
        }
    }, [chatMessages])

    const textFormatted = messages?.map(({ id, text}) => {
        return `${id}: ${text}`
    }).join("\n")

    return <textarea readOnly key={JSON.stringify(messages)} value={textFormatted} onChange={() => {}} className="border-red-600 border-2"></textarea>
}

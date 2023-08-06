import {ChatMessage, useMessage} from "@/app/providers/Messages/MessageProvider";
import {useEffect, useState} from "react";

export const ChatMessages = () => {
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

    return <textarea className="textarea textarea-bordered w-full h-full resize-none" readOnly key={JSON.stringify(messages)} value={textFormatted} onChange={() => {}}></textarea>
}

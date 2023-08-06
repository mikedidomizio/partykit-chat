import {useEffect, useState} from "react";
import {useUsers} from "@/app/providers/Users/UsersProvider";
import {useMessage} from "@/app/providers/Messages/MessageProvider";
import {useDebounce} from "usehooks-ts";

export const ChatForm = () => {
    const {sendIsTyping, sendMessage} = useMessage()
    const {thisUser} = useUsers()
    const [isTyping, setIsTyping] = useState<number | null>(null)
    const debouncedValue = useDebounce<number | null>(isTyping, 3000)

    useEffect(() => {
        if (thisUser) {
            setIsTyping(null)
            sendIsTyping(thisUser, false)
        }
    }, [debouncedValue])

    const [textareaValue, setTextareaValue] = useState('')

    const handleSubmit = () => {
        if (thisUser) {
            sendMessage(thisUser, textareaValue)
            setTextareaValue('')
            sendIsTyping(thisUser, false)
        }
    }

    const handleUserTyping = (e: any) => {
        if (thisUser) {
            sendIsTyping(thisUser, true)
            setTextareaValue(e.target.value)
            setIsTyping(new Date().getTime())
        }
    }

    return <div className="space-y-4">
        <textarea value={textareaValue} onChange={handleUserTyping} className="textarea textarea-bordered w-full resize-none" />
        <button className="btn" disabled={textareaValue.trim() === ""} onClick={handleSubmit}>Submit</button>
    </div>
}

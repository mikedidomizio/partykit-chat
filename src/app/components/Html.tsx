import {useEffect, useState} from "react";
import {useUsers} from "@/app/providers/Users/UsersProvider";
import {useMessage} from "@/app/providers/Messages/MessageProvider";
import {useDebounce} from "usehooks-ts";

export const Html = () => {
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

    return <>
        <textarea value={textareaValue} onChange={handleUserTyping} className="border-black border-2" />
        <button onClick={handleSubmit}>Submit</button>
    </>
}

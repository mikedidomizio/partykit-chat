import {useState} from "react";
import {useUsers} from "@/app/providers/Users/UsersProvider";
import {useMessage} from "@/app/providers/Messages/MessageProvider";

export const Html = () => {
    const {sendMessage} = useMessage()
    const {thisUser} = useUsers()
    const [textareaValue, setTextareaValue] = useState('')

    const handleChange = () => {
        sendMessage(thisUser, textareaValue)
        setTextareaValue('')
    }

    return <>
        <textarea value={textareaValue} onChange={(e) => setTextareaValue(e.target.value)} className="border-black border-2" />
        <button onClick={handleChange}>Submit</button>
    </>
}

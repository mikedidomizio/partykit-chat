'use client'

import {ChatForm} from "@/app/components/ChatForm";
import {useUsers} from "@/app/providers/Users/UsersProvider";
import {ChatMessages} from "@/app/components/ChatMessages";
import {useMessage} from "@/app/providers/Messages/MessageProvider";
import {WhoIsTyping} from "@/app/components/WhoIsTyping";

export const Content = () => {
    const {thisUser, users} = useUsers()


    return <>
        Me: {thisUser}<br/>
        {JSON.stringify(users)}
        <div className="form-control">
            <ChatMessages />
            <WhoIsTyping />
        </div>
        <ChatForm />
    </>
}

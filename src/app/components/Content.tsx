'use client'

import {Html} from "@/app/components/Html";
import {useUsers} from "@/app/providers/Users/UsersProvider";
import {ChatArea} from "@/app/components/ChatArea";
import {useMessage} from "@/app/providers/Messages/MessageProvider";

export const Content = () => {
    const {thisUser, users} = useUsers()

    return <>
        Me: {thisUser}<br/>
        {JSON.stringify(users)}
        <ChatArea />
        <Html />
    </>
}
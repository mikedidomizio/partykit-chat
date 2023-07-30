'use client'

import {Html} from "@/app/components/html";
import {useSocket} from "@/app/SockerProvider";
import {RenderArea} from "@/app/components/RenderArea";
import {useUsers} from "@/app/UsersProvider";

export const Content = () => {
    const {sendJson} = useSocket()
    const {thisUser, users} = useUsers()

    console.log('>', thisUser)

    const handleButton = () => {
        sendJson({
            test: 'works'
        })
    }

    return <>
        Me: {thisUser}<br/>
        {JSON.stringify(users)}
        {/*{JSON.stringify(messages[messages.length - 1])}*/}
        <button onClick={handleButton}>Test</button>
        <RenderArea />
        <Html />
    </>
}

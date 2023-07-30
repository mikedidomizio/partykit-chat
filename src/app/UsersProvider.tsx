import * as React from 'react'
import {ReactNode, useEffect, useState} from "react";
import {useSocket} from "@/app/SockerProvider";

const UsersContext = React.createContext<any>(undefined)

function UsersProvider({children, room = 'my-room'}: { children: ReactNode, room?: string}) {
    const {messages, sendJson} = useSocket()
    const [users, setUsers] = useState<string[]>([])
    const [thisUser, setThisUser] = useState<string | null>(null)

    console.log('my messages', messages)

    useEffect(() => {
        console.log('messages', messages)

        if (messages.users) {
            setUsers(messages.users)
        }

        if (messages.userId) {
            // this is the current users ID
            setThisUser(messages.userId)
        }

        if (messages.newUser) {
            setUsers((users) => [...users, messages.newUser])
        }

        if (messages.removeUser) {
            const filteredUser = users.filter(user => user !== messages.removeUser)
            setUsers((users) => filteredUser)
        }
    }, [messages])

    const value = {
        thisUser,
        users,
    }

    useEffect(() => {
        return () => {
            sendJson({
                removeUser: thisUser
            })
        }
    }, [])

    return <UsersContext.Provider value={value}>{children}</UsersContext.Provider>
}

function useUsers() {
    const context = React.useContext(UsersContext)
    if (context === undefined) {
        throw new Error('useUsers must be used within a UsersProvider')
    }
    return context
}

export {UsersProvider, useUsers}

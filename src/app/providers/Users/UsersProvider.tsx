import * as React from 'react'
import {ReactNode, useEffect, useState} from "react";
import {useSocket} from "@/app/SockerProvider";

type UsersContextType = {
    thisUser: string | null,
    users: string[],
}

const UsersContext = React.createContext<UsersContextType | undefined>(undefined)

function UsersProvider({children, room = 'my-room'}: { children: ReactNode, room?: string}) {
    const {messages, sendJson} = useSocket()
    const [users, setUsers] = useState<string[]>([])
    const [thisUser, setThisUser] = useState<string | null>(null)

    useEffect(() => {
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

    useEffect(() => {
        return () => {
            sendJson({
                removeUser: thisUser
            })
        }
    }, [])

    const value = {
        thisUser,
        users,
    }

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

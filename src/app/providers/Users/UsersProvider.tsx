import * as React from 'react'
import {ReactNode, useEffect, useState} from "react";
import {useSocket} from "@/app/SockerProvider";
import {User} from "@/app/providers/Users/users-server";

type UsersContextType = {
    thisUser: string | null,
    users: User[],
    setName: (name: string) => void
}

const UsersContext = React.createContext<UsersContextType | undefined>(undefined)

function UsersProvider({children}: { children: ReactNode }) {
    const {messages, sendJson} = useSocket()
    const [users, setUsers] = useState<User[]>([])
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

        if (messages.nameChanged) {
            const updatedUsers = users.map(user => {
                if (user.id === messages.nameChanged.id && messages.nameChanged.name) {
                    return {
                        ...user,
                        name: messages.nameChanged.name
                    }
                }

                return user
            })

            setUsers(updatedUsers)
        }
    }, [messages])

    // on unload we tell the server to remove the user
    useEffect(() => {
        return () => {
            sendJson({
                removeUser: thisUser
            })
        }
    }, [])

    const setName = (name: string) => {
        return sendJson({
            changeName: name,
        })
    }

    const value = {
        thisUser,
        users,
        setName,
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

import * as React from 'react'
import {ReactNode, useEffect, useState} from "react";
import {useSocket} from "@/SockerProvider";
import {User} from "@/providers/Users/users-server";
import {useTimeout, useToggle} from "usehooks-ts";

type UsersContextType = {
    thisUser: string | null,
    users: User[],
    sendName: (name: string) => void
}

const UsersContext = React.createContext<UsersContextType | undefined>(undefined)

function UsersProvider({children}: { children: ReactNode }) {
    const {messages, sendJson} = useSocket()
    const [users, setUsers] = useState<User[]>([])
    const [thisUser, setThisUser] = useState<string | null>(null)

    useTimeout(() => {
        if (!thisUser) {
            throw new Error('Could not get the current user id?')
        }
    }, 3000)

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
            setUsers((users) => users.filter(user => user.id !== messages.removeUser))
        }

        if (messages.nameChanged) {
            setUsers((users) => {
                return users.map(user => {
                    if (user.id === messages.nameChanged.id && messages.nameChanged.name) {
                        return {
                            ...user,
                            name: messages.nameChanged.name
                        }
                    }

                    return user
                })
            })
        }
    }, [messages])

    // on unload we tell the server to remove the user
    useEffect(() => {
        return () => {
            sendJson({
                removeUser: thisUser
            })
        }
    }, [sendJson, thisUser])

    const sendName = (name: string) => {
        return sendJson({
            changeName: name,
        })
    }

    const value = {
        thisUser,
        users,
        sendName,
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

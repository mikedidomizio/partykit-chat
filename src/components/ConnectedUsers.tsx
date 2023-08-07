import {useUsers} from "@/providers/Users/UsersProvider";

export function ConnectedUsers() {
    const {thisUser, users} = useUsers()

    let textFormattedWithoutThisUser =  users.reduce((acc, cur) => {
        if (cur.id === thisUser) {
            return acc
        }

        if (acc !== "") {
            acc += ", "
        }

        if (cur.name) {
            acc += cur.name
        } else {
            acc += cur.id
        }

        return acc
    }, "")

    return <>({users.length}) {textFormattedWithoutThisUser} <span className="text-green-600">{thisUser}</span></>
}

import {useUsers} from "@/providers/Users/UsersProvider";

export function ConnectedUsers() {
    const {users} = useUsers()

    let textFormatted =  users.reduce((acc, cur) => {
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

    return <>({users.length}) {textFormatted}</>
}

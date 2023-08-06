import {useUsers} from "@/app/providers/Users/UsersProvider";

export function ConnectedUsers() {
    const {users} = useUsers()

    let textFormatted =  users.reduce((acc, cur) => {
        if (acc !== "") {
            acc += ", "
        }

        acc += cur

        return acc
    }, "")

    return <>({users.length}) {textFormatted}</>
}

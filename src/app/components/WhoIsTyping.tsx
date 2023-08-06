import {useMessage} from "@/app/providers/Messages/MessageProvider";

export function WhoIsTyping() {
    const {usersWhoAreTyping} = useMessage()

    if (!usersWhoAreTyping.length) {
        return null
    }

    let textFormatted =  usersWhoAreTyping.reduce((acc, cur) => {
        if (acc !== "") {
            acc += ", "
        }

        acc += cur

        return acc
    }, "")

    if (usersWhoAreTyping.length === 1) {
        textFormatted += " is typing"
    } else if (usersWhoAreTyping.length > 1) {
        textFormatted += " are typing"
    }

    return <>
        <span className="loading loading-dots loading-sm" />{textFormatted}</>
}

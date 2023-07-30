import {useSocket} from "@/app/SockerProvider";

export const RenderArea = () => {
    const {messages} = useSocket()

    return <>{messages[messages.length- 1]}</>
}

import {useSocket} from "@/app/SockerProvider";

export const Html = () => {
    const {sendJson} = useSocket()

    const handleChange = (e: any) => {
        sendJson({
            name: e.target.value
        })
    }

    return <textarea className="text-black" onChange={handleChange}>
        hello world
    </textarea>
}

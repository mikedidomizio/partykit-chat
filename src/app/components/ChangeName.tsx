import {useState} from "react";
import {useUsers} from "@/app/providers/Users/UsersProvider";

export function ChangeName() {
    const {setName} = useUsers()
    const [nameField, setNameField] = useState('')
    const handleSaveName = () => {
        setNameField("")
        setName(nameField)
    }

    return <div className="form">
        <input value={nameField} onChange={(e) => setNameField(e.target.value)} type="text" placeholder="User Name" className="input input-bordered w-full max-w-xs"/>
        <button className="btn" disabled={nameField === ""} onClick={handleSaveName}>Save Name</button>
    </div>
}

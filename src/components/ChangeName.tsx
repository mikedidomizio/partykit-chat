import { useState } from "react";
import { useUsers } from "@/providers/Users/UsersProvider";

export function ChangeName() {
  const { sendName, thisUser } = useUsers();
  const [nameField, setNameField] = useState("");
  const handleSaveName = () => {
    setNameField("");
    sendName(nameField);
  };

  return (
    <div className="form flex flex-row">
      <input
        value={nameField}
        onChange={(e) => setNameField(e.target.value)}
        type="text"
        placeholder="User Name"
        className="input input-bordered w-full max-w-xs rounded-2xl mr-2 text-sm input-primary"
      />
      <button
        className="btn btn-primary rounded-2xl"
        disabled={!thisUser || nameField === ""}
        onClick={handleSaveName}
      >
        Change Name
      </button>
    </div>
  );
}

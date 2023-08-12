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
    <div className="form">
      <input
        value={nameField}
        onChange={(e) => setNameField(e.target.value)}
        type="text"
        placeholder="User Name"
        className="input input-bordered w-full max-w-xs"
      />
      <button
        className="btn"
        disabled={!thisUser || nameField === ""}
        onClick={handleSaveName}
      >
        Change Name
      </button>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useUsers } from "@/providers/Users/UsersProvider";
import { useMessage } from "@/providers/Messages/MessageProvider";
import { useDebounce } from "usehooks-ts";

export const ChatForm = () => {
  const { sendIsTyping, sendMessage, usersWhoAreTyping } = useMessage();
  const { thisUser } = useUsers();
  const [isTyping, setIsTyping] = useState<number | null>(null);
  const debouncedValue = useDebounce<number | null>(isTyping, 3000);

  useEffect(() => {
    if (thisUser) {
      setIsTyping(null);
      sendIsTyping(thisUser, false);
    }
  }, [sendIsTyping, thisUser, debouncedValue]);

  const [textareaValue, setTextareaValue] = useState("");

  const handleSubmit = () => {
    if (thisUser) {
      sendMessage(thisUser, textareaValue);
      setTextareaValue("");
      sendIsTyping(thisUser, false);
    }
  };

  const handleUserTyping = (e: any) => {
    if (thisUser) {
      sendIsTyping(thisUser, true);
      setIsTyping(new Date().getTime());
    }

    setTextareaValue(e.target.value);
  };

  return (
    <div>
      <textarea
        placeholder="Type a message..."
        value={textareaValue}
        onChange={handleUserTyping}
        className="textarea textarea-bordered w-full resize-none"
      />
      <button
        className="btn"
        disabled={!thisUser || textareaValue.trim() === ""}
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
};

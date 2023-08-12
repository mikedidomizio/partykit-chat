import React, { useEffect, useState } from "react";
import { useUsers } from "@/providers/Users/UsersProvider";
import { useMessage } from "@/providers/Message/MessageProvider";
import { useDebounce } from "usehooks-ts";
import { ChangeName } from "@/components/ChangeName";

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
        className="textarea textarea-bordered w-full resize-none rounded-2xl mb-2 textarea-primary"
      />
      <div className="flex flex-row justify-between">
        <button
          className="btn btn-primary rounded-2xl"
          disabled={!thisUser || textareaValue.trim() === ""}
          onClick={handleSubmit}
        >
          Send Message
        </button>
        <ChangeName />
      </div>
    </div>
  );
};

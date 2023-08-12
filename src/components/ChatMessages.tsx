import { useMessage } from "@/providers/Messages/MessageProvider";
import { useEffect, useState } from "react";
import { useUsers } from "@/providers/Users/UsersProvider";
import { ChatMessage } from "@/providers/Messages/message-server";

export const ChatMessages = () => {
  const { chatMessages } = useMessage();
  const { users } = useUsers();
  const [messages, setMessages] = useState<Partial<ChatMessage>[]>([]);

  useEffect(() => {
    if (chatMessages) {
      setMessages((messages) => [...messages, ...chatMessages]);
    }
  }, [chatMessages]);

  const textFormatted = messages
    ?.map(({ id, text }) => {
      const foundUser = users.find((user) => user.id === id);

      if (foundUser?.name) {
        return `${foundUser.name}: ${text}`;
      }

      return `${id}: ${text}`;
    })
    .join("\n");

  return (
    <textarea
      className="textarea textarea-bordered w-full h-full resize-none"
      readOnly
      key={JSON.stringify(messages)}
      value={textFormatted}
      onChange={() => {}}
    ></textarea>
  );
};

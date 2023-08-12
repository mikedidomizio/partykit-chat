import { ChatForm } from "@/components/ChatForm";
import { ChatMessages } from "@/components/ChatMessages";
import { WhoIsTyping } from "@/components/WhoIsTyping";
import React from "react";
import { ConnectedUsers } from "@/components/ConnectedUsers";
import { ChangeName } from "@/components/ChangeName";

export const Content = () => {
  return (
    <>
      <div className="flex flex-col w-full min-h-full">
        <div className="form-control flex-1">
          <div className="py-4 flex-1">
            <ConnectedUsers />
            <ChatMessages />
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          <WhoIsTyping />
          <ChatForm />
          <ChangeName />
        </div>
      </div>
    </>
  );
};

import {ChatForm} from "@/app/components/ChatForm";
import {ChatMessages} from "@/app/components/ChatMessages";
import {WhoIsTyping} from "@/app/components/WhoIsTyping";
import React from "react";
import {ConnectedUsers} from "@/app/components/ConnectedUsers";
import {ChangeName} from "@/app/components/ChangeName";

export const Content = () => {
    return <>
        <div className="flex flex-col w-full min-h-full">
            <div className="form-control flex-1">
                <div className="py-4 flex-1">
                    <ConnectedUsers />
                    <ChatMessages />
                </div>
            </div>
            <div className="pt-2">

            </div>
            <div className="space-y-2">
                <WhoIsTyping />
            </div>
            <ChatForm />
            <ChangeName />
        </div>
    </>
}

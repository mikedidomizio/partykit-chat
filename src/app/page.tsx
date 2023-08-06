'use client'
import {SocketProvider} from "@/app/SockerProvider";
import React from "react";
import {Content} from "@/app/components/Content";
import {UsersProvider} from "@/app/providers/Users/UsersProvider";
import {MessageProvider} from "@/app/providers/Messages/MessageProvider";

export default function Home() {
  return (
    <main className="flex min-h-screen p-24">
        <SocketProvider>
            <UsersProvider>
                <MessageProvider>
                    <Content />
                </MessageProvider>
            </UsersProvider>
        </SocketProvider>
    </main>
  )
}

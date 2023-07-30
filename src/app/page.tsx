'use client'
import {SocketProvider} from "@/app/SockerProvider";
import React from "react";
import {Content} from "@/app/components/Content";
import {UsersProvider} from "@/app/UsersProvider";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <SocketProvider>
            <UsersProvider>
                <Content />
            </UsersProvider>
        </SocketProvider>
    </main>
  )
}

'use client'
import {SocketProvider} from "@/SockerProvider";
import React from "react";
import {Content} from "@/components/Content";
import {UsersProvider} from "@/providers/Users/UsersProvider";
import {MessageProvider} from "@/providers/Messages/MessageProvider";
import {useRouter} from "next/navigation";

export default function Page({ params }: {params : { room: string}}) {
    return (
        <main className="flex min-h-screen p-24">
            <SocketProvider room={params.room}>
                <UsersProvider>
                    <MessageProvider>
                        <Content />
                    </MessageProvider>
                </UsersProvider>
            </SocketProvider>
        </main>
    )
}

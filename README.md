# PartyKit with React /w React Context

## Description

This is a basic chat application with rooms and "who is typing" using PartyKit.
The purpose behind this is to demo a clean way of creating a React app with PartyKit.

### How it works

There's a main `SocketProvider` that handles the PartyKit connection.  The Context provides is a wrapper for the PartyKit connection that provides a `sendJson` function that
child providers can use to broadcast to the server.

Each child provider has a single piece of functionality to keep things simple.

In this repo there is a `UsersProvider` that handles what happens when a user joins, leaves, who the user is.  As well as a `MessageProvider`
that handles the chat portion of the application, messages in/out.  This prevents functionality bleeding over.

Each provider comes with a "server" file that also keeps the PartyKit `server` file clean.  
Each one has its own `onConnect`, `onMessage`, `onClose` that way it's clear how each one works separately.

By using React Context, any parts of the application can send and receive messages from PartyKit easily.


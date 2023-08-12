import * as React from "react";
import { ReactNode, useEffect, useState } from "react";
import { useSocket, useSocketMessage } from "@/providers/Socket/SockerProvider";
import {
  User,
  UsersOutgoing,
  UsersOutgoingType,
} from "@/providers/Users/users-server";
import { useTimeout } from "usehooks-ts";

type UsersContextType = {
  thisUser: string | null;
  users: User[];
  sendName: (name: string) => void;
};

const UsersContext = React.createContext<UsersContextType | undefined>(
  undefined,
);

function UsersProvider({ children }: { children: ReactNode }) {
  const { sendJson } = useSocket<UsersOutgoingType>();
  const [users, setUsers] = useState<User[]>([]);
  const [thisUser, setThisUser] = useState<string | null>(null);

  useTimeout(() => {
    if (!thisUser) {
      throw new Error("Could not get the current user id?");
    }
  }, 3000);

  useSocketMessage<string>(setThisUser, UsersOutgoing.userId);

  useSocketMessage<User[]>(setUsers, UsersOutgoing.users);

  useSocketMessage<User>((obj) => {
    setUsers((users) => [...users, obj]);
  }, UsersOutgoing.newUser);

  useSocketMessage<string>((userId) => {
    setUsers((users) => users.filter((user) => user.id !== userId));
  }, UsersOutgoing.removeUser);

  useSocketMessage<User>((obj) => {
    setUsers((users) => {
      return users.map((user) => {
        if (user.id === obj.id && obj.name) {
          return {
            ...user,
            name: obj.name,
          };
        }

        return user;
      });
    });
  }, UsersOutgoing.nameChanged);

  // on unload we tell the server to remove the user
  useEffect(() => {
    return () => {
      if (thisUser) {
        sendJson({
          removeUser: thisUser,
        });
      }
    };
  }, [sendJson, thisUser]);

  const sendName = (name: string) => {
    return sendJson({
      changeName: name,
    });
  };

  const value = {
    thisUser,
    users,
    sendName,
  };

  return (
    <UsersContext.Provider value={value}>{children}</UsersContext.Provider>
  );
}

function useUsers() {
  const context = React.useContext(UsersContext);
  if (context === undefined) {
    throw new Error("useUsers must be used within a UsersProvider");
  }
  return context;
}

export { UsersProvider, useUsers };

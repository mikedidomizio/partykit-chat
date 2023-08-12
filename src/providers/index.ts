import MessageServer from "@/providers/Message/message-server";
import UsersServer from "./Users/users-server";

const ServerMiddleware = {
  UsersServer,
  MessageServer,
};

export default ServerMiddleware;

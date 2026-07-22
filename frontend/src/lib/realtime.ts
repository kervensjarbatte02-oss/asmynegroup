// Client Socket.IO pour la marketplace
import { io, Socket } from "socket.io-client";

const URL = process.env.NEXT_PUBLIC_REALTIME_URL || "http://localhost:4001";
let socket: Socket | null = null;

export function getSocket() {
  if (!socket) {
    socket = io(URL, { transports: ["websocket"] });
  }
  return socket;
}

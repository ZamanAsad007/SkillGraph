import { io } from "socket.io-client";

export function useSocket() {
  return io(import.meta.env.VITE_SOCKET_URL ?? "http://localhost:3002", { autoConnect: false });
}

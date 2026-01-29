import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { useUserStore } from "@/stores/useAuthStore";
import { env } from "@/utils/env";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUserStore();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (user?.accessToken) {
      const baseUrl = env?.VITE_API_USER_SERVICE_URL || "http://localhost:3000";
      const socketUrl = baseUrl.replace("/api/v1", "");

      const socket = io(socketUrl, {
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socket.on("connect", () => {
        console.log("Connected to socket server");
        setIsConnected(true);
        socket.emit(
          "registerUser",
          JSON.stringify({ token: user.accessToken }),
        );
      });

      socket.on("disconnect", () => {
        console.log("Disconnected from socket server");
        setIsConnected(false);
      });

      socket.on("welcome", (data) => {
        console.log("Socket welcome:", data);
      });

      socket.on("authError", (err) => {
        console.error("Socket auth error:", err);
      });

      socketRef.current = socket;

      return () => {
        if (socket) {
          socket.disconnect();
        }
        socketRef.current = null;
        setIsConnected(false);
      };
    }
  }, [user?.accessToken]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

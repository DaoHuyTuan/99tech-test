import { useEffect, useRef, useCallback, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketError {
  message: string;
  details?: string;
}

interface UsePricingSocketOptions {
  url: string; // URL của socket server, ví dụ: 'http://localhost:3000'
  tokenId: string;
  onPricingUpdate?: (data: any) => void;
  onError?: (error: SocketError) => void;
}

export const usePricingSocket = ({
  url,
  tokenId,
  onPricingUpdate,
  onError,
}: UsePricingSocketOptions) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<SocketError | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const onPricingUpdateRef = useRef(onPricingUpdate);
  const onErrorRef = useRef(onError);

  // Update callback refs
  useEffect(() => {
    onPricingUpdateRef.current = onPricingUpdate;
  }, [onPricingUpdate]);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  useEffect(() => {
    // Tạo socket connection với namespace 'pricings'
    const socket = io(`${url}/pricings`, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    // Handle connection
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      setIsConnected(true);
      setError(null);

      // Subscribe to token khi connect thành công
      socket.emit("subscribe", { tokenId });
    });

    // Handle disconnect
    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      setIsConnected(false);
    });

    // Handle reconnect
    socket.on("reconnect", (attemptNumber) => {
      console.log("Socket reconnected after", attemptNumber, "attempts");
      // Re-subscribe sau khi reconnect
      socket.emit("subscribe", { tokenId });
    });

    // Handle pricing updates
    socket.on("pricingUpdate", (data) => {
      onPricingUpdateRef.current?.(data);
    });

    // Handle errors
    socket.on("error", (errorData: SocketError) => {
      console.error("Socket error:", errorData);
      setError(errorData);
      onErrorRef.current?.(errorData);
    });

    // Cleanup
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [url, tokenId]);

  // Function để manually re-subscribe (nếu cần)
  const resubscribe = useCallback(
    (newTokenId?: string) => {
      if (socketRef.current?.connected) {
        socketRef.current.emit("subscribe", {
          tokenId: newTokenId || tokenId,
        });
      }
    },
    [tokenId]
  );

  return {
    socket: socketRef.current,
    isConnected,
    error,
    resubscribe,
  };
};

// src/hooks/useDashboardSocket.js
import { useEffect, useState } from "react";

export const useDashboardSocket = () => {
  const [data, setData] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000/ws/dashboard");

    socket.onopen = () => {
      console.log("✅ WebSocket connected from React");
      setConnected(true);
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log("📨 Message from server:", message);
        setData(message);
      } catch (e) {
        console.error("❌ Failed to parse WebSocket message:", e);
      }
    };

    socket.onerror = (err) => {
      console.error("❌ WebSocket error:", err);
    };

    socket.onclose = (event) => {
      console.warn("⚠️ WebSocket closed:", event.reason || "No reason");
      setConnected(false);
    };

    return () => {
      console.log("🔌 Closing WebSocket");
      socket.close();
    };
  }, []);

  return { data, connected };
};


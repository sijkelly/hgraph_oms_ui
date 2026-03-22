/**
 * React hook for subscribing to WebSocket message types.
 */

import { useEffect, useState } from "react";
import { creditWs, type WebSocketManager } from "./websocket";

export function useCreditWebSocket<T>(type: string): T | null {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    creditWs.connect();
    const unsub = creditWs.on(type, (payload) => setData(payload as T));
    return () => {
      unsub();
    };
  }, [type]);

  return data;
}

export function useWebSocketData<T>(ws: WebSocketManager, type: string): T | null {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    ws.connect();
    const unsub = ws.on(type, (payload) => setData(payload as T));
    return () => {
      unsub();
    };
  }, [ws, type]);

  return data;
}

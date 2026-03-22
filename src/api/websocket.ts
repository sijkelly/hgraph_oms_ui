/**
 * WebSocket connection manager with auto-reconnect.
 */

export type MessageHandler = (data: unknown) => void;

export class WebSocketManager {
  private ws: WebSocket | null = null;
  private handlers = new Map<string, Set<MessageHandler>>();
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private reconnectDelay = 2000;

  constructor(private url: string) {}

  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    const wsUrl = this.url.startsWith("/")
      ? `${location.protocol === "https:" ? "wss:" : "ws:"}//${location.host}${this.url}`
      : this.url;

    this.ws = new WebSocket(wsUrl);

    this.ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data) as { type: string; data: unknown };
        const listeners = this.handlers.get(msg.type);
        if (listeners) {
          for (const handler of listeners) {
            handler(msg.data);
          }
        }
      } catch {
        console.warn("WebSocket: invalid message", event.data);
      }
    };

    this.ws.onclose = () => {
      this.scheduleReconnect();
    };

    this.ws.onerror = () => {
      this.ws?.close();
    };
  }

  disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.onclose = null;
      this.ws.close();
      this.ws = null;
    }
  }

  on(type: string, handler: MessageHandler): () => void {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set());
    }
    this.handlers.get(type)!.add(handler);

    return () => {
      this.handlers.get(type)?.delete(handler);
    };
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, this.reconnectDelay);
  }
}

export const creditWs = new WebSocketManager("/ws/credit");

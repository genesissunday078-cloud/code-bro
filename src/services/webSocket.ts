import type { AgentEvent, ClientMessage } from '../types/agent.types';

type EventHandler = (event: AgentEvent) => void;
type StatusHandler = (connected: boolean) => void;

export class AgentWebSocket {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private closedByUser = false;

  constructor(
    private url: string,
    private onEvent: EventHandler,
    private onStatusChange: StatusHandler
  ) {
    this.connect();
  }

  private connect() {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      this.onStatusChange(true);
    };

    this.ws.onclose = () => {
      this.onStatusChange(false);
      if (!this.closedByUser) this.scheduleReconnect();
    };

    this.ws.onerror = () => {
      this.ws?.close();
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as AgentEvent;
        this.onEvent(data);
      } catch (err) {
        console.error('Failed to parse WS message:', err);
      }
    };
  }

  private scheduleReconnect() {
    const delay = Math.min(1000 * 2 ** this.reconnectAttempts, 15000);
    this.reconnectAttempts += 1;
    this.reconnectTimer = setTimeout(() => this.connect(), delay);
  }

  sendMessage(content: string) {
    this.send({ type: 'user_message', content });
  }

  reset() {
    this.send({ type: 'reset' });
  }

  private send(msg: ClientMessage) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg));
    }
  }

  close() {
    this.closedByUser = true;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.ws?.close();
  }
}


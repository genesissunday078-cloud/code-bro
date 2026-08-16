import { useEffect, useRef, useState, useCallback } from 'react';
import { AgentWebSocket } from '../services/websocket';
import { getWsUrl } from '../config';
import type { AgentEvent, ChatMessage, Suggestion } from '../types/agent.types';

export function useAgentWebSocket() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [connected, setConnected] = useState(false);
  const [busy, setBusy] = useState(false);
  const [previewVersion, setPreviewVersion] = useState(0);
  const wsRef = useRef<AgentWebSocket | null>(null);

  const addMessage = useCallback((msg: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    setMessages((prev) => [...prev, { ...msg, id: crypto.randomUUID(), timestamp: Date.now() }]);
  }, []);

  useEffect(() => {
    const handleEvent = (event: AgentEvent) => {
      switch (event.type) {
        case 'thought':
          addMessage({ role: 'system', content: `💭 ${event.content}` });
          break;

        case 'tool_call':
          setBusy(true);
          addMessage({
            role: 'tool',
            content: `🔧 ${event.tool_name}(${JSON.stringify(event.arguments)})`,
            status: 'running',
          });
          break;

        case 'tool_result':
          addMessage({
            role: event.error ? 'error' : 'tool_result',
            content: `${event.error ? '❌' : '✅'} ${event.tool_name} → ${event.result.slice(0, 200)}`,
          });
          break;

        case 'file_changed':
          setPreviewVersion((v) => v + 1);
          break;

        case 'done':
          setBusy(false);
          addMessage({ role: 'assistant', content: event.content });
          break;

        case 'suggestions':
          setSuggestions(event.suggestions);
          break;

        case 'finished':
          setBusy(false);
          addMessage({ role: 'system', content: `⏱️ Worked for ${event.worked_for}s` });
          break;

        case 'error':
          setBusy(false);
          addMessage({ role: 'error', content: `❌ ${event.content}` });
          break;

        default: {
          // Exhaustiveness check: TS will flag this if a new AgentEvent variant
          // is added without a matching case above.
          const _exhaustive: never = event;
          void _exhaustive;
        }
      }
    };

    const ws = new AgentWebSocket(getWsUrl(), handleEvent, setConnected);
    wsRef.current = ws;
    return () => ws.close();
  }, [addMessage]);

  const sendMessage = useCallback(
    (content: string) => {
      if (!content.trim() || !wsRef.current) return;
      addMessage({ role: 'user', content });
      wsRef.current.sendMessage(content);
      setSuggestions([]);
      setBusy(true);
    },
    [addMessage]
  );

  const resetConversation = useCallback(() => {
    setMessages([]);
    setSuggestions([]);
    wsRef.current?.reset();
  }, []);

  return { messages, suggestions, connected, busy, previewVersion, sendMessage, resetConversation };
}


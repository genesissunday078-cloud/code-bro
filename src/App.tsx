import React, { useState, useEffect, useRef } from 'react';
import { useAgentWebSocket } from './hooks/useAgentWebSocket';
import { ChatMessage } from './components/ChatMessage';
import { SuggestionButtons } from './components/SuggestionButtons';
import { ConnectionStatus } from './components/ConnectionStatus';
import { LivePreview } from './components/LivePreview';

function App() {
  const { messages, suggestions, connected, busy, previewVersion, sendMessage, resetConversation } =
    useAgentWebSocket();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = () => {
    if (busy || !input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  return (
    <div style={{ display: 'flex', height: '100vh', boxSizing: 'border-box' }}>
      <div
        style={{
          width: '45%',
          minWidth: 360,
          display: 'flex',
          flexDirection: 'column',
          padding: 16,
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h2 style={{ margin: 0, fontSize: 18 }}>Coding Agent</h2>
            <ConnectionStatus connected={connected} />
          </div>
          <button onClick={resetConversation} style={{ cursor: 'pointer', fontSize: 12 }}>
            Reset
          </button>
        </div>

        <div
          style={{
            flex: 1,
            border: '1px solid #ddd',
            borderRadius: 8,
            padding: 10,
            overflowY: 'auto',
            background: '#fafafa',
            marginTop: 10,
          }}
        >
          {messages.length === 0 && (
            <div style={{ color: '#999', fontSize: 13 }}>
              Ask the agent to build something, e.g. "Build a simple landing page with a hero section and a
              contact form."
            </div>
          )}
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        <SuggestionButtons suggestions={suggestions} onSelect={sendMessage} />

        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder={busy ? 'Agent is working...' : 'Ask me to build something...'}
            disabled={busy}
            style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
          />
          <button
            onClick={handleSubmit}
            disabled={busy || !input.trim()}
            style={{ padding: '8px 16px', cursor: busy ? 'default' : 'pointer', borderRadius: 6 }}
          >
            Send
          </button>
        </div>
      </div>

      <div style={{ width: '55%', padding: 16, boxSizing: 'border-box' }}>
        <LivePreview version={previewVersion} />
      </div>
    </div>
  );
}

export default App;

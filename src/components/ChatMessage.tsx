import React from 'react';
import type { ChatMessage as ChatMessageType } from '../types/agent.types';

interface Props {
  message: ChatMessageType;
}

const roleColor: Record<string, string> = {
  user: '#e3f2fd',
  assistant: '#ffffff',
  system: '#f0f0f0',
  tool: '#fff8e1',
  tool_result: '#e8f5e9',
  error: '#ffebee',
};

export const ChatMessage: React.FC<Props> = ({ message }) => (
  <div style={{ marginBottom: 8 }}>
    <div style={{ fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase' }}>
      {message.role}
    </div>
    <div
      style={{
        background: roleColor[message.role] ?? '#fff',
        padding: '6px 10px',
        borderRadius: 6,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        fontSize: 14,
      }}
    >
      {message.content}
    </div>
  </div>
);


export type Suggestion = {
  title: string;
  description: string;
  prompt: string;
};

// Mirrors server/src/types.ts — keep these two files in sync manually,
// since this project doesn't share a types package between client/server.
export type AgentEvent =
  | { type: 'thought'; content: string }
  | { type: 'tool_call'; id: string; tool_name: string; arguments: Record<string, unknown> }
  | { type: 'tool_result'; id: string; tool_name: string; result: string; error?: boolean }
  | { type: 'file_changed'; path: string }
  | { type: 'done'; content: string }
  | { type: 'suggestions'; suggestions: Suggestion[] }
  | { type: 'finished'; worked_for: number }
  | { type: 'error'; content: string };

export type ClientMessage =
  | { type: 'user_message'; content: string }
  | { type: 'reset' };

export type Role = 'user' | 'assistant' | 'system' | 'tool' | 'tool_result' | 'error';

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
  status?: 'running' | 'completed' | 'error';
}


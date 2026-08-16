import React from 'react';
import type { Suggestion } from '../types/agent.types';

interface Props {
  suggestions: Suggestion[];
  onSelect: (prompt: string) => void;
}

export const SuggestionButtons: React.FC<Props> = ({ suggestions, onSelect }) => {
  if (suggestions.length === 0) return null;

  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#888', marginBottom: 4 }}>What next?</div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => onSelect(s.prompt)}
            title={s.description}
            style={{
              padding: '6px 12px',
              borderRadius: 16,
              border: '1px solid #ddd',
              background: '#fff',
              cursor: 'pointer',
              fontSize: 13,
            }}
          >
            {s.title}
          </button>
        ))}
      </div>
    </div>
  );
};

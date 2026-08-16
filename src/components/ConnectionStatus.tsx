import React from 'react';

interface Props {
  connected: boolean;
}

export const ConnectionStatus: React.FC<Props> = ({ connected }) => (
  <span style={{ fontSize: 13, color: connected ? '#2e7d32' : '#c62828' }}>
    {connected ? '● Connected' : '○ Disconnected'}
  </span>
);

import React from 'react';
import { getBackendOrigin } from '../config';

interface Props {
  version: number;
}

// Remounting the iframe (via `key`) forces a full reload whenever the agent
// writes a file, which is what keeps the preview in sync without polling.
export const LivePreview: React.FC<Props> = ({ version }) => (
  <div
    style={{
      border: '1px solid #ddd',
      borderRadius: 8,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}
  >
    <div
      style={{
        padding: '6px 10px',
        borderBottom: '1px solid #eee',
        fontSize: 12,
        color: '#888',
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <span>Live Preview</span>
      <span>/preview/index.html</span>
    </div>
    <iframe
      key={version}
      src={`${getBackendOrigin()}/preview/index.html?v=${version}`}
      title="Live Preview"
      style={{ flex: 1, border: 'none', width: '100%', background: '#fff' }}
    />
  </div>
);

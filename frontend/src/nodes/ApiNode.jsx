import { useEffect } from 'react';
import { Position } from 'reactflow';

import { BaseNode } from './BaseNode';
import { useStore } from '../store/store';

export const ApiNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  const url = data?.url ?? 'https://api.example.com';
  const method = data?.method ?? 'GET';

  useEffect(() => {
    if (data?.url === undefined) updateNodeField(id, 'url', url);
    if (data?.method === undefined) updateNodeField(id, 'method', method);
  }, [id, data, url, method, updateNodeField]);

  const handles = [
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-trigger`,
      label: 'trigger',
    },
    {
      type: 'source',
      position: Position.Right,
      id: `${id}-data`,
      label: 'response',
    },
  ];

  return (
    <BaseNode
      id={id}
      title="API"
      icon="API"
      color="var(--color-api)"
      handles={handles}
    >
      <div className="base-node-field">
        <label className="base-node-label">URL</label>
        <input
          type="text"
          className="base-node-input"
          value={url}
          onChange={(e) => updateNodeField(id, 'url', e.target.value)}
        />
      </div>
      <div className="base-node-field">
        <label className="base-node-label">Method</label>
        <select
          className="base-node-select"
          value={method}
          onChange={(e) => updateNodeField(id, 'method', e.target.value)}
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
      </div>
    </BaseNode>
  );
};

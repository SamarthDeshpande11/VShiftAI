import { useEffect } from 'react';
import { Position } from 'reactflow';

import { BaseNode } from './BaseNode';
import { useStore } from '../store/store';

export const DatabaseNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  const connStr = data?.connStr ?? 'postgresql://localhost:5432/db';
  const query = data?.query ?? 'SELECT * FROM users;';

  useEffect(() => {
    if (data?.connStr === undefined) updateNodeField(id, 'connStr', connStr);
    if (data?.query === undefined) updateNodeField(id, 'query', query);
  }, [id, data, connStr, query, updateNodeField]);

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
      id: `${id}-result`,
      label: 'result',
    },
  ];

  return (
    <BaseNode
      id={id}
      title="Database"
      icon="DB"
      color="var(--color-db)"
      handles={handles}
    >
      <div className="base-node-field">
        <label className="base-node-label">Connection String</label>
        <input
          type="text"
          className="base-node-input"
          value={connStr}
          onChange={(e) => updateNodeField(id, 'connStr', e.target.value)}
        />
      </div>
      <div className="base-node-field">
        <label className="base-node-label">SQL Query</label>
        <textarea
          className="base-node-textarea"
          value={query}
          onChange={(e) => updateNodeField(id, 'query', e.target.value)}
          rows={2}
        />
      </div>
    </BaseNode>
  );
};

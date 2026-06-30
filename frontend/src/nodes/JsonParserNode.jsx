import { useEffect } from 'react';
import { Position } from 'reactflow';

import { BaseNode } from './BaseNode';
import { useStore } from '../store/store';

export const JsonParserNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  const pathFilter = data?.pathFilter ?? '$.data.users[0]';

  useEffect(() => {
    if (data?.pathFilter === undefined) {
      updateNodeField(id, 'pathFilter', pathFilter);
    }
  }, [id, data, pathFilter, updateNodeField]);

  const handles = [
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-json`,
      label: 'json',
    },
    {
      type: 'source',
      position: Position.Right,
      id: `${id}-parsed`,
      label: 'parsed',
    },
  ];

  return (
    <BaseNode
      id={id}
      title="JSON Parser"
      icon="JP"
      color="var(--color-json)"
      handles={handles}
    >
      <div className="base-node-field">
        <label className="base-node-label">JSONPath Filter</label>
        <input
          type="text"
          className="base-node-input"
          value={pathFilter}
          onChange={(e) => updateNodeField(id, 'pathFilter', e.target.value)}
        />
      </div>
    </BaseNode>
  );
};

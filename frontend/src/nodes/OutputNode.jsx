import { useEffect } from 'react';
import { Position } from 'reactflow';

import { BaseNode } from './BaseNode';
import { useStore } from '../store/store';

export const OutputNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  const outputName = data?.outputName ?? id.replace('customOutput-', 'output_');
  const outputType = data?.outputType ?? 'Text';

  useEffect(() => {
    if (data?.outputName === undefined) {
      updateNodeField(id, 'outputName', outputName);
    }
    if (data?.outputType === undefined) {
      updateNodeField(id, 'outputType', outputType);
    }
  }, [id, data, outputName, outputType, updateNodeField]);

  const handles = [
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-value`,
    },
  ];

  return (
    <BaseNode
      id={id}
      title="Output"
      icon="OUT"
      color="var(--color-output)"
      handles={handles}
    >
      <div className="base-node-field">
        <label className="base-node-label">Name</label>
        <input
          type="text"
          className="base-node-input"
          value={outputName}
          onChange={(e) => updateNodeField(id, 'outputName', e.target.value)}
        />
      </div>
      <div className="base-node-field">
        <label className="base-node-label">Type</label>
        <select
          className="base-node-select"
          value={outputType}
          onChange={(e) => updateNodeField(id, 'outputType', e.target.value)}
        >
          <option value="Text">Text</option>
          <option value="File">Image</option>
        </select>
      </div>
    </BaseNode>
  );
};

import { useEffect } from 'react';
import { Position } from 'reactflow';

import { BaseNode } from './BaseNode';
import { useStore } from '../store/store';

export const InputNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  const inputName = data?.inputName ?? id.replace('customInput-', 'input_');
  const inputType = data?.inputType ?? 'Text';

  useEffect(() => {
    if (data?.inputName === undefined) {
      updateNodeField(id, 'inputName', inputName);
    }
    if (data?.inputType === undefined) {
      updateNodeField(id, 'inputType', inputType);
    }
  }, [id, data, inputName, inputType, updateNodeField]);

  const handles = [
    {
      type: 'source',
      position: Position.Right,
      id: `${id}-value`,
    },
  ];

  return (
    <BaseNode
      id={id}
      title="Input"
      icon="IN"
      color="var(--color-input)"
      handles={handles}
    >
      <div className="base-node-field">
        <label className="base-node-label">Name</label>
        <input
          type="text"
          className="base-node-input"
          value={inputName}
          onChange={(e) => updateNodeField(id, 'inputName', e.target.value)}
        />
      </div>
      <div className="base-node-field">
        <label className="base-node-label">Type</label>
        <select
          className="base-node-select"
          value={inputType}
          onChange={(e) => updateNodeField(id, 'inputType', e.target.value)}
        >
          <option value="Text">Text</option>
          <option value="File">File</option>
        </select>
      </div>
    </BaseNode>
  );
};

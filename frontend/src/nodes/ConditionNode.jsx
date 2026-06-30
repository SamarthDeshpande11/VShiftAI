import { useEffect } from 'react';
import { Position } from 'reactflow';

import { BaseNode } from './BaseNode';
import { useStore } from '../store/store';

export const ConditionNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  const operator = data?.operator ?? '==';
  const val = data?.value ?? 'active';

  useEffect(() => {
    if (data?.operator === undefined) updateNodeField(id, 'operator', operator);
    if (data?.value === undefined) updateNodeField(id, 'value', val);
  }, [id, data, operator, val, updateNodeField]);

  const handles = [
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-input`,
      label: 'input',
      style: { top: '50%' },
    },
    {
      type: 'source',
      position: Position.Right,
      id: `${id}-true`,
      label: 'true',
      style: { top: '33%' },
    },
    {
      type: 'source',
      position: Position.Right,
      id: `${id}-false`,
      label: 'false',
      style: { top: '66%' },
    },
  ];

  return (
    <BaseNode
      id={id}
      title="Condition"
      icon="IF"
      color="var(--color-condition)"
      handles={handles}
    >
      <div className="base-node-field">
        <label className="base-node-label">Operator</label>
        <select
          className="base-node-select"
          value={operator}
          onChange={(e) => updateNodeField(id, 'operator', e.target.value)}
        >
          <option value="==">== (Equals)</option>
          <option value="!=">!= (Not Equals)</option>
          <option value=">">&gt; (Greater Than)</option>
          <option value="<">&lt; (Less Than)</option>
          <option value="contains">contains</option>
        </select>
      </div>
      <div className="base-node-field">
        <label className="base-node-label">Value</label>
        <input
          type="text"
          className="base-node-input"
          value={val}
          onChange={(e) => updateNodeField(id, 'value', e.target.value)}
        />
      </div>
    </BaseNode>
  );
};

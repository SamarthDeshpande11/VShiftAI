import { Position } from 'reactflow';

import { BaseNode } from './BaseNode';

export const LLMNode = ({ id, data }) => {
  const handles = [
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-system`,
      style: { top: '33%' },
      label: 'system',
    },
    {
      type: 'target',
      position: Position.Left,
      id: `${id}-prompt`,
      style: { top: '66%' },
      label: 'prompt',
    },
    {
      type: 'source',
      position: Position.Right,
      id: `${id}-response`,
      style: { top: '50%' },
      label: 'response',
    },
  ];

  return (
    <BaseNode
      id={id}
      title="LLM"
      icon="LLM"
      color="var(--color-llm)"
      handles={handles}
    >
      <p className="base-node-description">
        This node executes a Large Language Model query using a system prompt and user prompt.
      </p>
    </BaseNode>
  );
};

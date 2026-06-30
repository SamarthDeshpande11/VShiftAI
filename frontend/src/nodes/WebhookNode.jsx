import { useEffect } from 'react';
import { Position } from 'reactflow';

import { BaseNode } from './BaseNode';
import { useStore } from '../store/store';

export const WebhookNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  const path = data?.path ?? '/webhook/v1/trigger';
  const secret = data?.secret ?? 'whsec_secretkey';

  useEffect(() => {
    if (data?.path === undefined) updateNodeField(id, 'path', path);
    if (data?.secret === undefined) updateNodeField(id, 'secret', secret);
  }, [id, data, path, secret, updateNodeField]);

  const handles = [
    {
      type: 'source',
      position: Position.Right,
      id: `${id}-payload`,
      label: 'payload',
    },
  ];

  return (
    <BaseNode
      id={id}
      title="Webhook"
      icon="WH"
      color="var(--color-webhook)"
      handles={handles}
    >
      <div className="base-node-field">
        <label className="base-node-label">Path</label>
        <input
          type="text"
          className="base-node-input"
          value={path}
          onChange={(e) => updateNodeField(id, 'path', e.target.value)}
        />
      </div>
      <div className="base-node-field">
        <label className="base-node-label">Secret Token</label>
        <input
          type="password"
          className="base-node-input"
          value={secret}
          onChange={(e) => updateNodeField(id, 'secret', e.target.value)}
        />
      </div>
    </BaseNode>
  );
};

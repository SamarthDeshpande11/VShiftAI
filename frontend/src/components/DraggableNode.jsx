const NODE_META = {
  customInput: { abbr: 'IN', accent: 'var(--color-input)' },
  llm: { abbr: 'AI', accent: 'var(--color-llm)' },
  customOutput: { abbr: 'OUT', accent: 'var(--color-output)' },
  text: { abbr: 'Tx', accent: 'var(--color-text)' },
  api: { abbr: 'API', accent: 'var(--color-api)' },
  database: { abbr: 'DB', accent: 'var(--color-db)' },
  webhook: { abbr: 'WH', accent: 'var(--color-webhook)' },
  jsonParser: { abbr: 'JP', accent: 'var(--color-json)' },
  condition: { abbr: 'IF', accent: 'var(--color-condition)' },
};

export const DraggableNode = ({ type, label }) => {
  const meta = NODE_META[type] || { abbr: 'ND', accent: 'var(--accent)' };

  const onDragStart = (event, nodeType) => {
    const appData = { nodeType };
    event.target.style.cursor = 'grabbing';
    event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className="draggable-node"
      style={{ '--chip-accent': meta.accent }}
      onDragStart={(event) => onDragStart(event, type)}
      onDragEnd={(event) => (event.target.style.cursor = 'grab')}
      draggable
    >
      <span className="draggable-node-icon">{meta.abbr}</span>
      <span>{label}</span>
    </div>
  );
};

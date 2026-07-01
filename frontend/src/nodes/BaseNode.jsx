import { Handle, Position } from 'reactflow';
import { useStore } from '../store/store';

export const BaseNode = ({
  id,
  title,
  icon = 'ND',
  color = 'var(--border-focus)',
  handles = [],
  style = {},
  children,
  footer,
}) => {
  const removeNode = useStore((state) => state.removeNode);

  return (
    <div className="base-node" style={{ ...style, '--node-accent': color }}>
      <button 
        className="base-node-delete" 
        onClick={(e) => { e.stopPropagation(); removeNode(id); }}
        title="Delete Node"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
      </button>
      {handles.map((handle, index) => {
        const isLeft = handle.position === Position.Left;
        const handleStyle = handle.style || {};
        const labelTop = handleStyle.top || '50%';

        return (
          <div key={handle.id || index} className="base-node-handle-wrap">
            <Handle
              type={handle.type}
              position={handle.position}
              id={handle.id}
              style={{ ...handleStyle }}
              className="custom-handle"
            />
            {handle.label && (
              <span
                className={`handle-label ${isLeft ? 'handle-label-left' : 'handle-label-right'}`}
                style={{ top: labelTop }}
              >
                {handle.label}
              </span>
            )}
          </div>
        );
      })}

      <div className="base-node-header">
        <div className="base-node-header-title">
          <span className="base-node-header-icon">{icon}</span>
          <span>{title}</span>
        </div>
        <span className="base-node-id">{id}</span>
      </div>

      <div className="base-node-body">{children}</div>

      {footer && <div className="base-node-footer">{footer}</div>}
    </div>
  );
};

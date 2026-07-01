import { BaseEdge, getBezierPath, useReactFlow } from 'reactflow';

const EDGE_COLOR         = '#4A5263';
const EDGE_COLOR_HOVER   = '#2D333D';
const EDGE_COLOR_ACTIVE  = '#6366F1';
const STROKE_WIDTH       = 2.5;
const STROKE_WIDTH_HOVER = 3.2;

// Unique marker ID per color so React doesn't share/reuse the wrong one
const markerId = (color) =>
  `workflow-arrow-${color.replace(/[^a-zA-Z0-9]/g, '')}`;

function ArrowMarker({ id, color }) {
  return (
    <marker
      id={id}
      markerWidth="10"
      markerHeight="10"
      refX="6"
      refY="3"
      orient="auto"
      markerUnits="strokeWidth"
    >
      <path
        d="M0,0 L0,6 L9,3 z"
        fill={color}
        stroke="none"
        strokeLinejoin="round"
      />
    </marker>
  );
}

export function WorkflowEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  selected,
  markerEnd: _markerEnd, // ignore the prop — we render our own
  style = {},
}) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    curvature: 0.45,   // n8n-style: moderate, natural tension
  });

  const color = selected ? EDGE_COLOR_ACTIVE : EDGE_COLOR;
  const hoverColor = selected ? EDGE_COLOR_ACTIVE : EDGE_COLOR_HOVER;
  const arrowId = markerId(color);
  const arrowIdHover = markerId(hoverColor);

  return (
    <>
      {/* Inject SVG marker defs into the flow's SVG via a hidden element.
          React Flow renders edges inside an <svg>, so defs added here
          are picked up by the marker references below. */}
      <defs>
        <ArrowMarker id={arrowId}      color={color} />
        <ArrowMarker id={arrowIdHover} color={hoverColor} />
      </defs>

      {/* Wide invisible hit area so hover is easy to trigger */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={18}
        className="workflow-edge-hitarea"
      />

      {/* Main visible path — hover handled purely in CSS via the group */}
      <g className={`workflow-edge-group${selected ? ' selected' : ''}`}>
        <BaseEdge
          id={id}
          path={edgePath}
          markerEnd={`url(#${arrowId})`}
          style={{
            stroke: color,
            strokeWidth: STROKE_WIDTH,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            fill: 'none',
            transition: 'stroke 140ms ease, stroke-width 140ms ease, filter 140ms ease',
            ...style,
          }}
        />
        {/* Hover-state path rendered on top — CSS shows/hides it */}
        <BaseEdge
          id={`${id}-hover`}
          path={edgePath}
          markerEnd={`url(#${arrowIdHover})`}
          className="workflow-edge-hover-path"
          style={{
            stroke: hoverColor,
            strokeWidth: STROKE_WIDTH_HOVER,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            fill: 'none',
            opacity: 0,
            filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.18))',
            transition: 'opacity 140ms ease',
          }}
        />
      </g>
    </>
  );
}

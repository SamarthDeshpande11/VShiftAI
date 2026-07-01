import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap, BackgroundVariant, getBezierPath } from 'reactflow';
import { shallow } from 'zustand/shallow';

import { useStore } from '../store/store';
import { InputNode } from '../nodes/InputNode';
import { LLMNode } from '../nodes/LLMNode';
import { OutputNode } from '../nodes/OutputNode';
import { TextNode } from '../nodes/TextNode';
import { ApiNode } from '../nodes/ApiNode';
import { DatabaseNode } from '../nodes/DatabaseNode';
import { WebhookNode } from '../nodes/WebhookNode';
import { JsonParserNode } from '../nodes/JsonParserNode';
import { ConditionNode } from '../nodes/ConditionNode';
import { WorkflowEdge } from '../edges/WorkflowEdge';

import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };

const defaultEdgeOptions = {
  type: 'workflow',
};

// Animated bezier preview while dragging a connection
const ConnectionLine = ({ fromX, fromY, fromPosition, toX, toY, toPosition }) => {
  const [path] = getBezierPath({
    sourceX: fromX,
    sourceY: fromY,
    sourcePosition: fromPosition,
    targetX: toX,
    targetY: toY,
    targetPosition: toPosition,
    curvature: 0.45,
  });

  return (
    <g>
      <path
        d={path}
        fill="none"
        stroke="#6366F1"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="6 4"
        style={{
          animation: 'edgeDash 600ms linear infinite',
          opacity: 0.7,
        }}
      />
    </g>
  );
};

const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  api: ApiNode,
  database: DatabaseNode,
  webhook: WebhookNode,
  jsonParser: JsonParserNode,
  condition: ConditionNode,
};

const edgeTypes = {
  workflow: WorkflowEdge,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export const PipelineCanvas = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const {
    nodes,
    edges,
    getNodeID,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
  } = useStore(selector, shallow);

  const getInitNodeData = (nodeID, type) => {
    const nodeData = { id: nodeID, nodeType: `${type}` };
    return nodeData;
  };

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      if (event?.dataTransfer?.getData('application/reactflow')) {
        const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
        const type = appData?.nodeType;

        if (typeof type === 'undefined' || !type) {
          return;
        }

        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        const nodeID = getNodeID(type);
        const newNode = {
          id: nodeID,
          type,
          position,
          data: getInitNodeData(nodeID, type),
        };

        addNode(newNode);
      }
    },
    [reactFlowInstance, getNodeID, addNode]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div ref={reactFlowWrapper} className="reactflow-wrapper">
      <div className="canvas-atmosphere" aria-hidden="true" />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        proOptions={proOptions}
        defaultEdgeOptions={defaultEdgeOptions}
        connectionLineComponent={ConnectionLine}
        snapGrid={[gridSize, gridSize]}
      >
        <Background variant={BackgroundVariant.Dots} color="#C9CDD4" gap={gridSize} size={1.2} />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};

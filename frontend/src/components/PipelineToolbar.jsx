import { DraggableNode } from './DraggableNode';

export const PipelineToolbar = () => {
  return (
    <div className="pipeline-toolbar">
      <h2 className="pipeline-toolbar-title">Node Palette</h2>
      <div className="pipeline-toolbar-nodes">
        <DraggableNode type="customInput" label="Input" />
        <DraggableNode type="llm" label="LLM" />
        <DraggableNode type="customOutput" label="Output" />
        <DraggableNode type="text" label="Text" />
        <DraggableNode type="api" label="API" />
        <DraggableNode type="database" label="Database" />
        <DraggableNode type="webhook" label="Webhook" />
        <DraggableNode type="jsonParser" label="JSON Parser" />
        <DraggableNode type="condition" label="Condition" />
      </div>
    </div>
  );
};

import { useState, useEffect, useRef } from 'react';
import { Position } from 'reactflow';

import { BaseNode } from './BaseNode';
import { useStore } from '../store/store';

export const TextNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const edges = useStore((state) => state.edges);
  const setEdges = useStore((state) => state.setEdges);

  const [currText, setCurrText] = useState(data?.text ?? '{{input}}');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (data?.text === undefined) {
      updateNodeField(id, 'text', currText);
    }
  }, [id, data, currText, updateNodeField]);

  const extractVariables = (text) => {
    const regex = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;
    const matches = [];
    let match;
    const seen = new Set();
    while ((match = regex.exec(text)) !== null) {
      const varName = match[1];
      if (!seen.has(varName)) {
        seen.add(varName);
        matches.push(varName);
      }
    }
    return matches;
  };

  const vars = extractVariables(currText);
  const prevVarsStr = JSON.stringify(data?.variables || []);
  const newVarsStr = JSON.stringify(vars);

  useEffect(() => {
    if (prevVarsStr !== newVarsStr) {
      updateNodeField(id, 'variables', vars);

      const validHandles = new Set([
        `${id}-output`,
        ...vars.map((v) => `${id}-${v}`),
      ]);

      const nextEdges = edges.filter((e) => {
        if (e.target === id) return validHandles.has(e.targetHandle);
        if (e.source === id) return validHandles.has(e.sourceHandle);
        return true;
      });

      if (nextEdges.length !== edges.length) {
        setEdges(nextEdges);
      }
    }
  }, [vars, id, prevVarsStr, newVarsStr, edges, setEdges, updateNodeField]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height first so scrollHeight is accurate
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [currText]);

  const handleTextChange = (e) => {
    setCurrText(e.target.value);
    updateNodeField(id, 'text', e.target.value);
  };

  const handles = [
    {
      type: 'source',
      position: Position.Right,
      id: `${id}-output`,
      style: { top: '50%' },
    },
    ...vars.map((v, i) => ({
      type: 'target',
      position: Position.Left,
      id: `${id}-${v}`,
      style: { top: `${((i + 1) * 100) / (vars.length + 1)}%` },
      label: v,
    })),
  ];

  return (
    <BaseNode
      id={id}
      title="Text"
      icon="TX"
      color="var(--color-text)"
      handles={handles}
    >
      <div className="base-node-field">
        <label className="base-node-label">Text</label>
        <textarea
          ref={textareaRef}
          className="base-node-textarea"
          value={currText}
          onChange={handleTextChange}
          rows={1}
        />
      </div>
    </BaseNode>
  );
};

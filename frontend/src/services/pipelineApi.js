const PARSE_PIPELINE_URL = 'http://localhost:8000/pipelines/parse';

export async function parsePipeline(nodes, edges) {
  const payload = {
    nodes: nodes.map((n) => ({
      id: n.id,
      type: n.type,
      data: n.data || {},
    })),
    edges: edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      sourceHandle: e.sourceHandle,
      targetHandle: e.targetHandle,
    })),
  };

  const response = await fetch(PARSE_PIPELINE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Server returned status ${response.status}`);
  }

  return response.json();
}

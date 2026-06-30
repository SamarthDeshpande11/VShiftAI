from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
from collections import deque

app = FastAPI()

# Enable CORS so the frontend app can communicate with this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for assessment purposes
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Node(BaseModel):
    id: str
    type: str
    data: Dict[str, Any] = {}

class Edge(BaseModel):
    id: str
    source: str
    target: str
    sourceHandle: str = None
    targetHandle: str = None

class Pipeline(BaseModel):
    nodes: List[Node]
    edges: List[Edge]

@app.get('/')
def read_root():
    return {'status': 'healthy', 'message': 'Pipeline Parser API is running'}

@app.post('/pipelines/parse')
def parse_pipeline(pipeline: Pipeline):
    nodes = pipeline.nodes
    edges = pipeline.edges
    
    num_nodes = len(nodes)
    num_edges = len(edges)
    
    # Check if the graph is a Directed Acyclic Graph (DAG) using Kahn's Algorithm
    node_ids = {node.id for node in nodes}
    
    # Initialize in-degree map and adjacency list
    in_degree = {node_id: 0 for node_id in node_ids}
    adj_list = {node_id: [] for node_id in node_ids}
    
    # Build graph
    for edge in edges:
        # Avoid processing edges with missing/invalid source or target nodes
        if edge.source in node_ids and edge.target in node_ids:
            adj_list[edge.source].append(edge.target)
            in_degree[edge.target] += 1
            
    # Queue for nodes with in-degree 0
    queue = deque([node_id for node_id in node_ids if in_degree[node_id] == 0])
    visited_count = 0
    
    while queue:
        u = queue.popleft()
        visited_count += 1
        
        for v in adj_list[u]:
            in_degree[v] -= 1
            if in_degree[v] == 0:
                queue.append(v)
                
    # If visited count equals total nodes, no cycle exists -> it is a DAG
    is_dag = (visited_count == num_nodes)
    
    return {
        'num_nodes': num_nodes,
        'num_edges': num_edges,
        'is_dag': is_dag
    }

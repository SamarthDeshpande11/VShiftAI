import { useState } from 'react';

import { parsePipeline } from '../services/pipelineApi';
import { useStore } from '../store/store';

export const PipelineSubmit = () => {
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await parsePipeline(nodes, edges);
      setResult(data);
      setIsOpen(true);
    } catch (err) {
      console.error('Error submitting pipeline:', err);
      setError(err.message || 'Failed to connect to the backend server.');
      setIsOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="action-dock">
        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Analyzing...' : 'Run Analysis'}
        </button>
      </div>

      {isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-header-text">
                <h3 className="modal-title">Pipeline Analysis</h3>
                <p className="modal-subtitle">Topology and structure report</p>
              </div>
              <button className="modal-close" onClick={() => setIsOpen(false)} aria-label="Close">
                ×
              </button>
            </div>

            <div className="modal-body">
              {error ? (
                <div className="modal-error">
                  <strong>Error:</strong> {error}
                  <p className="modal-error-hint">
                    Make sure the FastAPI backend server is running on port 8000.
                  </p>
                </div>
              ) : (
                <>
                  <div className="metric-grid">
                    <div className="metric-card">
                      <span className="metric-label">Nodes</span>
                      <span className="metric-value">{result?.num_nodes}</span>
                    </div>
                    <div className="metric-card">
                      <span className="metric-label">Edges</span>
                      <span className="metric-value">{result?.num_edges}</span>
                    </div>
                    <div className="metric-card metric-card--wide">
                      <span className="metric-label">Topology</span>
                      <span className={`dag-badge ${result?.is_dag ? 'success' : 'warning'}`}>
                        {result?.is_dag ? 'Valid DAG' : 'Contains Cycles'}
                      </span>
                    </div>
                  </div>
                  {!result?.is_dag && (
                    <p className="modal-warning">
                      Cycles detected in the pipeline structure.
                    </p>
                  )}
                </>
              )}
            </div>

            <button className="modal-btn" onClick={() => setIsOpen(false)}>
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
};

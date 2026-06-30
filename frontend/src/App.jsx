import { PipelineToolbar } from './components/PipelineToolbar';
import { PipelineCanvas } from './components/PipelineCanvas';
import { PipelineSubmit } from './components/PipelineSubmit';

function App() {
  return (
    <div className="app-container">
      <PipelineToolbar />
      <PipelineCanvas />
      <PipelineSubmit />
    </div>
  );
}

export default App;

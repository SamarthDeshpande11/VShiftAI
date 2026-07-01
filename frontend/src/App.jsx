import { useEffect, useState } from 'react';

import { PipelineToolbar } from './components/PipelineToolbar';
import { PipelineCanvas } from './components/PipelineCanvas';
import { PipelineSubmit } from './components/PipelineSubmit';

function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') {
      return 'light';
    }

    return window.localStorage.getItem('workflow-theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem('workflow-theme', theme);
  }, [theme]);

  return (
    <div className="app-container" data-theme={theme}>
      <PipelineToolbar />
      <PipelineCanvas />
      <PipelineSubmit
        theme={theme}
        onToggleTheme={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))}
      />
    </div>
  );
}

export default App;

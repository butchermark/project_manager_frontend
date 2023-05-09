import { ProjectManagerProvider } from "./context/ProjectManagerContext";
import { PageRouter } from "./router/PageRouter";

function App() {
  return (
    <div className="app">
      <ProjectManagerProvider>
        <PageRouter />
      </ProjectManagerProvider>
    </div>
  );
}

export default App;

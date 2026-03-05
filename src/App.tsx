import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnalysisProvider } from './contexts/AnalysisContext';
import Analysis from './pages/Analysis';
import Home from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* O Provider deve envolver a rota ou estar dentro do componente de página */}
        <Route 
          path="/analise" 
          element={
            <AnalysisProvider>
              <Analysis />
            </AnalysisProvider>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
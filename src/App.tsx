import { Routes, Route } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { Volunteers } from './pages/Volunteers';
import { Tasks } from './pages/Tasks';
import { Analytics } from './pages/Analytics';
import { useSimulation } from './hooks/useSimulation';
import { useApp } from './context/AppContext';

export default function App() {
  const { state } = useApp();
  useSimulation(state.simulationRunning);

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/volunteers" element={<Volunteers />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </>
  );
}

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import NewDiagnosis from './pages/NewDiagnosis';
import CaseLibrary from './pages/CaseLibrary';
import RuleChecker from './pages/RuleChecker';
import HumanReview from './pages/HumanReview';
import ResponsibleAILog from './pages/ResponsibleAILog';
import Analytics from './pages/Analytics';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/diagnose" element={<NewDiagnosis />} />
          <Route path="/cases" element={<CaseLibrary />} />
          <Route path="/checker" element={<RuleChecker />} />
          <Route path="/review" element={<HumanReview />} />
          <Route path="/ai-log" element={<ResponsibleAILog />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/about" element={<div className="p-8 text-xl">About Page - Under Construction</div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

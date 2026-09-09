import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TopBar from './components/TopBar.jsx';
import Landing from './components/Landing.jsx';
import TransactionQueue from './components/TransactionQueue.jsx';
import CaseDetail from './components/CaseDetail.jsx';

function App() {
  return (
    <BrowserRouter>
      <div className="page">
        <TopBar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/pack/:packId" element={<TransactionQueue />} />
          <Route path="/pack/:packId/case/:levelId" element={<CaseDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

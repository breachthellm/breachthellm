import TopBar from './components/TopBar.jsx';
import CaseHeader from './components/CaseHeader.jsx';
import LevelPage from './components/LevelPage.jsx';

const PACK_ID = 'veyra-shield';
const LEVEL_ID = '01-leak-the-rules';

function App() {
  return (
    <div className="page">
      <TopBar />
      <div className="case-panel">
        <CaseHeader />
        <LevelPage packId={PACK_ID} levelId={LEVEL_ID} />
      </div>
    </div>
  );
}

export default App;

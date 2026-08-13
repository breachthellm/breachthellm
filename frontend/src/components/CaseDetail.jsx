import { useParams } from 'react-router-dom';
import CaseHeader from './CaseHeader.jsx';
import LevelPage from './LevelPage.jsx';

const PACK_ID = 'veyra-shield';

function CaseDetail() {
  const { levelId } = useParams();

  return (
    <div className="review-panel">
      <CaseHeader />
      <LevelPage packId={PACK_ID} levelId={levelId} />
    </div>
  );
}

export default CaseDetail;

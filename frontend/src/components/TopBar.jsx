import { Link } from 'react-router-dom';

function TopBar() {
  return (
    <header className="platform-strip">
      <Link to="/" className="wordmark">
        <span className="wordmark-dot" />
        BREACH_THE_LLM
      </Link>
    </header>
  );
}

export default TopBar;

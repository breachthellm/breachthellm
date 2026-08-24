import { Link } from 'react-router-dom';

function TopBar() {
  return (
    <header className="platform-strip">
      <Link to="/" className="wordmark">
        <img src="/logo.svg" alt="" className="wordmark-mark" />
        BREACH_THE_LLM
      </Link>
    </header>
  );
}

export default TopBar;

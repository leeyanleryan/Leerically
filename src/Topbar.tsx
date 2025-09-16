import { Link } from 'react-router-dom';
import './Topbar.css';

const Topbar: React.FC = () => {
  return (
    <header className="topbar" role="banner">
      <div className="topbar_inner">
        <Link className="brand" to="/">LEERICALLY</Link>
        <form className="search" action="/search" role="search" method="get">
          <input type="search" name="q" placeholder="Search" aria-label="Search" />
        </form>
      </div>
    </header>
  );
};

export default Topbar;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Topbar.css';

const Topbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((open) => !open);

  return (
    <header className="topbar" role="banner">
      <div className="topbar_inner">
        <Link className="brand" to="/">LEERICALLY</Link>

        <nav className={`primary-nav${menuOpen ? ' open' : ''}`} aria-label="Primary">
          <Link to="/about">About</Link>
          <Link to="/featured">Featured</Link>
        </nav>

        <form className="search" action="/search" role="search" method="get">
          <input type="search" name="q" placeholder="Search" aria-label="Search" />
        </form>

        {/* <div className="auth">
          <a className="btn btn-ghost" href="/signin">Sign In</a>
          <a className="btn btn-cta" href="/signup">Sign Up</a>
        </div> */}

        <button className={`menu-btn${menuOpen ? ' open' : ''}`} aria-label="Toggle Menu" onClick={toggleMenu}>
          <i className="fa fa-bars"></i>
        </button>
      </div>
    </header>
  );
};

export default Topbar;
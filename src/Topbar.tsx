import React, { useState } from 'react';
import './Topbar.css';

const Topbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((open) => !open);

  return (
    <header className="topbar" role="banner">
      <div className="topbar_inner">
        <a className="brand" href="/">LEERICALLY</a>

        <nav className={`primary-nav${menuOpen ? ' open' : ''}`} aria-label="Primary">
          <a href="/about">About</a>
          <a href="/featured">Featured</a>
        </nav>

        <form className="search" action="/search" role="search" method="get">
          <input type="search" name="q" placeholder="Search" aria-label="Search" />
        </form>

        <div className="auth">
          <a className="btn btn-ghost" href="/signin">Sign In</a>
          <a className="btn btn-cta" href="/signup">Sign Up</a>
        </div>

        <button className={`menu-btn${menuOpen ? ' open' : ''}`} aria-label="Toggle Menu" onClick={toggleMenu}>
          <span style={{ fontSize: 24, color: 'var(--text)' }}>&#9776;</span>
        </button>
      </div>
    </header>
  );
};

export default Topbar;
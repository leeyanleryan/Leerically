import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Topbar.css';

const Topbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((open) => !open);

  return (
    <header className={`topbar${menuOpen ? ' open' : ''}`} role="banner">
      <div className="topbar-inner">
        <Link className="brand" to="/">LEERICALLY</Link>

        {menuOpen && <div className="menu-overlay" onClick={toggleMenu}></div>}

        <nav className={`primary-nav${menuOpen ? ' open' : ''}`} aria-label="Primary">
          <Link to="/about">About</Link>
          <Link to="/signin" className="hide">Sign In</Link>
          <Link to="/signup" className="hide">Sign Up</Link>
        </nav>

        <button className="bar-btn search" aria-label="Search">
          <Link to="/search"><i className="fa-solid fa-magnifying-glass"></i></Link>
        </button>

        <div className="auth">
          <Link to="/signin" className="btn btn-ghost">Sign In</Link>
          <Link to="/signup" className="btn btn-cta">Sign Up</Link>
        </div>

        <button className={`bar-btn menu${menuOpen ? ' open' : ''}`} aria-label="Toggle Menu" onClick={toggleMenu}>
          <i className="fa fa-bars"></i>
        </button>
      </div>
    </header>
  );
};

export default Topbar;
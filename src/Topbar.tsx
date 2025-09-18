import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Topbar.css';

const Topbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setMenuOpen((open) => !open);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        navRef.current &&
        overlayRef.current &&
        !navRef.current.contains(target) &&
        !overlayRef.current.contains(target)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  return (
    <header className={`topbar${menuOpen ? ' open' : ''}`} role="banner">
      {menuOpen && (<div id="menu-overlay" className="menu-overlay" ref={overlayRef}></div>)}
      <div className="topbar-inner" ref={navRef}>
        <Link to="/" className="brand" onClick={() => setMenuOpen(false)}>LEERICALLY</Link>
        <nav id="primary-nav" className={`primary-nav${menuOpen ? ' open' : ''}`} aria-label="Primary">
          <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
          <Link to="/signin" className="hide" onClick={() => setMenuOpen(false)}>Sign In</Link>
          <Link to="/signup" className="hide" onClick={() => setMenuOpen(false)}>Sign Up</Link>
        </nav>
        <button className="bar-btn search" aria-label="Search">
          <Link to="/search" onClick={() => setMenuOpen(false)}><i className="fa-solid fa-magnifying-glass"></i></Link>
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
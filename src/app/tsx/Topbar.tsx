import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import '../css/Topbar.css';

const Topbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const primaryNavRef = useRef<HTMLElement>(null);

  const toggleMenu = () => setMenuOpen((open) => !open);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        navRef.current &&
        primaryNavRef.current &&
        !navRef.current.contains(target) &&
        !primaryNavRef.current.contains(target)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  return (
    <header className={`topbar${menuOpen ? ' open' : ''}`} role="banner" ref={navRef}>
      <div className="topbar-inner">
        <Link href="/" className="brand" onClick={() => setMenuOpen(false)}>
          <Image src="/favicon-big.webp" alt="Leerically Logo" height="24" width="24" />
          LEERICALLY
        </Link>
        <nav
          id="primary-nav"
          className={`primary-nav${menuOpen ? ' open' : ''}`}
          aria-label="Primary"
          ref={primaryNavRef}
        >
          <Link href="/about" onClick={() => setMenuOpen(false)}>About</Link>
          <Link href="/sign-in" className="hide" onClick={() => setMenuOpen(false)}>Sign In</Link>
          <Link href="/sign-up" className="hide" onClick={() => setMenuOpen(false)}>Sign Up</Link>
        </nav>
        <Link href="/search" onClick={() => setMenuOpen(false)} className="bar-btn search"><i className="fa-solid fa-magnifying-glass"></i></Link>
        <div className="auth">
          <Link href="/sign-in" className="btn btn-ghost">Sign In</Link>
          <Link href="/sign-up" className="btn btn-cta">Sign Up</Link>
        </div>
        <button className={`bar-btn menu${menuOpen ? ' open' : ''}`} aria-label="Toggle Menu" onClick={toggleMenu}>
          <i className="fa fa-bars"></i>
        </button>
      </div>
    </header>
  );
};

export default Topbar;
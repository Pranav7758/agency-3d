import React from 'react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar__container">
        <Link href="/" className="navbar__logo">
          <span>DIGI MIRAI</span>
        </Link>
        <ul className="navbar__links">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/#about">About</Link></li>
          <li><Link href="/#services">Services</Link></li>
          <li><Link href="/#our-work">Our Work</Link></li>
          <li><Link href="/#contact">Contact</Link></li>
        </ul>
        <div className="navbar__cta">
          <Link href="/#contact" className="cta_btn cta_btn--small">Start a Project</Link>
        </div>
      </div>
    </nav>
  );
}

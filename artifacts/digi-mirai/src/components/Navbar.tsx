import React from 'react';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar__container">
        <a href="/" className="navbar__logo">
          <span>DIGI MIRAI</span>
        </a>
        <ul className="navbar__links">
          <li><a href="/">Home</a></li>
          <li><a href="/#about">About</a></li>
          <li><a href="/#services">Services</a></li>
          <li><a href="/#our-work">Our Work</a></li>
          <li><a href="/#contact">Contact</a></li>
        </ul>
        <div className="navbar__cta">
          <a href="/#contact" className="cta_btn cta_btn--small">Start a Project</a>
        </div>
      </div>
    </nav>
  );
}

"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    if (!footerRef.current) return;

    gsap.fromTo(footerRef.current.children, 
      { y: 100, opacity: 0 },
      { 
        y: 0, opacity: 1, duration: 1.5, stagger: 0.2, ease: "power3.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 90%",
        }
      }
    );
  }, []);

  return (
    <footer ref={footerRef} className="agency_footer">
      <div className="footer_top">
        <div className="footer_brand">
          <h2>Transform your brand today!</h2>
          <p className="footer_subtitle">Let's talk about your project.</p>
          <div className="newsletter_form">
            <p>Join our newsletter</p>
            <div className="input_group">
              <input type="email" placeholder="Email Address" />
              <button>Subscribe</button>
            </div>
          </div>
        </div>
        <div className="footer_links">
          <div className="link_column">
            <h3>Connect with us</h3>
            <a href="mailto:info@digimirai.com">📧 info@digimirai.com</a>
            <a href="tel:+917588294511">💬 +91 7588294511</a>
            <a href="tel:+919923335681">💬 +91 9923335681</a>
          </div>
          <div className="link_column">
            <h3>Address</h3>
            <p>🌍 Digi Mirai Near Ganga Hospital,<br/>Malegaon, Maharashtra 423203</p>
            <p>🕒 Monday → Friday 9am to 5pm</p>
          </div>
          <div className="link_column">
            <h3>Follow us</h3>
            <a href="#">Facebook</a>
            <a href="#">Twitter</a>
            <a href="#">Instagram</a>
            <a href="#">LinkedIn</a>
          </div>
        </div>
      </div>
      <div className="footer_bottom">
        <p>Copyright © 2024 Digi Mirai - Digital Marketing Agency</p>
        <div className="legal_links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}

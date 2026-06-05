import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

export default function ServicesScroll() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!sectionRef.current || !wrapperRef.current) return;

    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        pin: true,
        scrub: 1,
        start: "top top",
        end: () => "+=" + wrapperRef.current!.offsetWidth,
      }
    });

    tl.to(wrapperRef.current, {
      xPercent: -100,
      ease: "none"
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  const services = [
    { title: "Web Development", desc: "Crafting beautiful, robust, and scalable web applications tailored to your business." },
    { title: "Social Media Marketing", desc: "Engaging your audience and building brand loyalty across all social platforms." },
    { title: "Brand Identity", desc: "Creating memorable logos and visual systems that define who you are." },
    { title: "SEO Optimization", desc: "Dominating search rankings to drive organic, high-converting traffic." },
    { title: "App Development", desc: "Building native and cross-platform mobile apps for iOS and Android." },
    { title: "UI/UX Design", desc: "Designing intuitive interfaces and delightful user experiences." },
  ];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Update CSS variables for the radial gradient glow
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);

    // Calculate 3D tilt
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10; // Max tilt 10deg
    const rotateY = ((x - centerX) / centerX) * 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };

  return (
    <section ref={sectionRef} className="services_horizontal_section">
      <div className="services_title_fixed">
        <h2>Our Services</h2>
      </div>
      <div className="services_scroll_wrapper" ref={wrapperRef}>
        <div className="services_scroll_content">
          {services.map((service, idx) => (
            <div 
              key={idx} 
              className="service_card"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <h3>{service.title}</h3>
              <p>{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

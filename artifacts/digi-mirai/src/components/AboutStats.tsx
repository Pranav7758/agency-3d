import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";

export default function AboutStats() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!sectionRef.current || !statsRef.current) return;

    const statElements = statsRef.current.querySelectorAll('.stat_number');

    statElements.forEach((el) => {
      const targetVal = parseInt(el.getAttribute('data-target') || '0', 10);

      gsap.to(el, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
        innerHTML: targetVal,
        duration: 2,
        ease: "power2.out",
        snap: { innerHTML: 1 },
        onUpdate: function () {
          el.innerHTML = Math.round(Number(this.targets()[0].innerHTML)) + "+";
        }
      });
    });

    gsap.fromTo(statsRef.current.children,
      { y: 50, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        }
      }
    );

  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <section ref={sectionRef} className="about_bento_section">
      <div className="bento_grid" ref={statsRef}>

        {/* Main Content Card (Spans 2 columns) */}
        <div className="bento_item bento_main" onMouseMove={handleMouseMove}>
          <h2>About <span>DIGI MIRAI</span></h2>
          <p>
            Digi Mirai blends design, technology, and marketing to create impactful digital experiences that drive success and elevate your brand in the digital world.
            <br /><br />
            Transforming Your Brand with Digi Mirai Design, Technology and Marketing for Digital Success.
          </p>
        </div>

        {/* Stat Cards */}
        <div className="bento_item stat_item" onMouseMove={handleMouseMove}>
          <span className="stat_number" data-target="50">0</span>
          <span className="stat_label">Successful Projects</span>
        </div>

        <div className="bento_item stat_item" onMouseMove={handleMouseMove}>
          <span className="stat_number" data-target="12">0</span>
          <span className="stat_label">Years in business</span>
        </div>

        <div className="bento_item stat_item" onMouseMove={handleMouseMove}>
          <span className="stat_number" data-target="12">0</span>
          <span className="stat_label">Team Members</span>
        </div>

        <div className="bento_item stat_item" onMouseMove={handleMouseMove}>
          <span className="stat_number" data-target="10">0</span>
          <span className="stat_label">Ongoing Projects</span>
        </div>

      </div>
    </section>
  );
}

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import { ArrowRight, Palette, Code2, TrendingUp, Smartphone, PenTool, Share2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
  bullets: string[];
}

const services: Service[] = [
  {
    icon: Palette,
    title: "Brand Identity",
    description: "Distinctive visual systems that define who you are and what you stand for.",
    bullets: ["Logo Design", "Visual Identity"],
  },
  {
    icon: Code2,
    title: "Web Development",
    description: "Fast, beautiful web products built for performance and scale.",
    bullets: ["React & Next.js", "Full-Stack"],
  },
  {
    icon: TrendingUp,
    title: "SEO & Growth",
    description: "Engineer your organic presence and dominate search rankings.",
    bullets: ["Technical SEO", "Analytics"],
  },
  {
    icon: Smartphone,
    title: "App Development",
    description: "Polished iOS and Android apps built to scale with your users.",
    bullets: ["React Native", "iOS & Android"],
  },
  {
    icon: PenTool,
    title: "UI / UX Design",
    description: "Research-backed design that converts visitors into customers.",
    bullets: ["Figma Prototyping", "User Research"],
  },
  {
    icon: Share2,
    title: "Social Media",
    description: "Grow your audience and build brand loyalty across all platforms.",
    bullets: ["Content Strategy", "Paid Social"],
  },
];

// Arc offsets: rotate + translateY for the fan effect
const arc = [
  { r: -14, y: 110 },
  { r:  -7, y:  40 },
  { r:  -2, y:   6 },
  { r:   2, y:   6 },
  { r:   7, y:  40 },
  { r:  14, y: 110 },
];

export default function ServicesCarousel() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs   = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!sectionRef.current) return;

    gsap.fromTo(
      sectionRef.current.querySelectorAll(".fan_tag, .fan_title, .fan_sub"),
      { opacity: 0, y: 50 },
      {
        opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      }
    );

    gsap.fromTo(
      cardRefs.current,
      { opacity: 0, y: 100, scale: 0.88 },
      {
        opacity: 1, y: 0, scale: 1, duration: 1, stagger: 0.1,
        ease: "back.out(1.3)",
        scrollTrigger: { trigger: sectionRef.current, start: "top 65%" },
      }
    );
  }, []);

  return (
    <section className="fan_section" id="services" ref={sectionRef}>
      {/* Stars / space background overlay */}
      <div className="fan_space_bg" aria-hidden />

      {/* Glowing Earth centered behind the cards */}
      <div className="fan_earth_system" aria-hidden>
        <div className="fan_earth_atmo_outer" />
        <div className="fan_earth_wrap">
          <img
            className="fan_earth_img"
            src="https://images.unsplash.com/photo-1614732414444-096e5f1122d5?auto=format&fit=crop&w=1000&q=80"
            alt=""
            draggable={false}
          />
          <div className="fan_earth_rim" />
        </div>
      </div>

      {/* Header */}
      <header className="fan_header">
        <span className="fan_tag">What we do</span>
        <h2 className="fan_title">Explore Our Services</h2>
        <p className="fan_sub">Elevate your digital presence to new heights.</p>
      </header>

      {/* Fan of glass cards */}
      <div className="fan_cards" aria-label="Services">
        {services.map((svc, i) => {
          const Icon = svc.icon;
          return (
            <div
              key={i}
              className="fan_card"
              ref={(el) => { if (el) cardRefs.current[i] = el; }}
              style={{
                "--r": `${arc[i].r}deg`,
                "--ty": `${arc[i].y}px`,
              } as React.CSSProperties}
            >
              {/* Glass layers */}
              <div className="fan_card_bg"   aria-hidden />
              <div className="fan_card_glow" aria-hidden />
              <div className="fan_card_border" aria-hidden />

              {/* Content */}
              <div className="fan_card_inner">
                <div className="fan_card_icon_wrap">
                  <Icon size={26} strokeWidth={1.4} />
                </div>
                <h3 className="fan_card_title">{svc.title}</h3>
                <p  className="fan_card_desc">{svc.description}</p>
                <ul className="fan_card_bullets">
                  {svc.bullets.map((b, j) => (
                    <li key={j}>{b}</li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <a href="/#contact" className="fan_cta_btn">
        View All Services <ArrowRight size={16} />
      </a>
    </section>
  );
}

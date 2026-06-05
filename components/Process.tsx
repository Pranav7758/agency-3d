"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import "../styles/components/process.css";

const steps = [
  {
    title: "Discovery & Strategy",
    desc: "In Digi Mirai We understand your business, goals, and target audience to create a tailored roadmap."
  },
  {
    title: "Design & Development",
    desc: "Our team brings your vision to life with creative design and robust web development."
  },
  {
    title: "Testing & Launch",
    desc: "We ensure functionality, performance, and user experience before launching your website."
  },
  {
    title: "Marketing & Support",
    desc: "Post-launch, we implement marketing strategies and provide ongoing support for continuous growth."
  }
];

export default function Process() {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!containerRef.current || !progressRef.current) return;

    // Animate the vertical line drawing down
    gsap.fromTo(progressRef.current,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top center",
          end: "bottom center",
          scrub: true,
        }
      }
    );

    // Stagger in the steps as you scroll
    stepsRef.current.forEach((step, i) => {
      if (!step) return;

      gsap.fromTo(step,
        { opacity: 0, x: 50 },
        {
          opacity: 1, x: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: step,
            start: "top 75%",
          }
        }
      );

      // Add 'active' class when the line reaches it
      ScrollTrigger.create({
        trigger: step,
        start: "top center",
        onEnter: () => step.classList.add("active"),
        onLeaveBack: () => step.classList.remove("active")
      });
    });

  }, []);

  return (
    <section className="process_section">
      <div className="process_header">
        <h2>PROCESS</h2>
        <p>Our process combines discovery, strategy, design, development, marketing, and ongoing support to ensure your digital success.</p>
      </div>

      <div className="timeline_container" ref={containerRef}>
        <div className="timeline_line_bg"></div>
        <div className="timeline_progress" ref={progressRef}></div>

        {steps.map((step, idx) => (
          <div
            key={idx}
            className="process_step"
            ref={el => { stepsRef.current[idx] = el; }}
          >
            <div className="step_marker">
              0{idx + 1}
            </div>
            <div className="step_content">
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

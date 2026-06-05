"use client";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import "../styles/components/our-work.css";

const projects = [
  {
    title: "CA Karishma Singhavi",
    tags: ["Web Development", "Wireframe & Prototyping"],
    bg: "radial-gradient(circle at top left, rgba(74, 150, 232, 0.2), transparent)"
  },
  {
    title: "Abhijeet Bhosale Engineers & Consultants",
    tags: ["Web Development"],
    bg: "radial-gradient(circle at top right, rgba(183, 33, 255, 0.2), transparent)"
  },
  {
    title: "Spartan Podar Learn School, Malegaon",
    tags: ["Web Development", "SEO", "Digital Presence"],
    bg: "radial-gradient(circle at bottom left, rgba(33, 212, 253, 0.2), transparent)"
  },
  {
    title: "Takshila International School",
    tags: ["Web Development", "Web Design"],
    bg: "radial-gradient(circle at bottom right, rgba(244, 208, 63, 0.2), transparent)"
  },
  {
    title: "Yaseen Global Foundation",
    tags: ["Web Development", "Digital Presence"],
    bg: "radial-gradient(circle at center, rgba(238, 9, 121, 0.15), transparent)"
  },
  {
    title: "CA SB CHHAJED AND ASSOCIATES",
    tags: ["Front-End Development", "Backend"],
    bg: "radial-gradient(circle at top left, rgba(17, 205, 239, 0.2), transparent)"
  }
];

export default function OurWork() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section className="our_work_section" id="our-work" ref={sectionRef}>
      <div className="our_work_header">
        <h2>Our work.</h2>
        <p>Projects, we are proud of</p>
      </div>

      <motion.div
        className="portfolio_grid"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {projects.map((project, idx) => (
          <motion.div key={idx} variants={itemVariants} className="portfolio_card">
            <div className="card_gradient_bg" style={{ position: 'absolute', inset: 0, background: project.bg }}></div>

            <div className="project_arrow">
              <ArrowUpRight size={24} />
            </div>

            <div className="project_content">
              <h3 className="project_title">{project.title}</h3>
              <div className="project_tags">
                {project.tags.map((tag, i) => (
                  <span key={i} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

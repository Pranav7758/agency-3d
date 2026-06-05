import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    number: "01",
    title: "CA Karishma Singhavi",
    subtitle: "Chartered Accountant",
    tags: ["Web Development", "Wireframe & Prototyping"],
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80",
  },
  {
    number: "02",
    title: "Abhijeet Bhosale Engineers",
    subtitle: "Engineering & Consultants",
    tags: ["Web Development"],
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80",
  },
  {
    number: "03",
    title: "Spartan Podar Learn School",
    subtitle: "Malegaon",
    tags: ["Web Development", "SEO", "Digital Presence"],
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80",
  },
  {
    number: "04",
    title: "Takshila International School",
    subtitle: "Web & Design",
    tags: ["Web Development", "Web Design"],
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80",
  },
  {
    number: "05",
    title: "Yaseen Global Foundation",
    subtitle: "Non-Profit Organisation",
    tags: ["Web Development", "Digital Presence"],
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=800&q=80",
  },
  {
    number: "06",
    title: "CA SB Chhajed & Associates",
    subtitle: "Financial Services",
    tags: ["Front-End Development", "Backend"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
  },
];

export default function OurWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const previewImgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!sectionRef.current) return;

    gsap.fromTo(
      sectionRef.current.querySelectorAll(".ow_head_title, .ow_head_sub"),
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      }
    );

    gsap.fromTo(
      sectionRef.current.querySelectorAll(".ow_row"),
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.65,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
      }
    );
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!previewRef.current || !sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    gsap.to(previewRef.current, {
      x: e.clientX - rect.left + 36,
      y: e.clientY - rect.top - 130,
      duration: 0.55,
      ease: "power2.out",
    });
  };

  const handleRowEnter = (image: string) => {
    if (previewImgRef.current) previewImgRef.current.src = image;
    gsap.to(previewRef.current, {
      autoAlpha: 1,
      scale: 1,
      duration: 0.35,
      ease: "power3.out",
    });
  };

  const handleRowLeave = () => {
    gsap.to(previewRef.current, {
      autoAlpha: 0,
      scale: 0.9,
      duration: 0.22,
      ease: "power2.in",
    });
  };

  return (
    <section
      className="our_work_section"
      id="our-work"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
    >
      {/* Floating cursor preview card */}
      <div className="ow_preview" ref={previewRef}>
        <img ref={previewImgRef} alt="" className="ow_preview_img" />
        <div className="ow_preview_shine" />
      </div>

      <div className="ow_head">
        <h2 className="ow_head_title">Our Work.</h2>
        <p className="ow_head_sub">Projects we are proud of.</p>
      </div>

      <div className="ow_list">
        {projects.map((project, i) => (
          <div
            key={i}
            className="ow_row"
            onMouseEnter={() => handleRowEnter(project.image)}
            onMouseLeave={handleRowLeave}
          >
            <span className="ow_row_num">{project.number}</span>

            <div className="ow_row_body">
              <h3 className="ow_row_title">{project.title}</h3>
              <p className="ow_row_subtitle">{project.subtitle}</p>
            </div>

            <div className="ow_row_tags">
              {project.tags.map((tag, j) => (
                <span key={j} className="ow_tag">{tag}</span>
              ))}
            </div>

            <div className="ow_row_arrow">
              <ArrowUpRight size={17} />
            </div>
          </div>
        ))}
      </div>

      <div className="ow_cta_row">
        <a href="/#contact" className="ow_cta_btn">
          Start your project <ArrowUpRight size={16} />
        </a>
      </div>
    </section>
  );
}

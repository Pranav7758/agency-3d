import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import { Plus, Minus, ArrowRight } from "lucide-react";

export interface Service {
  number: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
}

const services: Service[] = [
  {
    number: "01",
    title: "Brand Identity",
    description:
      "We craft distinctive visual systems that tell your brand's story — logos, typography, colour palettes, and the strategic thinking that ties it all together into something people remember.",
    image:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80",
    tags: ["Logo Design", "Visual Identity", "Brand Strategy"],
  },
  {
    number: "02",
    title: "Web Development",
    description:
      "From landing pages to full-stack platforms, we build fast, beautiful, and scalable web products. Every line of code is crafted with performance and user experience at its core.",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80",
    tags: ["React", "Next.js", "Full-Stack"],
  },
  {
    number: "03",
    title: "SEO & Growth",
    description:
      "We engineer your organic presence from the ground up — technical audits, content strategy, link building, and rank tracking so you dominate search and compound growth over time.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80",
    tags: ["Technical SEO", "Content Strategy", "Analytics"],
  },
  {
    number: "04",
    title: "App Development",
    description:
      "Native iOS and Android apps, or cross-platform with React Native — built with polished UI and robust architecture that scales as your user base grows.",
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80",
    tags: ["iOS", "Android", "React Native"],
  },
  {
    number: "05",
    title: "UI / UX Design",
    description:
      "Research-backed design that converts. We map user journeys, prototype interactions, and craft interfaces your users will love — from wireframe to pixel-perfect delivery.",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80",
    tags: ["Figma", "Prototyping", "User Research"],
  },
  {
    number: "06",
    title: "Social Media",
    description:
      "We build and manage your presence across every platform — content calendars, creative assets, community management, and paid social campaigns that grow your audience.",
    image:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80",
    tags: ["Instagram", "LinkedIn", "Paid Social"],
  },
];

interface ServiceRowProps {
  service: Service;
  isOpen: boolean;
  isFirst: boolean;
  onToggle: () => void;
}

const ServiceRow = ({ service, isOpen, isFirst, onToggle }: ServiceRowProps) => {
  const bodyRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const didMount = useRef(false);

  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;

    if (!didMount.current) {
      didMount.current = true;
      if (isOpen) {
        gsap.set(body, { height: "auto", opacity: 1 });
      }
      return;
    }

    if (isOpen) {
      gsap.set(body, { height: "auto", opacity: 1 });
      gsap.from(body, { height: 0, opacity: 0, duration: 0.55, ease: "power3.out" });
      if (imgRef.current) {
        gsap.fromTo(
          imgRef.current,
          { scale: 1.08, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.65, delay: 0.1, ease: "power3.out" }
        );
      }
    } else {
      gsap.to(body, { height: 0, opacity: 0, duration: 0.38, ease: "power3.in" });
    }
  }, [isOpen]);

  return (
    <div className={`svc_row${isOpen ? " active" : ""}`}>
      <div className="svc_row_trigger" onClick={onToggle} role="button" aria-expanded={isOpen}>
        <span className="svc_row_num">{service.number}</span>
        <h3 className="svc_row_title">{service.title}</h3>
        <div className="svc_row_icon">
          {isOpen ? <Minus size={16} /> : <Plus size={16} />}
        </div>
      </div>

      <div className="svc_row_body" ref={bodyRef}>
        <div className="svc_row_body_inner">
          <div className="svc_row_left">
            <p className="svc_row_desc">{service.description}</p>
            <div className="svc_row_tags">
              {service.tags.map((tag) => (
                <span className="svc_tag" key={tag}>{tag}</span>
              ))}
            </div>
          </div>
          <div className="svc_row_right">
            <div className="svc_img_wrapper">
              <img
                src={service.image}
                alt={service.title}
                className="svc_img"
                ref={imgRef}
              />
              <div className="svc_img_shine" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ServicesCarousel() {
  const sectionRef = useRef<HTMLElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (i: number) => {
    setOpenIndex((prev) => (prev === i ? null : i));
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!sectionRef.current) return;

    gsap.fromTo(
      sectionRef.current.querySelectorAll(".svc_head_title, .svc_head_sub"),
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
      sectionRef.current.querySelectorAll(".svc_row"),
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
      }
    );
  }, []);

  return (
    <section className="services_section" id="services" ref={sectionRef}>
      <div className="svc_head">
        <h2 className="svc_head_title">Services.</h2>
        <p className="svc_head_sub">
          Everything you need to<br />dominate your market.
        </p>
      </div>

      <div className="svc_list">
        {services.map((service, i) => (
          <ServiceRow
            key={i}
            service={service}
            isOpen={openIndex === i}
            isFirst={i === 0}
            onToggle={() => handleToggle(i)}
          />
        ))}
      </div>

      <div className="svc_cta_row">
        <a href="/#contact" className="svc_cta_btn">
          Start a project <ArrowRight size={16} />
        </a>
      </div>
    </section>
  );
}

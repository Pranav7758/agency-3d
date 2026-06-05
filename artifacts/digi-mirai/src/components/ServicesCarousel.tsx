
import React, { useCallback, useEffect, useState, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

// Define the data for the services
export interface Service {
  number: string;
  title: string;
  description: string;
  image: string;
  gradient: string;
}

const services: Service[] = [
  {
    number: "001",
    title: "Brand Identity",
    description: "Creating memorable logos and visual systems that define who you are.",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80",
    gradient: "linear-gradient(135deg, rgba(74, 150, 232, 0.4), rgba(11, 49, 120, 0.4))",
  },
  {
    number: "002",
    title: "Web Development",
    description: "Crafting beautiful, robust, and scalable web applications tailored to your business.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80",
    gradient: "linear-gradient(135deg, rgba(33, 212, 253, 0.4), rgba(183, 33, 255, 0.4))",
  },
  {
    number: "003",
    title: "SEO Optimization",
    description: "Dominating search rankings to drive organic, high-converting traffic.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80",
    gradient: "linear-gradient(135deg, rgba(244, 208, 63, 0.4), rgba(22, 160, 133, 0.4))",
  },
  {
    number: "004",
    title: "App Development",
    description: "Building native and cross-platform mobile apps for iOS and Android.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80",
    gradient: "linear-gradient(135deg, rgba(255, 106, 0, 0.4), rgba(238, 9, 121, 0.4))",
  },
  {
    number: "005",
    title: "UI/UX Design",
    description: "Designing intuitive interfaces and delightful user experiences.",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80",
    gradient: "linear-gradient(135deg, rgba(17, 205, 239, 0.4), rgba(17, 113, 239, 0.4))",
  },
  {
    number: "006",
    title: "Social Media",
    description: "Engaging your audience and building brand loyalty across all social platforms.",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80",
    gradient: "linear-gradient(135deg, rgba(131, 58, 180, 0.4), rgba(253, 29, 29, 0.4))",
  }
];

const ServiceCard = ({ service }: { service: Service }) => {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  return (
    <div className="service_carousel_card" onMouseMove={handleMouseMove}>
      <div className="card_gradient_overlay" style={{ background: service.gradient }}></div>
      <div className="card_cursor_glow"></div>
      <div className="card_content">
        <div className="card_image_container">
          <img src={service.image} alt={service.title} className="card_image" />
        </div>
        <div className="card_text">
          <div className="card_number_backdrop">{service.number}</div>
          <h3 className="card_title">{service.title}</h3>
          <p className="card_desc">{service.description}</p>
        </div>
      </div>
    </div>
  );
};

export default function ServicesCarousel() {
  const sectionRef = useRef<HTMLElement>(null);
  
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [canScrollNext, setCanScrollNext] = useState(true);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setCanScrollNext(emblaApi.canScrollNext());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    if (!sectionRef.current) return;

    // Animate Header
    gsap.fromTo(
      sectionRef.current.querySelector('.services_carousel_header h2'),
      { opacity: 0, y: 100 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        }
      }
    );

    // Stagger Animate Cards
    const slides = sectionRef.current.querySelectorAll('.embla__slide');
    gsap.fromTo(
      slides,
      { opacity: 0, y: 150 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: "back.out(1.2)",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        }
      }
    );
    
    // Animate Button
    gsap.fromTo(
      sectionRef.current.querySelector('.carousel_next_btn'),
      { opacity: 0, scale: 0 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        delay: 0.5,
        ease: "elastic.out(1, 0.5)",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        }
      }
    );
  }, []);

  return (
    <section className="services_carousel_section" id="services" ref={sectionRef}>
      <div className="services_carousel_header">
        <h2>Services.</h2>
      </div>

      <div className="carousel_container">
        <div className="embla" ref={emblaRef}>
          <div className="embla__container">
            {services.map((service, index) => (
              <div className="embla__slide" key={index}>
                <ServiceCard service={service} />
              </div>
            ))}
          </div>
        </div>

        <button
          className="carousel_next_btn"
          onClick={scrollNext}
          disabled={!canScrollNext}
          aria-label="Next Slide"
        >
          <ArrowRight size={24} />
        </button>
      </div>

      <div className="services_cta_row">
        <a href="/#contact" className="services_see_all_btn">
          View all services <ArrowRight size={16} />
        </a>
      </div>
    </section>
  );
}

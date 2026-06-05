import { useEffect, useRef } from "react";
import initPlanet3D from "@/components/3D/planet";
import AnimatedShaderBackground from "@/components/AnimatedShaderBackground";
import BrandsMarquee from "@/components/BrandsMarquee";
import ServicesCarousel from "@/components/ServicesCarousel";
import AboutStats from "@/components/AboutStats";
import OurWork from "@/components/OurWork";
import Process from "@/components/Process";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.className = "planet-3D";
    containerRef.current.appendChild(canvas);

    const result = initPlanet3D(canvas);
    const { scene, renderer, timeline, tickerFunc, resizeFunc, observer } = result;

    if (!renderer) {
      if (containerRef.current && canvas.parentNode === containerRef.current) {
        containerRef.current.removeChild(canvas);
      }
      return;
    }

    return () => {
      if (observer) observer.disconnect();
      if (timeline) {
        timeline.scrollTrigger?.kill();
        timeline.kill();
      }
      import("gsap").then(gsap => {
        gsap.default.ticker.remove(tickerFunc);
      });
      window.removeEventListener("resize", resizeFunc);
      if (renderer) {
        const gl = renderer.getContext();
        if (gl) gl.getExtension("WEBGL_lose_context")?.loseContext();
        renderer.dispose();
      }
      if (containerRef.current && canvas.parentNode === containerRef.current) {
        containerRef.current.removeChild(canvas);
      }
    };
  }, []);

  return (
    <div className="page">
      <div className="global_3d_background">
        <AnimatedShaderBackground />
        <div ref={containerRef} className="planet_fixed_container" />
        <div className="global_dim_overlay"></div>
      </div>

      <section className="hero_main">
        <div className="content">
          <h1>Drive Your Business Forward with <span>DIGI MIRAI</span></h1>
          <p>
            Expert Digital Marketing Solutions to elevate your brand identity, SEO, and social media presence.
          </p>
          <button className="cta_btn">Start a Project</button>
        </div>

        <div className="hero-side left-side">
          <h3>250% Growth</h3>
          <p>Proven Traffic Generation</p>
          <div className="side-divider"></div>
          <h3>50+ Clients</h3>
          <p>Global Brand Satisfaction</p>
        </div>

        <div className="hero-side right-side">
          <h3>SEO Mastery</h3>
          <p>Dominate Search Rankings</p>
          <div className="side-divider"></div>
          <h3>Premium UI/UX</h3>
          <p>High-Converting Designs</p>
        </div>
      </section>

      <section id="brands">
        <BrandsMarquee />
      </section>

      <section id="services">
        <ServicesCarousel />
      </section>

      <section id="about">
        <AboutStats />
      </section>

      <section id="our-work">
        <OurWork />
      </section>

      <section id="process">
        <Process />
      </section>

      <section id="testimonials">
        <Testimonials />
      </section>

      <section id="contact">
        <Footer />
      </section>
    </div>
  );
}

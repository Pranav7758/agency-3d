"use client"
import { useEffect, useRef } from "react";
import initPlanet3D from "@/components/3D/planet";

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const canvas = document.createElement("canvas");
    canvas.className = "planet-3D";
    containerRef.current.appendChild(canvas);
    
    const {scene, renderer, timeline, tickerFunc, resizeFunc} = initPlanet3D(canvas);
    return () => {
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
        gl.getExtension("WEBGL_lose_context")?.loseContext();
        renderer.dispose();
      }
      if (containerRef.current && canvas.parentNode === containerRef.current) {
        containerRef.current.removeChild(canvas);
      }
    };
  }, []);

  return (
    <div className="page">
      <section className="hero_main">
        <div className="content" style={{ zIndex: 2 }}>
          <h1>About <span>DIGI MIRAI</span></h1>
          <p>We are a forward-thinking digital marketing agency dedicated to growing your business.</p>
        </div>
        <div ref={containerRef} className="planet-container" style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} />
      </section>
    </div>
  );
}

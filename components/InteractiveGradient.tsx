"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fluidShader = `
  precision highp float;

  uniform float iTime;
  uniform vec2 iResolution;
  uniform vec4 iMouse; // x, y, prevX, prevY (in pixels). z>0 when active
  uniform int iFrame;
  uniform sampler2D iPreviousFrame;
  uniform float uBrushSize;
  uniform float uBrushStrength;
  uniform float uFluidDecay;
  uniform float uTrailLength;
  uniform float uStopDecay;

  varying vec2 vUv;

  float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
  }

  void main() {
    vec2 uv = vUv;
    vec2 frag = uv * iResolution;

    vec4 prev = texture2D(iPreviousFrame, uv);

    if (iFrame < 1) {
      float q = length((frag - 0.5 * iResolution) );
      float w = 0.1 + 0.5 * sin(0.001 * frag.x);
      gl_FragColor = vec4( (0.5 + 0.5 * sin(0.001 * frag.y)) * 0.05, 0.0, 0.0, w );
      return;
    }

    vec2 offs = vec2(1.0) / iResolution;
    vec4 n = texture2D(iPreviousFrame, uv + vec2(0.0, offs.y));
    vec4 e = texture2D(iPreviousFrame, uv + vec2(offs.x, 0.0));
    vec4 s = texture2D(iPreviousFrame, uv - vec2(0.0, offs.y));
    vec4 w = texture2D(iPreviousFrame, uv - vec2(offs.x, 0.0));

    vec2 velocity = prev.xy + 0.25 * (n.xy + e.xy + s.xy + w.xy - 4.0 * prev.xy);

    velocity *= uFluidDecay;
    float trail = prev.z * uTrailLength;

    if (iMouse.z > 0.0) {
      vec2 mousePos = iMouse.xy;
      vec2 mousePrev = iMouse.zw;
      vec2 p = frag;
      vec2 m = mousePos;
      float dist = length(p - m);
      float brush = clamp(uBrushSize, 1.0, 200.0);
      float influence = exp(- (dist * dist) / (brush * brush));
      vec2 mouseVel = (mousePos - mousePrev);
      velocity += uBrushStrength * influence * (mouseVel / max(length(mouseVel), 0.0001)) * 0.8;
      trail += uBrushStrength * influence * 0.8;
      
      if (length(mouseVel) < 1.0) {
        float cursorDecay = mix(1.0, uStopDecay, influence);
        velocity *= cursorDecay;
        trail *= cursorDecay;
      }
    }

    vec4 outCol = vec4(velocity.xy, trail, 1.0);
    outCol = clamp(outCol, -1.0, 1.0);
    gl_FragColor = outCol;
  }
`;

const displayShader = `
  precision highp float;

  uniform float iTime;
  uniform vec2 iResolution;
  uniform sampler2D iFluid;
  uniform float uDistortionAmount;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform vec3 uColor4;
  uniform float uColorIntensity;
  uniform float uSoftness;

  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    vec2 frag = uv * iResolution;

    vec4 fluid = texture2D(iFluid, uv);
    vec2 fluidVel = fluid.xy;

    float mr = min(iResolution.x, iResolution.y);
    vec2 nuv = (frag * 2.0 - iResolution) / mr;

    nuv += fluidVel * (0.5 * uDistortionAmount);

    float a = 0.0;
    float d = -iTime * 0.5;
    for (float i = 0.0; i < 6.0; i++) {
      a += cos(i - d - a * nuv.x);
      d += sin(nuv.y * (i + 1.0) + a);
    }

    float mixer1 = cos(nuv.x * d) * 0.5 + 0.5;
    float mixer2 = cos(nuv.y * a) * 0.5 + 0.5;
    float mixer3 = sin(d + a) * 0.5 + 0.5;

    float smoothAmount = clamp(uSoftness * 0.1, 0.0, 0.9);
    mixer1 = mix(mixer1, 0.5, smoothAmount);
    mixer2 = mix(mixer2, 0.5, smoothAmount);
    mixer3 = mix(mixer3, 0.5, smoothAmount);

    vec3 col = mix(uColor1, uColor2, mixer1);
    col = mix(col, uColor3, mixer2);
    col = mix(col, uColor4, mixer3 * 0.4);

    col *= uColorIntensity;

    gl_FragColor = vec4(col, 1.0);
  }
`;

const config = {
  brushSize: 50.0,
  brushStrength: 0.6,
  distortionAmount: 2.5,
  fluidDecay: 0.97,
  trailLength: 0.92,
  stopDecay: 0.85,
  color1: "#000000",
  color2: "#051636",
  color3: "#0b3178",
  color4: "#4a96e8",
  colorIntensity: 1.0,
  softness: 1.0,
};

function hexToRgbNormalized(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return [r, g, b];
}

export default function InteractiveGradient() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    
    // Setup camera & renderer
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Setup Render Targets
    function createRenderTarget(w: number, h: number) {
      return new THREE.WebGLRenderTarget(w, h, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        type: THREE.FloatType,
        depthBuffer: false,
        stencilBuffer: false,
      });
    }

    let fluidTarget1 = createRenderTarget(window.innerWidth, window.innerHeight);
    let fluidTarget2 = createRenderTarget(window.innerWidth, window.innerHeight);

    let currentFluidTarget = fluidTarget1;
    let previousFluidTarget = fluidTarget2;
    let frameCount = 0;

    // Materials
    const fluidMaterial = new THREE.ShaderMaterial({
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        iMouse: { value: new THREE.Vector4(0, 0, 0, 0) },
        iFrame: { value: 0 },
        iPreviousFrame: { value: null },
        uBrushSize: { value: config.brushSize },
        uBrushStrength: { value: config.brushStrength },
        uFluidDecay: { value: config.fluidDecay },
        uTrailLength: { value: config.trailLength },
        uStopDecay: { value: config.stopDecay },
      },
      vertexShader,
      fragmentShader: fluidShader,
    });

    const displayMaterial = new THREE.ShaderMaterial({
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        iFluid: { value: null },
        uDistortionAmount: { value: config.distortionAmount },
        uColor1: { value: new THREE.Vector3(...hexToRgbNormalized(config.color1)) },
        uColor2: { value: new THREE.Vector3(...hexToRgbNormalized(config.color2)) },
        uColor3: { value: new THREE.Vector3(...hexToRgbNormalized(config.color3)) },
        uColor4: { value: new THREE.Vector3(...hexToRgbNormalized(config.color4)) },
        uColorIntensity: { value: config.colorIntensity },
        uSoftness: { value: config.softness },
      },
      vertexShader,
      fragmentShader: displayShader,
    });

    // Geometries & Scenes
    const geometry = new THREE.PlaneGeometry(2, 2);
    const fluidPlane = new THREE.Mesh(geometry, fluidMaterial);
    const displayPlane = new THREE.Mesh(geometry, displayMaterial);

    const sceneFluid = new THREE.Scene();
    sceneFluid.add(fluidPlane);

    const sceneDisplay = new THREE.Scene();
    sceneDisplay.add(displayPlane);

    // Mouse Interaction
    let mouseX = 0, mouseY = 0;
    let prevMouseX = 0, prevMouseY = 0;
    let lastMoveTime = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      prevMouseX = mouseX;
      prevMouseY = mouseY;
      mouseX = (e.clientX - rect.left);
      mouseY = (rect.height - (e.clientY - rect.top)); 
      lastMoveTime = performance.now();
      fluidMaterial.uniforms.iMouse.value.set(mouseX, mouseY, prevMouseX, prevMouseY);
    };

    const handleMouseLeave = () => {
      fluidMaterial.uniforms.iMouse.value.set(0, 0, 0, 0);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Animation Loop
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const time = performance.now() * 0.001;

      fluidMaterial.uniforms.iTime.value = time;
      displayMaterial.uniforms.iTime.value = time;
      fluidMaterial.uniforms.iFrame.value = frameCount;

      if (performance.now() - lastMoveTime > 120) {
        fluidMaterial.uniforms.iMouse.value.set(0, 0, 0, 0);
      }

      fluidMaterial.uniforms.uBrushSize.value = config.brushSize;
      fluidMaterial.uniforms.uBrushStrength.value = config.brushStrength;
      fluidMaterial.uniforms.uFluidDecay.value = config.fluidDecay;
      fluidMaterial.uniforms.uTrailLength.value = config.trailLength;
      fluidMaterial.uniforms.uStopDecay.value = config.stopDecay;

      displayMaterial.uniforms.uDistortionAmount.value = config.distortionAmount;
      displayMaterial.uniforms.uColorIntensity.value = config.colorIntensity;
      displayMaterial.uniforms.uSoftness.value = config.softness;

      fluidMaterial.uniforms.iPreviousFrame.value = previousFluidTarget.texture;

      renderer.setRenderTarget(currentFluidTarget);
      renderer.clear();
      renderer.render(sceneFluid, camera);

      displayMaterial.uniforms.iFluid.value = currentFluidTarget.texture;
      renderer.setRenderTarget(null);
      renderer.clear();
      renderer.render(sceneDisplay, camera);

      const tmp = previousFluidTarget;
      previousFluidTarget = currentFluidTarget;
      currentFluidTarget = tmp;

      frameCount++;
    };

    animate();

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      renderer.setSize(width, height);
      fluidMaterial.uniforms.iResolution.value.set(width, height);
      displayMaterial.uniforms.iResolution.value.set(width, height);

      fluidTarget1.setSize(width, height);
      fluidTarget2.setSize(width, height);

      frameCount = 0;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      fluidTarget1.dispose();
      fluidTarget2.dispose();
    };
  }, []);

  return <div ref={containerRef} className="interactive-gradient" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }} />;
}

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import earthVertex       from './3D/shaders/earth/vertex.glsl';
import earthFragment     from './3D/shaders/earth/fragment.glsl';
import atmosphereVertex  from './3D/shaders/atmosphere/vertex.glsl';
import atmosphereFragment from './3D/shaders/atmosphere/fragment.glsl';

export default function ServicesPlanet() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // WebGL check
    const tc = document.createElement('canvas');
    if (!tc.getContext('webgl') && !tc.getContext('experimental-webgl')) return;

    const W = container.offsetWidth  || window.innerWidth;
    const H = container.offsetHeight || window.innerHeight;

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 1000);
    // Look slightly downward so we see the upper hemisphere of an earth placed below
    camera.position.set(0, 0.8, 6);
    camera.lookAt(0, -0.5, 0);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch { return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // ── Earth (same textures + shaders as hero) ──────────────────────
    const TL = new THREE.TextureLoader();
    const dayTex   = TL.load('/earth/day.jpg');
    const nightTex = TL.load('/earth/night.jpg');
    const cloudTex = TL.load('/earth/specularClouds.jpg');
    dayTex.colorSpace   = THREE.SRGBColorSpace;
    nightTex.colorSpace = THREE.SRGBColorSpace;

    const RADIUS = 1.8;
    const dayColor     = '#4a96e8';
    const twilightColor = '#1950E5';
    const sunDir = new THREE.Vector3();
    sunDir.setFromSpherical(new THREE.Spherical(1, Math.PI * 0.48, -1.8));

    const earthMat = new THREE.ShaderMaterial({
      vertexShader:   earthVertex,
      fragmentShader: earthFragment,
      uniforms: {
        uDayTexture:             { value: dayTex },
        uNightTexture:           { value: nightTex },
        uSpecularCloudsTexture:  { value: cloudTex },
        uSunDirection:           { value: sunDir.clone() },
        uAtmosphereDayColor:     { value: new THREE.Color(dayColor) },
        uAtmosphereTwilightColor:{ value: new THREE.Color(twilightColor) },
      },
      transparent: true,
    });

    const atmoMat = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.BackSide,
      depthWrite: false,
      vertexShader:   atmosphereVertex,
      fragmentShader: atmosphereFragment,
      uniforms: {
        uOpacity:                { value: 1 },
        uSunDirection:           { value: sunDir.clone() },
        uAtmosphereDayColor:     { value: new THREE.Color(dayColor) },
        uAtmosphereTwilightColor:{ value: new THREE.Color(twilightColor) },
      },
    });

    const earthMesh = new THREE.Mesh(new THREE.SphereGeometry(RADIUS, 56, 56), earthMat);
    const atmoMesh  = new THREE.Mesh(new THREE.SphereGeometry(RADIUS, 56, 56), atmoMat);
    atmoMesh.scale.setScalar(1.13);

    const earthGroup = new THREE.Group();
    earthGroup.add(earthMesh, atmoMesh);
    // Push earth center below the canvas center → upper hemisphere shows behind cards
    earthGroup.position.set(0, -1.5, 0);
    scene.add(earthGroup);

    // ── Stars (round soft particles, additive blending) ───────────────
    const STARS = 2200;
    const sPos  = new Float32Array(STARS * 3);
    const sCol  = new Float32Array(STARS * 3);
    const sSz   = new Float32Array(STARS);

    const palette: [number,number,number][] = [
      [1,    1,    1   ],
      [0.85, 0.93, 1   ],
      [0.06, 0.71, 0.83],
      [0.30, 0.60, 1.00],
    ];
    for (let i = 0; i < STARS; i++) {
      const r = 10 + Math.random() * 22;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      sPos[i*3]   = r * Math.sin(ph) * Math.cos(th);
      sPos[i*3+1] = r * Math.sin(ph) * Math.sin(th) * 0.7;
      sPos[i*3+2] = r * Math.cos(ph);
      const c = palette[Math.floor(Math.random() * palette.length)];
      sCol[i*3] = c[0]; sCol[i*3+1] = c[1]; sCol[i*3+2] = c[2];
      sSz[i] = Math.random() * 1.4 + 0.4;
    }

    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
    starGeo.setAttribute('aColor',   new THREE.BufferAttribute(sCol, 3));
    starGeo.setAttribute('size',     new THREE.BufferAttribute(sSz, 1));

    const starMat = new THREE.ShaderMaterial({
      uniforms: { uPR: { value: renderer.getPixelRatio() } },
      vertexShader: `
        attribute float size;
        attribute vec3 aColor;
        varying vec3 vColor;
        uniform float uPR;
        void main() {
          vColor = aColor;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * uPR * (260.0 / -mv.z);
          gl_Position  = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          if (d > 0.5) discard;
          gl_FragColor = vec4(vColor, smoothstep(0.5, 0.08, d) * 0.92);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // ── Milky Way band (dense dust cloud arc) ─────────────────────────
    const MW = 900;
    const mPos = new Float32Array(MW * 3);
    const mCol = new Float32Array(MW * 3);

    for (let i = 0; i < MW; i++) {
      const t  = (i / MW) * Math.PI * 2;
      const r  = 14 + Math.random() * 6;
      const sp = (Math.random() - 0.5) * 2.5;
      mPos[i*3]   = Math.cos(t * 0.6) * r + (Math.random() - 0.5) * 1.5;
      mPos[i*3+1] = sp * 0.35;
      mPos[i*3+2] = Math.sin(t * 0.6) * r + (Math.random() - 0.5) * 1.5;
      const b = 0.25 + Math.random() * 0.35;
      mCol[i*3] = b * 0.75; mCol[i*3+1] = b * 0.88; mCol[i*3+2] = b;
    }

    const mwGeo = new THREE.BufferGeometry();
    mwGeo.setAttribute('position', new THREE.BufferAttribute(mPos, 3));

    const mwMat = new THREE.PointsMaterial({
      size: 0.09, color: new THREE.Color(0x8ab4e8), transparent: true,
      opacity: 0.4, blending: THREE.AdditiveBlending, depthWrite: false,
    });

    const milkyWay = new THREE.Points(mwGeo, mwMat);
    milkyWay.rotation.set(Math.PI * 0.12, 0, Math.PI * 0.08);
    scene.add(milkyWay);

    // ── Render loop ───────────────────────────────────────────────────
    let frameId: number;
    let isVisible = false;

    const observer = new IntersectionObserver(
      (e) => { isVisible = e[0].isIntersecting; },
      { threshold: 0.05 }
    );
    observer.observe(container);

    let t = 0;
    const tick = () => {
      frameId = requestAnimationFrame(tick);
      if (!isVisible) return;
      t += 0.0035;
      earthMesh.rotation.y = t * 0.06;
      stars.rotation.y     = t * 0.008;
      milkyWay.rotation.y  = t * 0.003;
      renderer.render(scene, camera);
    };
    tick();

    const onResize = () => {
      const W = container.offsetWidth  || window.innerWidth;
      const H = container.offsetHeight || window.innerHeight;
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      renderer.setSize(W, H);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      window.removeEventListener('resize', onResize);
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      earthMat.dispose(); atmoMat.dispose();
      starGeo.dispose(); starMat.dispose();
      mwGeo.dispose();   mwMat.dispose();
      const gl = renderer.getContext();
      gl?.getExtension('WEBGL_lose_context')?.loseContext();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
      }}
    />
  );
}

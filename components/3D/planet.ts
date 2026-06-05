import gsap from "gsap";

import earthVertex from "./shaders/earth/vertex.glsl";
import earthFragment from "./shaders/earth/fragment.glsl";
import atmosphereVertex from "./shaders/atmosphere/vertex.glsl"
import atmosphereFragment from "./shaders/atmosphere/fragment.glsl"

import ScrollTrigger from "gsap/dist/ScrollTrigger";

import * as THREE from "three";

const initPlanet = (canvas: HTMLCanvasElement): {
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  timeline: gsap.core.Timeline;
  tickerFunc: (time: number) => void;
  resizeFunc: () => void
} => {

  // scene
  const scene = new THREE.Scene();

  // camera
  const size = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRation: Math.min(window.devicePixelRatio, 1.5),
  };

  const camera = new THREE.PerspectiveCamera(
    15,
    size.width / size.height,
    0.1,
    10000,
  );
  camera.position.x = 0;
  camera.position.y = 2.15;
  camera.position.z = 4.5;
  scene.add(camera);

  // renderer
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(size.width, size.height);
  renderer.setPixelRatio(size.pixelRation);
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  // texture
  const TL = new THREE.TextureLoader();
  const dayTexture = TL.load("./earth/day.jpg");
  const nightTexture = TL.load("./earth/night.jpg");
  const specularCloudsTexture = TL.load("./earth/specularClouds.jpg");

  dayTexture.colorSpace = THREE.SRGBColorSpace;
  nightTexture.colorSpace = THREE.SRGBColorSpace;

  const baseAnisotropy = renderer.capabilities.getMaxAnisotropy();

  dayTexture.anisotropy = baseAnisotropy;
  specularCloudsTexture.anisotropy = baseAnisotropy;
  nightTexture.anisotropy = baseAnisotropy;

  // geometry
  const earthGeometry = new THREE.SphereGeometry(2, 64, 64);
  const atmosphereGeometry = new THREE.SphereGeometry(2, 64, 64);

  const atmosphereDayColor = "#4a96e8";
  const atmosphereTwilightColor = "#1950E5";
  // material
  const earthMaterial = new THREE.ShaderMaterial({
    vertexShader: earthVertex,
    fragmentShader: earthFragment,
    uniforms: {
      uDayTexture: new THREE.Uniform(dayTexture),
      uNightTexture: new THREE.Uniform(nightTexture),
      uSpecularCloudsTexture: new THREE.Uniform(specularCloudsTexture),
      uSunDirection: new THREE.Uniform(new THREE.Vector3(-1, 0, 0)),
      uAtmosphereDayColor: new THREE.Uniform(
        new THREE.Color(atmosphereDayColor),
      ),
      uAtmosphereTwilightColor: new THREE.Uniform(
        new THREE.Color(atmosphereTwilightColor),
      ),
    },
    transparent: true,
  });

  const atmosphereMaterial = new THREE.ShaderMaterial({
    transparent: true,
    side: THREE.BackSide,
    vertexShader: atmosphereVertex,
    fragmentShader: atmosphereFragment,
    uniforms: {
      uOpacity: { value: 1 },
      uSunDirection: new THREE.Uniform(new THREE.Vector3(-1, 0, 0)),
      uAtmosphereDayColor: new THREE.Uniform(
        new THREE.Color(atmosphereDayColor),
      ),
      uAtmosphereTwilightColor: new THREE.Uniform(
        new THREE.Color(atmosphereTwilightColor),
      ),
    },
    depthWrite: false,
  });

  const earth = new THREE.Mesh(earthGeometry, earthMaterial);
  const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
  atmosphere.scale.set(1.13, 1.13, 1.13);

  const earthGroup = new THREE.Group().add(earth, atmosphere)

  let sunSpherical = new THREE.Spherical(1, Math.PI * 0.48, -1.8);
  const sunDirection = new THREE.Vector3();

  sunDirection.setFromSpherical(sunSpherical);

  earthMaterial.uniforms.uSunDirection.value.copy(sunDirection);
  atmosphereMaterial.uniforms.uSunDirection.value.copy(sunDirection);

  scene.add(earthGroup);
  gsap.registerPlugin(ScrollTrigger);
  const timeline = gsap
    .timeline({
      scrollTrigger: {
        trigger: ".hero_main",
        start: () => "top top",
        scrub: 3,
        anticipatePin: 1,
        pin: true,
      },
    })
    .to(
      ".hero_main .content",
      {
        filter: `blur(40px)`,
        autoAlpha: 0,
        scale: 0.5,
        duration: 2,
        ease: "power1.inOut",
      },
      "setting",
    )
    .to(
      camera.position,
      {
        y: 0.1,
        z: window.innerWidth > 768 ? 19 : 30,
        x: window.innerWidth > 768 ? 0 : 0.1,
        duration: 2,
        ease: "power1.inOut",
      },
      "setting",
    )
    .fromTo(
      ".hero-side.left-side",
      { x: -50, autoAlpha: 0 },
      {
        autoAlpha: 1,
        x: 0,
        duration: 1,
        ease: "power2.out",
      },
      "setting+=1.2"
    )
    .fromTo(
      ".hero-side.right-side",
      { x: 50, autoAlpha: 0 },
      {
        autoAlpha: 1,
        x: 0,
        duration: 1,
        ease: "power2.out",
      },
      "setting+=1.7"
    );

  // Global Parallax Timeline - Moves the Earth around as the user scrolls through the rest of the page
  const globalParallax = gsap.timeline({
    scrollTrigger: {
      trigger: "#brands",
      start: "top bottom",
      endTrigger: "#contact",
      end: "bottom bottom",
      scrub: 1.5,
    }
  });

  globalParallax
    .to(atmosphereMaterial.uniforms.uOpacity, { value: 0, duration: 0.5, ease: "power2.out" }, 0)
    .to(".global_dim_overlay", { opacity: 1, duration: 0.5, ease: "power2.inOut" }, 0)
    .to(earthGroup.position, { x: 6, y: -2, ease: "sine.inOut", duration: 1 }, 0)
    .to(earthGroup.position, { x: -6, y: 2, ease: "sine.inOut", duration: 1 }, 1)
    .to(earthGroup.position, { x: 4, y: -1, ease: "sine.inOut", duration: 1 }, 2)
    .to(earthGroup.position, { x: 0, y: 0, ease: "sine.inOut", duration: 1 }, 3);

  // animation loop
  let isVisible = true;
  const observer = new IntersectionObserver((entries) => {
    isVisible = entries[0].isIntersecting;
  }, { threshold: 0 });
  observer.observe(canvas.parentElement || canvas);

  const tickerFunc = (time: number) => {
    if (!isVisible) return;
    earth.rotation.y = time * 0.2;
    renderer.render(scene, camera);
  };
  gsap.ticker.add(tickerFunc);

  gsap.ticker.lagSmoothing(0);

  const resizeFunc = () => {
    size.width = window.innerWidth;
    size.height = window.innerHeight;
    size.pixelRation = Math.min(window.devicePixelRatio, 1.5);

    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();

    renderer.setSize(size.width, size.height);
    renderer.setPixelRatio(size.pixelRation);
  };
  window.addEventListener("resize", resizeFunc);

  return { scene, renderer, timeline, tickerFunc, resizeFunc, observer };
};

export default initPlanet;


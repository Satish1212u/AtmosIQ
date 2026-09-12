import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * LuxuryAtmosphereGlobe
 * 
 * Cinematic interactive 3D Atmospheric Globe for the Home experience.
 * Features:
 * - Brushed champagne gold geodesic wireframe & latitude/longitude coordinate grid
 * - Volumetric semi-translucent atmospheric layer with subtle golden aura
 * - Suspended telemetry orbit nodes
 * - Smooth inertial rotation driven by mouse drag & hover
 * - Subtle camera depth shift reacting to page scroll
 */
const LuxuryAtmosphereGlobe = ({ 
  condition = 'Clear', 
  temp = 24, 
  city = 'Local Atmosphere',
  className = ''
}) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 480;
    const height = container.clientHeight || 480;

    // SCENE & CAMERA
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 18);

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // LIGHTING
    const ambient = new THREE.AmbientLight(0xfdfbf7, 1.2);
    scene.add(ambient);

    const sunLight = new THREE.DirectionalLight(0xe8d5b5, 2.0);
    sunLight.position.set(12, 14, 15);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0xb89758, 1.2);
    rimLight.position.set(-15, -8, -10);
    scene.add(rimLight);

    // ROOT GLOBE GROUP
    const globeRoot = new THREE.Group();
    scene.add(globeRoot);

    // 1. CORE SPHERE (Warm ivory/alabaster marble with subtle metallic sheen)
    const coreGeo = new THREE.SphereGeometry(6, 48, 48);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xfaf6ef,
      roughness: 0.35,
      metalness: 0.25,
      transparent: true,
      opacity: 0.94,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    globeRoot.add(coreMesh);

    // 2. LATITUDE & LONGITUDE GOLD GRID
    const gridMat = new THREE.LineBasicMaterial({
      color: 0xc5a880,
      transparent: true,
      opacity: 0.42,
    });

    // Latitude rings
    for (let lat = -60; lat <= 60; lat += 20) {
      const radiusAtLat = 6.05 * Math.cos((lat * Math.PI) / 180);
      const yAtLat = 6.05 * Math.sin((lat * Math.PI) / 180);
      const ringGeo = new THREE.BufferGeometry();
      const points = [];
      const segments = 64;
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(radiusAtLat * Math.cos(theta), yAtLat, radiusAtLat * Math.sin(theta)));
      }
      ringGeo.setFromPoints(points);
      const ringLine = new THREE.Line(ringGeo, gridMat);
      globeRoot.add(ringLine);
    }

    // Longitude meridians
    for (let lon = 0; lon < 180; lon += 30) {
      const meridianGeo = new THREE.BufferGeometry();
      const points = [];
      const segments = 64;
      for (let i = 0; i <= segments; i++) {
        const phi = (i / segments) * Math.PI * 2;
        const x = 6.05 * Math.cos(phi);
        const y = 6.05 * Math.sin(phi);
        points.push(new THREE.Vector3(x, y, 0));
      }
      meridianGeo.setFromPoints(points);
      const meridianLine = new THREE.Line(meridianGeo, gridMat);
      meridianLine.rotation.y = (lon * Math.PI) / 180;
      globeRoot.add(meridianLine);
    }

    // 3. ATMOSPHERIC HALO (Outer semi-translucent envelope)
    const atmoGeo = new THREE.SphereGeometry(6.65, 32, 32);
    const atmoMat = new THREE.MeshBasicMaterial({
      color: 0xd4bd92,
      transparent: true,
      opacity: 0.18,
      wireframe: true,
    });
    const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
    globeRoot.add(atmoMesh);

    // 4. EQUATORIAL ORBITAL RING (Horological bezel)
    const bezelGeo = new THREE.RingGeometry(7.2, 7.32, 64);
    const bezelMat = new THREE.MeshStandardMaterial({
      color: 0xb89758,
      metalness: 0.8,
      roughness: 0.2,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75,
    });
    const bezelMesh = new THREE.Mesh(bezelGeo, bezelMat);
    bezelMesh.rotation.x = Math.PI / 2.3;
    globeRoot.add(bezelMesh);

    // 5. ORBITING TELEMETRY DATA NODES
    const nodeCount = 14;
    const nodeGroup = new THREE.Group();
    globeRoot.add(nodeGroup);

    const nodeMat = new THREE.MeshBasicMaterial({ color: 0x9e7d47 });
    for (let n = 0; n < nodeCount; n++) {
      const dotGeo = new THREE.SphereGeometry(0.12, 12, 12);
      const dot = new THREE.Mesh(dotGeo, nodeMat);
      const phi = Math.acos(-1 + (2 * n) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;
      const r = 6.8 + Math.random() * 0.8;
      dot.position.set(
        r * Math.cos(theta) * Math.sin(phi),
        r * Math.sin(theta) * Math.sin(phi),
        r * Math.cos(phi)
      );
      nodeGroup.add(dot);
    }

    // INTERACTIVITY (Mouse Drag & Inertial Rotation)
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let rotationVelocity = { x: 0.002, y: 0.004 };

    const onMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      rotationVelocity.y = deltaX * 0.005;
      rotationVelocity.x = deltaY * 0.005;

      globeRoot.rotation.y += rotationVelocity.y;
      globeRoot.rotation.x += rotationVelocity.x;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Touch support for mobile devices
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    const onTouchMove = (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.y;
      rotationVelocity.y = deltaX * 0.005;
      rotationVelocity.x = deltaY * 0.005;
      globeRoot.rotation.y += rotationVelocity.y;
      globeRoot.rotation.x += rotationVelocity.x;
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchEnd = () => { isDragging = false; };

    dom.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // Scroll depth interaction
    const onScroll = () => {
      const scrollProgress = window.scrollY / (document.body.scrollHeight - window.innerHeight || 1);
      camera.position.z = 18 - scrollProgress * 4;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // Resize handling
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 480;
      const h = container.clientHeight || 480;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // ANIMATION LOOP
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (!isDragging) {
        // Natural gentle orbital spin
        globeRoot.rotation.y += rotationVelocity.y;
        globeRoot.rotation.x += rotationVelocity.x;

        // Dampen manual drag velocity back to baseline cruise speed
        rotationVelocity.y = THREE.MathUtils.lerp(rotationVelocity.y, 0.0025, 0.02);
        rotationVelocity.x = THREE.MathUtils.lerp(rotationVelocity.x, 0.0005, 0.02);
      }

      atmoMesh.rotation.y -= 0.001;
      bezelMesh.rotation.z += 0.0015;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', handleResize);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      atmoGeo.dispose();
      atmoMat.dispose();
      bezelGeo.dispose();
      bezelMat.dispose();
    };
  }, [condition, temp, city]);

  return (
    <div className={`relative flex items-center justify-center cursor-grab active:cursor-grabbing select-none ${className}`}>
      {/* 3D Canvas Mount Point */}
      <div ref={mountRef} className="w-full h-full min-w-[320px] min-h-[320px] max-w-[580px] max-h-[580px] aspect-square" />
      
      {/* Horological Ring Inscription */}
      <div className="absolute -bottom-6 pointer-events-none flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/75 border border-[#C5A880]/30 backdrop-blur-md shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-[#B89758] animate-ping" />
        <span className="text-[10px] font-roman tracking-[0.2em] text-[#786E65] uppercase">
          SPATIAL TELEMETRY · 3D ORBITAL CORE
        </span>
      </div>
    </div>
  );
};

export default LuxuryAtmosphereGlobe;

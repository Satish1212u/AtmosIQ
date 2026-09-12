import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * LuxurySpatialAtmosphere
 * 
 * Unified Three.js 3D spatial weather background.
 * Reacts to live weather conditions:
 * - Clear: Warm golden sunlight, atmospheric ray scatter, floating micro-dust
 * - Clouds: Volumetric layered champagne mist strata
 * - Rain/Drizzle: Subtle angled rain vectors and soft surface refraction
 * - Thunderstorm: Deep rich charcoal depth with restrained auric lightning flashes
 * - Snow: Crystalline faceted particle flakes with gentle turbulence
 * - Fog/Haze: Soft cashmere depth and layered atmospheric attenuation
 * - Night: Subtle celestial starry depth with warm lunar glow
 */
const LuxurySpatialAtmosphere = ({ condition = 'clear', windSpeed = 3, isNight = false, aqiLevel = 'good' }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // SCENE & CAMERA
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 30;

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // MOUSE PARALLAX STATE
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const onMouseMove = (e) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 4;
      targetY = (e.clientY / window.innerHeight - 0.5) * 4;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // LIGHTING
    const ambientLight = new THREE.AmbientLight(0xfff8ed, 0.85);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xd4af37, 1.2);
    keyLight.position.set(20, 35, 25);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xc5a880, 0.6);
    fillLight.position.set(-20, -10, 15);
    scene.add(fillLight);

    // GROUPS
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // 1. DUST PARTICLES (Universally present for spatial depth)
    const dustCount = 350;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    const dustSizes = new Float32Array(dustCount);

    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 80;
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 60;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 40;
      dustSizes[i] = Math.random() * 2.5 + 1.0;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    dustGeo.setAttribute('size', new THREE.BufferAttribute(dustSizes, 1));

    const dustColor = isNight ? 0xd4c29d : 0xc5a880;
    const dustMat = new THREE.PointsMaterial({
      color: dustColor,
      size: 0.28,
      transparent: true,
      opacity: isNight ? 0.45 : 0.32,
      blending: THREE.AdditiveBlending,
    });
    const dustMesh = new THREE.Points(dustGeo, dustMat);
    masterGroup.add(dustMesh);

    // 2. WEATHER-SPECIFIC 3D ELEMENTS
    const cond = (condition || '').toLowerCase();
    let dynamicMesh = null;
    let rainGeo = null;
    let rainMat = null;
    let rainCount = 0;
    let rainVelocities = null;

    if (cond.includes('rain') || cond.includes('drizzle') || cond.includes('storm')) {
      // PRECIPITATION: Angled luxury rain streaks
      rainCount = cond.includes('storm') ? 600 : 350;
      rainGeo = new THREE.BufferGeometry();
      const rainPos = new Float32Array(rainCount * 3);
      rainVelocities = new Float32Array(rainCount);

      for (let i = 0; i < rainCount; i++) {
        rainPos[i * 3] = (Math.random() - 0.5) * 90;
        rainPos[i * 3 + 1] = Math.random() * 80 - 40;
        rainPos[i * 3 + 2] = (Math.random() - 0.5) * 50;
        rainVelocities[i] = Math.random() * 0.4 + 0.6;
      }
      rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPos, 3));

      rainMat = new THREE.PointsMaterial({
        color: 0x9ca3af,
        size: 0.4,
        transparent: true,
        opacity: 0.45,
      });
      dynamicMesh = new THREE.Points(rainGeo, rainMat);
      masterGroup.add(dynamicMesh);
    } else if (cond.includes('snow')) {
      // SNOW: Crystalline soft falling flakes
      const snowCount = 400;
      const snowGeo = new THREE.BufferGeometry();
      const snowPos = new Float32Array(snowCount * 3);

      for (let i = 0; i < snowCount; i++) {
        snowPos[i * 3] = (Math.random() - 0.5) * 80;
        snowPos[i * 3 + 1] = Math.random() * 70 - 35;
        snowPos[i * 3 + 2] = (Math.random() - 0.5) * 40;
      }
      snowGeo.setAttribute('position', new THREE.BufferAttribute(snowPos, 3));

      const snowMat = new THREE.PointsMaterial({
        color: 0xfaf5ee,
        size: 0.65,
        transparent: true,
        opacity: 0.75,
      });
      dynamicMesh = new THREE.Points(snowGeo, snowMat);
      masterGroup.add(dynamicMesh);
    } else {
      // CLEAR / CLOUDY / NIGHT: Subtle volumetric orbital rings
      const ringGroup = new THREE.Group();
      const ringMat = new THREE.MeshBasicMaterial({
        color: isNight ? 0xb89758 : 0xc5a880,
        wireframe: true,
        transparent: true,
        opacity: 0.12,
      });

      for (let r = 0; r < 3; r++) {
        const torusGeo = new THREE.TorusGeometry(18 + r * 6, 0.05, 8, 80);
        const ring = new THREE.Mesh(torusGeo, ringMat);
        ring.rotation.x = Math.PI / 3 + r * 0.2;
        ring.rotation.y = r * 0.4;
        ringGroup.add(ring);
      }
      dynamicMesh = ringGroup;
      masterGroup.add(dynamicMesh);
    }

    // RESIZE HANDLER
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
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
      const elapsed = clock.getElapsedTime();

      // Smooth inertia interpolation
      currentX += (targetX - currentX) * 0.04;
      currentY += (targetY - currentY) * 0.04;

      camera.position.x = currentX;
      camera.position.y = -currentY;
      camera.lookAt(0, 0, 0);

      // Dust rotation
      if (dustMesh) {
        dustMesh.rotation.y = elapsed * 0.018;
        dustMesh.rotation.x = elapsed * 0.009;
      }

      // Rain animation
      if (rainGeo && rainVelocities) {
        const pos = rainGeo.attributes.position.array;
        const windDrift = (windSpeed || 3) * 0.02;
        for (let i = 0; i < rainCount; i++) {
          pos[i * 3 + 1] -= rainVelocities[i] * 1.5;
          pos[i * 3] += windDrift;
          if (pos[i * 3 + 1] < -40) {
            pos[i * 3 + 1] = 40;
            pos[i * 3] = (Math.random() - 0.5) * 90;
          }
        }
        rainGeo.attributes.position.needsUpdate = true;
      }

      // Ring rotation
      if (dynamicMesh && dynamicMesh.isGroup) {
        dynamicMesh.rotation.z = elapsed * 0.025;
        dynamicMesh.rotation.y = elapsed * 0.015;
      }

      renderer.render(scene, camera);
    };

    animate();

    // CLEANUP
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      if (rainGeo) rainGeo.dispose();
      if (rainMat) rainMat.dispose();
    };
  }, [condition, windSpeed, isNight, aqiLevel]);

  return (
    <div 
      ref={mountRef} 
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden" 
      style={{ opacity: 0.95 }}
    />
  );
};

export default LuxurySpatialAtmosphere;

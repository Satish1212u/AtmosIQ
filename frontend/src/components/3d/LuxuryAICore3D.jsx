import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * LuxuryAICore3D
 * 
 * Sophisticated 3D gyroscopic orbital energy & intelligence system for the AI Assistant.
 * Features:
 * - Three concentric brushed champagne gold rings rotating along gimbal axes
 * - Inner floating intelligence nucleus with subtle auric reflection
 * - Dynamic excitation on AI thinking, message streaming, or voice recording
 * - Zero cheap neon: warm ivory, brushed gold, champagne metallics
 */
const LuxuryAICore3D = ({ 
  isTyping = false, 
  isListening = false, 
  className = '' 
}) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 320;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 10.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    // Lighting
    const ambient = new THREE.AmbientLight(0xfff8ee, 1.4);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xe5c98d, 2.2);
    keyLight.position.set(10, 12, 10);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xb89758, 1.5);
    rimLight.position.set(-10, -8, -6);
    scene.add(rimLight);

    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Materials
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xc5a880,
      metalness: 0.88,
      roughness: 0.22,
      side: THREE.DoubleSide,
    });

    const innerGoldMat = new THREE.MeshStandardMaterial({
      color: 0xb89758,
      metalness: 0.92,
      roughness: 0.18,
      side: THREE.DoubleSide,
    });

    // Ring 1: Outer Gimbal Ring
    const ring1Geo = new THREE.TorusGeometry(3.6, 0.06, 16, 100);
    const ring1 = new THREE.Mesh(ring1Geo, goldMat);
    coreGroup.add(ring1);

    // Ring 2: Intermediate Orbital Ring
    const ring2Geo = new THREE.TorusGeometry(2.8, 0.05, 16, 100);
    const ring2 = new THREE.Mesh(ring2Geo, innerGoldMat);
    ring2.rotation.x = Math.PI / 3;
    coreGroup.add(ring2);

    // Ring 3: Inner Orbital Ring
    const ring3Geo = new THREE.TorusGeometry(2.0, 0.04, 16, 80);
    const ring3 = new THREE.Mesh(ring3Geo, goldMat);
    ring3.rotation.y = Math.PI / 4;
    coreGroup.add(ring3);

    // Nucleus Sphere (Ivory Pearl with subtle gold refraction)
    const nucleusGeo = new THREE.SphereGeometry(0.85, 32, 32);
    const nucleusMat = new THREE.MeshPhysicalMaterial({
      color: 0xfcfbf7,
      roughness: 0.25,
      metalness: 0.15,
      transmission: 0.35,
      thickness: 0.8,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1,
    });
    const nucleus = new THREE.Mesh(nucleusGeo, nucleusMat);
    coreGroup.add(nucleus);

    // Energy Cloud Particles (Fine golden dust suspended around nucleus)
    const pCount = 80;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const rad = 1.2 + Math.random() * 0.9;
      pPos[i * 3] = rad * Math.sin(phi) * Math.cos(theta);
      pPos[i * 3 + 1] = rad * Math.sin(phi) * Math.sin(theta);
      pPos[i * 3 + 2] = rad * Math.cos(phi);
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xd4af37,
      size: 0.12,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(pGeo, pMat);
    coreGroup.add(particles);

    // Animation variables
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Rotation speeds modulate based on state (thinking / listening / idle)
      const speedMult = isTyping ? 3.0 : isListening ? 2.2 : 1.0;

      ring1.rotation.x = elapsed * 0.25 * speedMult;
      ring1.rotation.y = elapsed * 0.15 * speedMult;

      ring2.rotation.y = elapsed * 0.35 * speedMult;
      ring2.rotation.z = elapsed * 0.2 * speedMult;

      ring3.rotation.z = elapsed * 0.45 * speedMult;
      ring3.rotation.x = elapsed * 0.3 * speedMult;

      particles.rotation.y = elapsed * 0.18 * speedMult;

      // Pulse breathing
      const pulseScale = 1 + Math.sin(elapsed * (isTyping ? 4 : 2)) * (isTyping ? 0.08 : 0.03);
      nucleus.scale.set(pulseScale, pulseScale, pulseScale);

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 320;
      const h = container.clientHeight || 320;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      ring1Geo.dispose();
      ring2Geo.dispose();
      ring3Geo.dispose();
      goldMat.dispose();
      innerGoldMat.dispose();
      nucleusGeo.dispose();
      nucleusMat.dispose();
      pGeo.dispose();
      pMat.dispose();
    };
  }, [isTyping, isListening]);

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <div ref={mountRef} className="w-full h-full min-w-[240px] min-h-[240px] max-w-[400px] max-h-[400px] aspect-square" />
    </div>
  );
};

export default LuxuryAICore3D;

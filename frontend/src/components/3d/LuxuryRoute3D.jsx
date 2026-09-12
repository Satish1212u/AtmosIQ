import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * LuxuryRoute3D
 * 
 * 3D Spatial Route & Journey Visualization for Travel Checker.
 * Features:
 * - 3D terrain arc spline connecting origin to destination through waypoints
 * - Interactive waypoint pins with condition aura
 * - Animated golden vehicle / exploration tracer bead traversing the route
 * - Soft champagne elevation grid
 */
const LuxuryRoute3D = ({ 
  origin = 'Paris', 
  destination = 'Zurich', 
  waypoints = [],
  progress = 0.5,
  className = ''
}) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 240;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 5, 12);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xfffbf5, 1.2);
    scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0xe5c98d, 2.0);
    dirLight.position.set(5, 10, 8);
    scene.add(dirLight);

    const root = new THREE.Group();
    scene.add(root);

    // 1. Subtle elevation grid (Champagne gold hairline)
    const grid = new THREE.GridHelper(14, 14, 0xc5a880, 0xeae2d3);
    grid.position.y = -1.5;
    root.add(grid);

    // 2. 3D Spline Curve connecting route
    const p0 = new THREE.Vector3(-4.5, -1.2, 1.5);
    const p1 = new THREE.Vector3(-1.8, 0.8, -0.8);
    const p2 = new THREE.Vector3(1.2, 1.4, 0.5);
    const p3 = new THREE.Vector3(4.5, -1.2, -1.2);

    const curve = new THREE.CatmullRomCurve3([p0, p1, p2, p3]);
    const points = curve.getPoints(60);
    const pathGeo = new THREE.BufferGeometry().setFromPoints(points);
    const pathMat = new THREE.LineBasicMaterial({
      color: 0xc5a880,
      linewidth: 2,
      transparent: true,
      opacity: 0.85,
    });
    const pathLine = new THREE.Line(pathGeo, pathMat);
    root.add(pathLine);

    // 3. Waypoint Pillars
    const pinMat = new THREE.MeshStandardMaterial({
      color: 0xb89758,
      metalness: 0.9,
      roughness: 0.2,
    });
    [p0, p1, p2, p3].forEach((pos, idx) => {
      const pinGeo = new THREE.CylinderGeometry(0.12, 0.04, 0.6, 16);
      const pin = new THREE.Mesh(pinGeo, pinMat);
      pin.position.copy(pos);
      root.add(pin);

      const ringGeo = new THREE.RingGeometry(0.25, 0.35, 24);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xdfcca6, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(pos.x, -1.48, pos.z);
      ring.rotation.x = Math.PI / 2;
      root.add(ring);
    });

    // 4. Animated Journey Tracer Bead
    const tracerGeo = new THREE.SphereGeometry(0.25, 24, 24);
    const tracerMat = new THREE.MeshStandardMaterial({
      color: 0x9e7d47,
      emissive: 0xb89758,
      emissiveIntensity: 0.6,
      metalness: 0.95,
      roughness: 0.15,
    });
    const tracer = new THREE.Mesh(tracerGeo, tracerMat);
    root.add(tracer);

    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const t = (elapsed * 0.18) % 1;
      const pointOnCurve = curve.getPointAt(t);
      tracer.position.copy(pointOnCurve);

      // Subtle scene drift
      root.rotation.y = Math.sin(elapsed * 0.2) * 0.08;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 400;
      const h = container.clientHeight || 240;
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
      grid.dispose();
      pathGeo.dispose();
      pathMat.dispose();
      tracerGeo.dispose();
      tracerMat.dispose();
    };
  }, [origin, destination]);

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <div ref={mountRef} className="w-full h-56" />
    </div>
  );
};

export default LuxuryRoute3D;

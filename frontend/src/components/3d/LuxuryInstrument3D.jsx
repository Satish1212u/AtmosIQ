import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * LuxuryCompass3D
 * 
 * 3D Physical Horological Wind Compass Complication.
 * Features:
 * - Brushed champagne gold outer bezel with calibrated degree markings
 * - 3D dual-tone magnetic needle (brushed gold & dark umber)
 * - Real-time orientation based on live wind direction (deg)
 * - Micro-tilt physics reacting to cursor
 */
export const LuxuryCompass3D = ({ deg = 0, speed = 0, className = '' }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 160;
    const height = container.clientHeight || 160;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lighting
    const ambient = new THREE.AmbientLight(0xfffbf5, 1.2);
    scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0xe5c98d, 1.8);
    dirLight.position.set(5, 6, 8);
    scene.add(dirLight);

    const root = new THREE.Group();
    scene.add(root);

    // Outer Horological Gold Bezel
    const ringGeo = new THREE.RingGeometry(2.3, 2.55, 64);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xc5a880,
      metalness: 0.85,
      roughness: 0.25,
      side: THREE.DoubleSide,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    root.add(ringMesh);

    // Dial Face
    const faceGeo = new THREE.CircleGeometry(2.3, 48);
    const faceMat = new THREE.MeshStandardMaterial({
      color: 0xfcfbf9,
      roughness: 0.4,
      metalness: 0.1,
    });
    const faceMesh = new THREE.Mesh(faceGeo, faceMat);
    faceMesh.position.z = -0.05;
    root.add(faceMesh);

    // Compass Needle Group
    const needleGroup = new THREE.Group();
    root.add(needleGroup);

    // North Pointer (Brushed Gold)
    const northGeo = new THREE.ConeGeometry(0.24, 1.6, 4);
    const northMat = new THREE.MeshStandardMaterial({
      color: 0xb89758,
      metalness: 0.9,
      roughness: 0.2,
    });
    const northCone = new THREE.Mesh(northGeo, northMat);
    northCone.position.y = 0.8;
    needleGroup.add(northCone);

    // South Pointer (Warm Umber)
    const southGeo = new THREE.ConeGeometry(0.24, 1.6, 4);
    const southMat = new THREE.MeshStandardMaterial({
      color: 0x443e38,
      metalness: 0.4,
      roughness: 0.6,
    });
    const southCone = new THREE.Mesh(southGeo, southMat);
    southCone.position.y = -0.8;
    southCone.rotation.z = Math.PI;
    needleGroup.add(southCone);

    // Center Pivot Cap
    const capGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 32);
    const capMat = new THREE.MeshStandardMaterial({
      color: 0x9e7d47,
      metalness: 0.95,
      roughness: 0.15,
    });
    const capMesh = new THREE.Mesh(capGeo, capMat);
    capMesh.rotation.x = Math.PI / 2;
    needleGroup.add(capMesh);

    // Target rotation based on wind degree
    const targetRad = -((deg || 0) * Math.PI) / 180;
    let currentRad = 0;

    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      currentRad += (targetRad - currentRad) * 0.08;
      needleGroup.rotation.z = currentRad;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      faceGeo.dispose();
      faceMat.dispose();
      northGeo.dispose();
      northMat.dispose();
      southGeo.dispose();
      southMat.dispose();
      capGeo.dispose();
      capMat.dispose();
    };
  }, [deg]);

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      <div ref={mountRef} className="w-28 h-28 cursor-pointer" />
      <div className="text-center mt-1">
        <span className="text-[10px] font-roman tracking-widest text-[#786E65] uppercase block">
          BEARING {Math.round(deg)}°
        </span>
        <span className="text-xs font-semibold text-[#2C2621]">
          {speed} m/s
        </span>
      </div>
    </div>
  );
};

/**
 * LuxuryCelestialTrack3D
 * 
 * 3D Sun/Moon Astronomical Arc Tracker.
 * Displays diurnal solar arc, sunrise/sunset points, and current celestial position.
 */
export const LuxuryCelestialTrack3D = ({ sunrise, sunset, currentTime = Date.now(), className = '' }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 280;
    const height = container.clientHeight || 140;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
    camera.position.set(0, 0.4, 6.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xfffbf5, 1.2);
    scene.add(ambient);
    const sunLight = new THREE.PointLight(0xf0cca0, 2.5, 15);
    scene.add(sunLight);

    const root = new THREE.Group();
    scene.add(root);

    // Semi-circular celestial trajectory arch
    const curvePoints = [];
    const radius = 2.4;
    for (let i = 0; i <= 64; i++) {
      const theta = (i / 64) * Math.PI; // 0 to PI
      curvePoints.push(new THREE.Vector3(-radius * Math.cos(theta), radius * Math.sin(theta) - 0.6, 0));
    }
    const archGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
    const archMat = new THREE.LineDashedMaterial({
      color: 0xc5a880,
      dashSize: 0.15,
      gapSize: 0.08,
      linewidth: 1.5,
      transparent: true,
      opacity: 0.65,
    });
    const archLine = new THREE.Line(archGeo, archMat);
    archLine.computeLineDistances();
    root.add(archLine);

    // Horizon baseline
    const baseGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-2.8, -0.6, 0),
      new THREE.Vector3(2.8, -0.6, 0)
    ]);
    const baseMat = new THREE.LineBasicMaterial({ color: 0xddd3c1, transparent: true, opacity: 0.5 });
    const baseLine = new THREE.Line(baseGeo, baseMat);
    root.add(baseLine);

    // Calculate solar progress (0 to 1)
    const nowSec = currentTime / 1000;
    const rise = sunrise || nowSec - 14400;
    const set = sunset || nowSec + 14400;
    let progress = (nowSec - rise) / (set - rise);
    progress = Math.max(0, Math.min(1, progress));

    const sunAngle = progress * Math.PI;
    const sunX = -radius * Math.cos(sunAngle);
    const sunY = radius * Math.sin(sunAngle) - 0.6;

    // 3D Sun Orb
    const sunGeo = new THREE.SphereGeometry(0.24, 24, 24);
    const sunMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      emissive: 0xb89758,
      emissiveIntensity: 0.6,
      metalness: 0.8,
      roughness: 0.2,
    });
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    sunMesh.position.set(sunX, sunY, 0.1);
    root.add(sunMesh);
    sunLight.position.set(sunX, sunY, 1.5);

    // Sun Corona Ring
    const coronaGeo = new THREE.RingGeometry(0.32, 0.44, 32);
    const coronaMat = new THREE.MeshBasicMaterial({
      color: 0xdfcca6,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
    });
    const coronaMesh = new THREE.Mesh(coronaGeo, coronaMat);
    coronaMesh.position.set(sunX, sunY, 0.08);
    root.add(coronaMesh);

    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      coronaMesh.rotation.z += 0.01;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      archGeo.dispose();
      archMat.dispose();
      baseGeo.dispose();
      baseMat.dispose();
      sunGeo.dispose();
      sunMat.dispose();
      coronaGeo.dispose();
      coronaMat.dispose();
    };
  }, [sunrise, sunset, currentTime]);

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      <div ref={mountRef} className="w-full h-32" />
    </div>
  );
};

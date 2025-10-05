"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function OrbitalGlobe() {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    const mount = mountRef.current;
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;
    mount.appendChild(renderer.domElement);

    // Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020617);
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 6);

    // Lights
    scene.add(new THREE.AmbientLight(0x88aaff, 0.6));
    const dir = new THREE.DirectionalLight(0x88ccff, 0.8);
    dir.position.set(5, 3, 5);
    scene.add(dir);

    // Earth placeholder sphere
    const geometry = new THREE.SphereGeometry(2, 48, 48);
    const material = new THREE.MeshStandardMaterial({
      color: 0x0ea5e9,
      roughness: 0.8,
      metalness: 0.1,
      emissive: 0x001122,
      emissiveIntensity: 0.2,
    });
    const earth = new THREE.Mesh(geometry, material);
    scene.add(earth);

    // Simple star points
    const starsGeom = new THREE.BufferGeometry();
    const starCount = 300;
    const positions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    starsGeom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const starsMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.02 });
    const stars = new THREE.Points(starsGeom, starsMat);
    scene.add(stars);

    let stop = false;
    const animate = () => {
      if (stop) return;
      earth.rotation.y += 0.0025;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      if (!mountRef.current || !rendererRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      rendererRef.current.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    return () => {
      stop = true;
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      starsGeom.dispose();
      geometry.dispose();
      material.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  // Keyboard toggle for full-screen: 'f' to toggle, 'Escape' to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "f" || e.key === "F") {
        setExpanded((prev) => !prev);
        try { window.dispatchEvent(new Event("resize")); } catch {}
      } else if (e.key === "Escape") {
        setExpanded(false);
        try { window.dispatchEvent(new Event("resize")); } catch {}
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className={`${expanded ? "fixed inset-0 z-50" : "relative"} w-full ${expanded ? "h-screen" : "h-[70vh] min-h-[480px]"} rounded-lg border border-slate-800/60 glass-panel`}>
      <div className="absolute right-3 top-3 z-20">
        <button
          onClick={() => { setExpanded((e) => !e); try { window.dispatchEvent(new Event("resize")); } catch {} }}
          className="rounded border border-slate-700 bg-[#0b0f14] px-2 py-1 text-xs text-slate-300 hover:bg-slate-800"
        >
          {expanded ? "Close" : "Expand"}
        </button>
      </div>
      <div className="absolute inset-0" ref={mountRef} />
    </div>
  );
}
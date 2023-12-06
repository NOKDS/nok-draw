import { useEffect, useRef } from "react";
import * as THREE from "three";

const StarsAnimation2 = () => {
  const starsRef = useRef<THREE.Points>();

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document
      .getElementById("three-js-container")
      ?.appendChild(renderer.domElement);

    const numStars = 1000;
    const starsGeometry = new THREE.BufferGeometry();
    const starsPositions = new Float32Array(numStars * 3);

    for (let i = 0; i < numStars; i++) {
      starsPositions[i * 3] = (Math.random() - 0.5) * 50;
      starsPositions[i * 3 + 1] = (Math.random() - 0.5) * 50;
      starsPositions[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }

    starsGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(starsPositions, 3)
    );

    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.1,
    });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    camera.position.z = 30;

    const animate = () => {
      requestAnimationFrame(animate);

      camera.position.z -= 0.1;

      if (camera.position.z < -20) {
        camera.position.z = 30;
      }

      renderer.render(scene, camera);
    };

    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      id="three-js-container"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
      }}
    />
  );
};

export default StarsAnimation2;

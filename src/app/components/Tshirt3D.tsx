import React, { useRef, useEffect } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import {
  Environment,
  ContactShadows,
  useGLTF,
  PerspectiveCamera,
  OrbitControls,
} from "@react-three/drei";
import * as THREE from "three";

// Props for the new tshirt3.glb model
// Each mesh gets its own image texture prop, except 'base' which gets a color
//
type Props = {
  baseColor?: string;
  backfullImage?: string;
  backupperImage?: string;
  frontfullImage?: string;
  leftImage?: string;
  rightImage?: string;
};

// Component to load and display a GLB model from public directory
const GLBModel: React.FC<Props> = ({
  baseColor = "white",
  backfullImage,
  backupperImage,
  frontfullImage,
  leftImage,
  rightImage,
}) => {
  const meshRef = useRef<any>(null);
  const { scene } = useGLTF("/tshirt3.glb") as any;

  // Load textures only if images are provided
  const loadTexture = (url?: string) => {
    if (!url) return null;
    const tex = useLoader(THREE.TextureLoader, url);
    if (tex) tex.flipY = false; // Fix flipped images for GLB UVs
    return tex;
  };
  const backfullTexture = loadTexture(backfullImage);
  const backupperTexture = loadTexture(backupperImage);
  const frontfullTexture = loadTexture(frontfullImage);
  const leftTexture = loadTexture(leftImage);
  const rightTexture = loadTexture(rightImage);

  useEffect(() => {
    if (!scene) return;
    // Find the main mesh group (if needed, or just use scene)
    scene.traverse((child: any) => {
      if (child.isMesh && child.material) {
        switch (child.name) {
          case "base":
            child.material.color = new THREE.Color(baseColor);
            child.material.map = null;
            child.material.transparent = false;
            child.material.needsUpdate = true;
            break;
          case "backfull":
            child.material.map = backfullTexture;
            child.material.transparent = true;
            child.material.alphaTest = 0.01;
            child.material.needsUpdate = true;
            break;
          case "backupper":
            child.material.map = backupperTexture;
            child.material.transparent = true;
            child.material.alphaTest = 0.01;
            child.material.needsUpdate = true;
            break;
          case "frontfull":
            child.material.map = frontfullTexture;
            child.material.transparent = true;
            child.material.alphaTest = 0.01;
            child.material.needsUpdate = true;
            break;
          case "left":
            child.material.map = leftTexture;
            child.material.transparent = true;
            child.material.alphaTest = 0.01;
            child.material.needsUpdate = true;
            break;
          case "right":
            child.material.map = rightTexture;
            child.material.transparent = true;
            child.material.alphaTest = 0.01;
            child.material.needsUpdate = true;
            break;
          default:
            break;
        }
      }
    });
  }, [
    scene,
    baseColor,
    backfullTexture,
    backupperTexture,
    frontfullTexture,
    leftTexture,
    rightTexture,
  ]);

  return (
    <>
      <primitive
        ref={meshRef}
        object={scene}
        scale={0.2}
        position={[0, 2, 0]}
        castShadow
      />
      <ContactShadows
        position={[0, -0.5, 0]}
        opacity={1}
        width={3}
        height={3}
        blur={0.7}
        far={1.5}
      />
    </>
  );
};

const Tshirt3D: React.FC<Props> = (props) => {
  return (
    <Canvas
      className="tshirt3d-canvas"
      style={{ width: "100%", height: "100%", background: "transparent" }}
      gl={{ alpha: true, antialias: true }}
    >
      <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={50} />
      <Environment preset="city" />
      <OrbitControls
        enableZoom={false}
        target={[0, 2, 0]}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.8}
      />
      <GLBModel {...props} />
    </Canvas>
  );
};

export default Tshirt3D;

// Preload the model for better performance
// @ts-ignore
useGLTF.preload && useGLTF.preload("/tshirt3.glb");

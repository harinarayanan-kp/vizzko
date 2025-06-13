import React, { useRef, useEffect } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

// Props now include baseColor
type Props = {
  frontImage?: string; // URL or base64
  backImage?: string; // URL or base64
  baseColor?: string; // HEX or CSS color string, e.g. "#ffffff"
};

// Component to load and display a GLB model from public directory
const GLBModel: React.FC<Props> = ({
  frontImage,
  backImage,
  baseColor = "#ffffff",
}) => {
  const meshRef = useRef<any>(null);
  const { scene } = useGLTF("/scene.gltf") as any;

  // Load textures only if images are provided
  const frontTexture = frontImage
    ? useLoader(THREE.TextureLoader, frontImage)
    : null;
  const backTexture = backImage
    ? useLoader(THREE.TextureLoader, backImage)
    : null;

  useEffect(() => {
    if (!scene) return;

    // Find the main mesh group
    const tshirtGroup = scene.getObjectByName("t-shirtmain");
    if (!tshirtGroup) return;

    // Traverse children to find meshes with the correct materials
    tshirtGroup.traverse((child: any) => {
      if (child.isMesh && child.material) {
        // Assign base color to BASE material
        if (child.material.name === "BASE") {
          child.material.color = new THREE.Color(baseColor);
          child.material.needsUpdate = true;
        }
        // Assign front texture
        if (child.material.name === "Material.FRONT" && frontTexture) {
          child.material.map = frontTexture;
          child.material.transparent = true;
          child.material.alphaTest = 0.1; // Optional: helps with hard edges
          child.material.needsUpdate = true;
        }
        // Assign back texture
        if (child.material.name === "Material.BACK.001" && backTexture) {
          child.material.map = backTexture;
          child.material.transparent = true;
          child.material.alphaTest = 0.1;
          child.material.needsUpdate = true;
        }
      }
    });
  }, [scene, frontTexture, backTexture, baseColor]);

  return (
    <primitive
      ref={meshRef}
      object={scene}
      scale={0.2}
      position={[0, 0.5, 0]}
    />
  );
};

const Tshirt3D: React.FC<Props> = (props) => (
  <Canvas
    className="tshirt3d-canvas"
    style={{ width: "100%", height: "100%", background: "transparent" }}
    gl={{ alpha: true }}
  >
    <ambientLight intensity={0.7} color="white" />
    <GLBModel {...props} />
    <OrbitControls enablePan={false} enableZoom={false} />
  </Canvas>
);

export default Tshirt3D;

// Preload the model for better performance
// @ts-ignore
useGLTF.preload && useGLTF.preload("/scene.gltf");

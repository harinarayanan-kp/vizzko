import React, { useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { TextureLoader } from "three";

// Pass a base64 image string or URL as prop
type Props = {
  image?: string; // base64 string or image URL
};

// Component to load and display a GLB model from public directory
const GLBModel: React.FC<Props> = ({ image }) => {
  const meshRef = useRef<any>(null);
  const { scene } = useGLTF("/tshirt.glb") as any;

  // Load texture if image is provided
  const texture = image
    ? useLoader(TextureLoader, image.startsWith("data:") ? image : `data:image/png;base64,${image}`)
    : null;

  // Apply texture to the mesh named "T_Shirt_Shirt_0"
  React.useEffect(() => {
    scene.traverse((child: any) => {
      if (child.isMesh && child.name === "T_Shirt_Shirt_0" && texture) {
        child.material.map = texture;
        child.material.needsUpdate = true;
      }
    });
  }, [scene, texture]);

  

  // Attach ref to the scene's first child if possible
  React.useEffect(() => {
    if (
      scene &&
      scene.children &&
      scene.children.length > 0 &&
      meshRef.current === null
    ) {
      meshRef.current = scene.children[0];
    }
  }, [scene]);

  return <primitive ref={meshRef} object={scene} scale={0.8} position={[0, 0, 0]} />;
};

const Tshirt3D: React.FC<Props> = ({ image }) => (
  <Canvas style={{ height: 600, width: 600, backgroundColor: "#f0f0f0" }}>
    <ambientLight intensity={0.7} color="white" />
    <directionalLight position={[5, 5, 5]} color="white" />
    <GLBModel image={image} />
    <OrbitControls enablePan={false} enableZoom={false} />
  </Canvas>
);

export default Tshirt3D;

// Preload the model for better performance
// @ts-ignore
useGLTF.preload && useGLTF.preload("/tshirt.glb");

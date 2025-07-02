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
  const meshRef = useRef<THREE.Group | THREE.Mesh>(null);
  const { scene } = useGLTF("/tshirt3.glb") as { scene: THREE.Group };

  // Always call useLoader in the same order, use a placeholder if not provided
  const PLACEHOLDER = "/front_sample.png"; // Make sure this exists in public/
  const backfullTexture = useLoader(
    THREE.TextureLoader,
    backfullImage || PLACEHOLDER
  );
  const backupperTexture = useLoader(
    THREE.TextureLoader,
    backupperImage || PLACEHOLDER
  );
  const frontfullTexture = useLoader(
    THREE.TextureLoader,
    frontfullImage || PLACEHOLDER
  );
  const leftTexture = useLoader(THREE.TextureLoader, leftImage || PLACEHOLDER);
  const rightTexture = useLoader(
    THREE.TextureLoader,
    rightImage || PLACEHOLDER
  );

  // FlipY fix only if the prop is provided
  if (backfullImage && backfullTexture) backfullTexture.flipY = false;
  if (backupperImage && backupperTexture) backupperTexture.flipY = false;
  if (frontfullImage && frontfullTexture) frontfullTexture.flipY = false;
  if (leftImage && leftTexture) leftTexture.flipY = false;
  if (rightImage && rightTexture) rightTexture.flipY = false;

  useEffect(() => {
    if (!scene) return;
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh && (child as THREE.Mesh).material) {
        const mesh = child as THREE.Mesh;
        switch (mesh.name) {
          case "base":
            (mesh.material as THREE.MeshStandardMaterial).color =
              new THREE.Color(baseColor);
            (mesh.material as THREE.MeshStandardMaterial).map = null;
            (mesh.material as THREE.MeshStandardMaterial).transparent = false;
            (mesh.material as THREE.MeshStandardMaterial).opacity = 1;
            (mesh.material as THREE.MeshStandardMaterial).needsUpdate = true;
            break;
          case "backfull":
            (mesh.material as THREE.MeshStandardMaterial).map = backfullImage
              ? backfullTexture
              : null;
            (mesh.material as THREE.MeshStandardMaterial).transparent = true;
            (mesh.material as THREE.MeshStandardMaterial).alphaTest = 0.01;
            (mesh.material as THREE.MeshStandardMaterial).opacity =
              backfullImage ? 1 : 0;
            (mesh.material as THREE.MeshStandardMaterial).needsUpdate = true;
            break;
          case "backupper":
            (mesh.material as THREE.MeshStandardMaterial).map = backupperImage
              ? backupperTexture
              : null;
            (mesh.material as THREE.MeshStandardMaterial).transparent = true;
            (mesh.material as THREE.MeshStandardMaterial).alphaTest = 0.01;
            (mesh.material as THREE.MeshStandardMaterial).opacity =
              backupperImage ? 1 : 0;
            (mesh.material as THREE.MeshStandardMaterial).needsUpdate = true;
            break;
          case "frontfull":
            (mesh.material as THREE.MeshStandardMaterial).map = frontfullImage
              ? frontfullTexture
              : null;
            (mesh.material as THREE.MeshStandardMaterial).transparent = true;
            (mesh.material as THREE.MeshStandardMaterial).alphaTest = 0.01;
            (mesh.material as THREE.MeshStandardMaterial).opacity =
              frontfullImage ? 1 : 0;
            (mesh.material as THREE.MeshStandardMaterial).needsUpdate = true;
            break;
          case "left":
            (mesh.material as THREE.MeshStandardMaterial).map = leftImage
              ? leftTexture
              : null;
            (mesh.material as THREE.MeshStandardMaterial).transparent = true;
            (mesh.material as THREE.MeshStandardMaterial).alphaTest = 0.01;
            (mesh.material as THREE.MeshStandardMaterial).opacity = leftImage
              ? 1
              : 0;
            (mesh.material as THREE.MeshStandardMaterial).needsUpdate = true;
            break;
          case "right":
            (mesh.material as THREE.MeshStandardMaterial).map = rightImage
              ? rightTexture
              : null;
            (mesh.material as THREE.MeshStandardMaterial).transparent = true;
            (mesh.material as THREE.MeshStandardMaterial).alphaTest = 0.01;
            (mesh.material as THREE.MeshStandardMaterial).opacity = rightImage
              ? 1
              : 0;
            (mesh.material as THREE.MeshStandardMaterial).needsUpdate = true;
            break;
          default:
            break;
        }
      }
    });
  }, [
    scene,
    baseColor,
    backfullImage,
    backupperImage,
    frontfullImage,
    leftImage,
    rightImage,
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
if (useGLTF.preload) useGLTF.preload("/tshirt3.glb");

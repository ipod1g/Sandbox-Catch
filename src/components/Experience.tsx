import * as THREE from "three";
import {
  Box,
  MeshReflectorMaterial,
  CameraControls,
  Cloud,
  Clouds,
  Sky,
  useTexture,
} from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { ShipController } from "./ShipController";
import { People } from "./People";
import { useEffect, useRef } from "react";
import { DEG2RAD } from "three/src/math/MathUtils";

export const Experience = () => {
  const camControl = useRef();
  const texture = useTexture("/images/bg1.png");

  useEffect(() => {
    // Should happen on game start
    // camControl.current.truck(0, -4);
  }, []);

  return (
    <>
      <CameraControls
        makeDefault
        ref={camControl}
        maxPolarAngle={DEG2RAD * 95}
        minPolarAngle={DEG2RAD * 45}
        maxAzimuthAngle={DEG2RAD * 2}
        minAzimuthAngle={DEG2RAD * -2}
        maxDistance={20}
        minDistance={16}
        onEnd={() => {
          camControl.current.setLookAt(0.4, 1, 20, 0, 5, 0, true);
        }}
      />

      {/* LIGHTS */}
      <ambientLight intensity={1} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={0.8}
        castShadow
        color={"#a5d6ff"}
      />

      {/* BACKGROUND */}
      <Sky />
      <Clouds
        material={THREE.MeshBasicMaterial}
        limit={44}
        position={[0, 13, -1]}
      >
        <Cloud
          segments={20}
          scale={2}
          bounds={[10, 2, 5]}
          volume={4}
          color="white"
        />
        <Cloud
          seed={1}
          scale={2}
          bounds={[10, 2, 5]}
          volume={6}
          color="gray"
          fade={100}
        />

        <Cloud
          seed={1}
          scale={2}
          bounds={[10, 2, 5]}
          volume={6}
          color="black"
          fade={100}
        />
      </Clouds>

      <mesh position={[0, -4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <MeshReflectorMaterial
          mirror={0.75}
          blur={[400, 400]}
          resolution={1024}
          mixBlur={1}
          mixStrength={15}
          depthScale={1}
          minDepthThreshold={0.85}
          color="#dbecfb"
          metalness={0.6}
          roughness={1}
        />
      </mesh>

      <mesh position={[0, 8, -10]} rotation={[0, 0, 0]}>
        <planeGeometry args={[48, 24]} />
        <meshBasicMaterial resolution={1024} map={texture} />
      </mesh>

      <group position-y={-1}>
        {/* STAGE */}
        {/* will replace with water */}
        <RigidBody
          // colliders={false}
          type="fixed"
          position-y={-0.5}
          friction={1}
          args={[32, 4]}
        >
          <Box scale={[32, 1, 4]}>
            <meshStandardMaterial color="skyblue" />
          </Box>
        </RigidBody>

        {/* CHARACTER */}
        <ShipController />
        <People />
      </group>
    </>
  );
};

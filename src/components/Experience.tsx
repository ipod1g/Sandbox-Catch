import * as THREE from "three";
import {
  Box,
  CameraControls,
  Cloud,
  Clouds,
  Sky,
  useTexture,
} from "@react-three/drei";
import { extend, useThree, useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { ShipController } from "./ShipController";
import { Pirate } from "./Pirate";
import { useMemo, useRef } from "react";
import { DEG2RAD } from "three/src/math/MathUtils";
import { Water } from "three-stdlib";

extend({ Water });

export const Experience = () => {
  const camControl = useRef();
  const texture = useTexture("/images/bg1.png");

  return (
    <>
      <CameraControls
        makeDefault
        ref={camControl}
        maxPolarAngle={DEG2RAD * 95}
        minPolarAngle={DEG2RAD * 45}
        maxAzimuthAngle={DEG2RAD * 2}
        minAzimuthAngle={DEG2RAD * -2}
        // maxDistance={20}
        // TODO: maybe zoom out if dimension change?
        minDistance={16}
        onEnd={() => {
          // TODO: also add this lookAt mechanics to menu interaction
          camControl.current.setLookAt(0.4, 5, 20, 0, 5, 0, true);
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
      <Sky scale={1000} sunPosition={[500, 150, -1000]} turbidity={0.1} />
      {/* TODO: Animte clouds */}
      <Clouds
        material={THREE.MeshBasicMaterial}
        limit={30}
        position={[0, 12, 1]}
      >
        <Cloud
          seed={1}
          segments={20}
          scale={2}
          bounds={[10, 2, 5]}
          volume={4}
          color="#ececec"
        />
        <Cloud
          seed={1}
          scale={2}
          bounds={[10, 2, 5]}
          volume={4}
          color="gray"
          fade={100}
        />
        <Cloud
          seed={1}
          scale={2}
          bounds={[10, 2, 5]}
          volume={5}
          color="#2b2415"
          fade={100}
        />
      </Clouds>

      <mesh position={[0, 8, -10]} rotation={[0, 0, 0]}>
        <planeGeometry args={[48, 24]} />
        <meshBasicMaterial resolution={1024} map={texture} />
      </mesh>

      <Ocean />

      <group position-y={-0.5}>
        {/* STAGE */}
        <RigidBody
          // colliders={false}
          name="floor"
          type="fixed"
          position-y={-2}
          friction={1}
          args={[32, 4]}
        >
          <Box scale={[32, 1, 4]}>
            <meshStandardMaterial color="skyblue" />
          </Box>
        </RigidBody>

        {/* CHARACTER */}
        <ShipController />
        <Pirate />
      </group>
    </>
  );
};

function Ocean() {
  const ref = useRef();
  const gl = useThree((state) => state.gl);
  const waterNormals = useTexture("/images/waternormals.jpeg");
  waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
  const geom = useMemo(() => new THREE.PlaneGeometry(100, 100), []);
  const config = useMemo(
    () => ({
      textureWidth: 512,
      textureHeight: 512,
      waterNormals,
      sunDirection: new THREE.Vector3(),
      sunColor: 0x5cc8cd,
      waterColor: 0x2fa7af,
      // waterColor: 0x001e0f,
      distortionScale: 3.7,
      fog: true,
      format: gl.encoding,
    }),
    [gl.encoding, waterNormals]
  );
  useFrame(
    (state, delta) => (ref.current.material.uniforms.time.value += delta)
  );
  return (
    <water
      ref={ref}
      args={[geom, config]}
      rotation-x={-Math.PI / 2}
      position={[0, -0.5, 0]}
    />
  );
}

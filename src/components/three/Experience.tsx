import { Box, CameraControls, Cloud, Clouds, Sky } from "@react-three/drei";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useControls } from "leva";
import { useCallback, useEffect, useRef } from "react";
import { MathUtils, MeshBasicMaterial } from "three";

import BackgroundPanel from "@/components/three/BackgroundPanel";
import Ocean from "@/components/three/Ocean";
import { Pirate } from "@/components/three/Pirate";
import { ShipController } from "@/components/three/ShipController";
import { screen, DEBUG } from "@/config/game";
import useGameStore from "@/store/game";

import type {
  Mesh,
  BufferGeometry,
  NormalBufferAttributes,
  Material,
  Object3DEventMap,
} from "three";

export const Experience = () => {
  const camControl = useRef<CameraControls>(null);
  const meshFitCameraGame =
    useRef<
      Mesh<
        BufferGeometry<NormalBufferAttributes>,
        Material | Material[],
        Object3DEventMap
      >
    >(null);

  const screenState = useGameStore((state) => state.screenState);

  const {
    maxAzimuthAngle,
    maxDistance,
    maxPolarAngle,
    minAzimuthAngle,
    minDistance,
    minPolarAngle,
  } = useControls("Camera Restrict", {
    maxPolarAngle: {
      value: 95,
      step: 5,
      min: 45,
      max: 120,
    },
    minPolarAngle: {
      value: 45,
      step: 5,
      min: 20,
      max: 95,
    },
    maxAzimuthAngle: {
      value: 8,
      step: 1,
      min: -20,
      max: 20,
    },
    minAzimuthAngle: {
      value: -8,
      step: 1,
      min: -20,
      max: 20,
    },
    minDistance: {
      value: 16,
      step: 1,
      min: 5,
      max: 20,
    },
    maxDistance: {
      value: 45,
      step: 1,
      min: 16,
      max: 50,
    },
  });

  const camConfig = useControls("Camera", {
    menuPos: {
      value: [-16, 17, 14],
      step: 1,
      min: -50,
      max: 50,
    },
    menuTarget: {
      value: [-4, 7, 2],
      step: 1,
      min: -50,
      max: 50,
    },
    gamePos: {
      value: [0.4, 5, 20],
      step: 1,
      min: -50,
      max: 50,
    },
    gameTarget: {
      value: [0, 5, 0],
      step: 1,
      min: -50,
      max: 50,
    },
  });

  const skyConfig = useControls("Sky", {
    sunPosition: {
      value: [500, 150, 0],
      step: 10,
      min: -1000,
      max: 1000,
    },
    turbidity: {
      value: 0.1,
      step: 0.1,
      min: -1,
      max: 20,
    },
    scale: {
      value: 1000,
      step: 100,
      min: 100,
      max: 2000,
    },
  });

  const cloudConfig = useControls("Cloud", {
    position: {
      value: [0, 19, 1],
      step: 1,
      min: -15,
      max: 50,
    },
    bounds: {
      value: [22, -3, 16],
      step: 1,
      min: -90,
      max: 90,
    },
    scale: {
      value: 0.6,
      step: 0.1,
      min: 0,
      max: 1,
    },
    volume: {
      value: 32,
      step: 1,
      min: 1,
      max: 40,
    },
  });

  const testConfig = useControls("Test", {
    spawnSize: {
      value: [20, 2, 1],
      step: 1,
      min: -100,
      max: 100,
    },
    viewSize: {
      value: [20.5, 14, 5],
      step: 0.5,
      min: -100,
      max: 100,
    },
  });

  const fitCamera = useCallback(async () => {
    if (!camControl.current || !meshFitCameraGame.current) return;

    if (screenState === screen.GAME) {
      camControl.current.fitToBox(meshFitCameraGame.current, true);
    }
  }, [camControl, screenState, meshFitCameraGame]);

  useEffect(() => {
    if (!camControl.current) return;

    if (screenState === screen.MENU) {
      const {
        menuPos: [posX, posY, posZ],
        menuTarget: [targetX, targetY, targetZ],
      } = camConfig;

      camControl.current.setLookAt(
        posX,
        posY,
        posZ,
        targetX,
        targetY,
        targetZ,
        true
      );
    }
    if (screenState === screen.GAME) {
      const {
        gamePos: [posX, posY, posZ],
        gameTarget: [targetX, targetY, targetZ],
      } = camConfig;

      camControl.current.setLookAt(
        posX,
        posY,
        posZ,
        targetX,
        targetY,
        targetZ,
        true
      );
    }
    fitCamera();
  }, [screenState, camConfig, fitCamera]);

  useEffect(() => {
    window.addEventListener("resize", fitCamera);
    return () => window.removeEventListener("resize", fitCamera);
  }, [fitCamera]);

  return (
    <>
      <CameraControls
        makeDefault
        maxAzimuthAngle={MathUtils.DEG2RAD * maxAzimuthAngle}
        maxDistance={maxDistance}
        maxPolarAngle={MathUtils.DEG2RAD * maxPolarAngle}
        minAzimuthAngle={MathUtils.DEG2RAD * minAzimuthAngle}
        minDistance={minDistance}
        minPolarAngle={MathUtils.DEG2RAD * minPolarAngle}
        onEnd={() => {
          fitCamera();
        }}
        ref={camControl}
      />

      {/* LIGHTS */}
      <ambientLight intensity={1} />
      <directionalLight
        color={"#a5d6ff"}
        intensity={0.8}
        position={[5, 5, 5]}
        // castShadow
      />

      {/* BACKGROUND */}
      <Sky {...skyConfig} />

      {/* TODO: Animate clouds */}
      <Clouds
        limit={120}
        material={MeshBasicMaterial}
        position={cloudConfig.position}
      >
        <Cloud
          bounds={cloudConfig.bounds}
          color="#ececec"
          scale={cloudConfig.scale}
          seed={1}
          segments={20}
          volume={cloudConfig.volume}
        />
        <Cloud
          bounds={cloudConfig.bounds}
          color="gray"
          fade={100}
          scale={cloudConfig.scale}
          seed={1}
          volume={cloudConfig.volume}
        />
      </Clouds>

      <mesh position={[0, 5, 0]} ref={meshFitCameraGame} visible={false}>
        <boxGeometry
          // the y gives the restriction for landscape windows
          // the x gives the restriction for portrait windows
          args={[
            testConfig.viewSize[0],
            testConfig.viewSize[1],
            testConfig.viewSize[2],
          ]}
        />
        <meshBasicMaterial color="red" opacity={0.3} transparent />
      </mesh>

      <BackgroundPanel />
      <Ocean />

      {/* SPAWNING ZONE TEST */}
      {DEBUG && (
        <mesh position={[0, 22, 0]} visible={true}>
          <boxGeometry
            // the y gives the restriction for landscape windows
            // the x gives the restriction for portrait windows
            args={[testConfig.spawnSize[0], testConfig.spawnSize[1], 1]}
          />
          <meshBasicMaterial color="green" opacity={0.3} transparent />
        </mesh>
      )}

      <group position-y={-0.5}>
        {/* STAGE */}
        <RigidBody
          args={[32, 5]}
          friction={1}
          name="floor"
          position-y={-2}
          type="fixed"
        >
          <Box scale={[32, 1, 2]}>
            {DEBUG ? (
              <meshStandardMaterial color="skyblue" />
            ) : (
              <meshStandardMaterial opacity={0} transparent />
            )}
          </Box>
        </RigidBody>

        {/* LEFT WALL */}
        <RigidBody
          args={[3, 5]}
          friction={1}
          name="left-wall"
          position={[-14.5, 1, 0]}
          type="fixed"
        >
          <Box scale={[3, 5, 2]}>
            {DEBUG ? (
              <meshStandardMaterial color="red" />
            ) : (
              <meshStandardMaterial opacity={0} transparent />
            )}
          </Box>
        </RigidBody>

        {/* RIGHT WALL */}
        <RigidBody
          args={[3, 5]}
          friction={1}
          name="right-wall"
          position={[14.5, 1, 0]}
          type="fixed"
        >
          <Box scale={[3, 5, 2]}>
            {DEBUG ? (
              <meshStandardMaterial color="red" />
            ) : (
              <meshStandardMaterial opacity={0} transparent />
            )}
          </Box>
        </RigidBody>

        {/* VOID */}
        <RigidBody colliders={false} name="void" type="fixed">
          <mesh position={[0, -5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[50, 50]} />
            <meshBasicMaterial color="#000000" toneMapped={false} />
          </mesh>
          <CuboidCollider args={[25, 0.1, 25]} position={[0, -5, 0]} sensor />
        </RigidBody>
      </group>

      {/* CHARACTER */}
      <ShipController />

      {/* DROPPING PIRATES */}
      <Pirate />
    </>
  );
};

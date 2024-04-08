import {
  Box,
  CameraControls,
  Cloud,
  Clouds,
  Sky,
  useTexture,
} from "@react-three/drei";
import { Object3DNode, extend, useFrame } from "@react-three/fiber";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { ShipController } from "./ShipController";
import { Pirate } from "./Pirate";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { Water } from "three-stdlib";
import { useControls } from "leva";
import {
  MathUtils,
  MeshBasicMaterial,
  PlaneGeometry,
  RepeatWrapping,
  Vector3,
} from "three";
import type {
  Mesh,
  BufferGeometry,
  NormalBufferAttributes,
  Material,
  Object3DEventMap,
} from "three";
import useGameStore from "@/store/game";
import { screen, DEBUG } from "@/config/game";

extend({ Water });

declare module "@react-three/fiber" {
  interface ThreeElements {
    water: Object3DNode<Water, typeof Water>;
  }
}

export const Experience = () => {
  const camControl = useRef<CameraControls>(null);
  // const meshFitCameraMenu =
  //   useRef<
  //     Mesh<
  //       BufferGeometry<NormalBufferAttributes>,
  //       Material | Material[],
  //       Object3DEventMap
  //     >
  //   >(null);
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
        ref={camControl}
        maxPolarAngle={MathUtils.DEG2RAD * maxPolarAngle}
        minPolarAngle={MathUtils.DEG2RAD * minPolarAngle}
        maxAzimuthAngle={MathUtils.DEG2RAD * maxAzimuthAngle}
        minAzimuthAngle={MathUtils.DEG2RAD * minAzimuthAngle}
        minDistance={minDistance}
        maxDistance={maxDistance}
        onEnd={() => {
          fitCamera();
        }}
      />

      {/* LIGHTS */}
      <ambientLight intensity={1} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={0.8}
        // castShadow
        color={"#a5d6ff"}
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

      <mesh ref={meshFitCameraGame} position={[0, 5, 0]} visible={false}>
        <boxGeometry
          // the y gives the restriction for landscape windows
          // the x gives the restriction for portrait windows
          args={[
            testConfig.viewSize[0],
            testConfig.viewSize[1],
            testConfig.viewSize[2],
          ]}
        />
        <meshBasicMaterial color="red" transparent opacity={0.3} />
      </mesh>

      <BackgroundPanel />

      {/* SPAWNING ZONE TEST */}
      {DEBUG && (
        <mesh position={[0, 22, 0]} visible={true}>
          <boxGeometry
            // the y gives the restriction for landscape windows
            // the x gives the restriction for portrait windows
            args={[testConfig.spawnSize[0], testConfig.spawnSize[1], 1]}
          />
          <meshBasicMaterial color="green" transparent opacity={0.3} />
        </mesh>
      )}

      <Ocean />

      <group position-y={-0.5}>
        {/* STAGE */}
        <RigidBody
          name="floor"
          type="fixed"
          position-y={-2}
          friction={1}
          args={[32, 5]}
        >
          <Box scale={[32, 1, 2]}>
            {DEBUG ? (
              <meshStandardMaterial color="skyblue" />
            ) : (
              <meshStandardMaterial transparent opacity={0} />
            )}
          </Box>
        </RigidBody>

        {/* LEFT WALL */}
        <RigidBody
          name="left-wall"
          type="fixed"
          position={[-14.5, 1, 0]}
          friction={1}
          args={[3, 5]}
        >
          <Box scale={[3, 5, 2]}>
            {DEBUG ? (
              <meshStandardMaterial color="red" />
            ) : (
              <meshStandardMaterial transparent opacity={0} />
            )}
          </Box>
        </RigidBody>

        {/* RIGHT WALL */}
        <RigidBody
          name="right-wall"
          type="fixed"
          position={[14.5, 1, 0]}
          friction={1}
          args={[3, 5]}
        >
          <Box scale={[3, 5, 2]}>
            {DEBUG ? (
              <meshStandardMaterial color="red" />
            ) : (
              <meshStandardMaterial transparent opacity={0} />
            )}
          </Box>
        </RigidBody>

        {/* VOID */}
        <RigidBody colliders={false} type="fixed" name="void">
          <mesh position={[0, -5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[50, 50]} />
            <meshBasicMaterial color="#000000" toneMapped={false} />
          </mesh>
          <CuboidCollider position={[0, -5, 0]} args={[25, 0.1, 25]} sensor />
        </RigidBody>
      </group>

      {/* CHARACTER */}
      <ShipController />
      <Pirate />
    </>
  );
};

function Ocean() {
  const ref = useRef<Water | null>(null);
  const waterNormals = useTexture("/images/waternormals.jpeg");
  waterNormals.wrapS = waterNormals.wrapT = RepeatWrapping;
  const geom = useMemo(() => new PlaneGeometry(180, 180), []);
  const config = useMemo(
    () => ({
      textureWidth: 512,
      textureHeight: 512,
      waterNormals,
      sunDirection: new Vector3(),
      sunColor: 0x5cc8cd,
      waterColor: 0x2fa7af,
      // waterColor: 0x001e0f,
      distortionScale: 3.7,
      fog: true,
    }),
    [waterNormals]
  );

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.material.uniforms.time.value += delta;
  });

  return (
    <water
      ref={ref}
      args={[geom, config]}
      rotation-x={-Math.PI / 2}
      position={[0, -0.5, 0]}
    />
  );
}

function BackgroundPanel({ children }: { children?: React.ReactNode }) {
  const texture = useTexture("/images/bg1.png");

  return (
    <mesh position={[0, 10, -13]} rotation={[0, 0, 0]}>
      <planeGeometry args={[64, 32]} />
      <meshBasicMaterial
        map={texture}
        // transparent
        // opacity={0}
      />
      {children}
    </mesh>
  );
}

useTexture.preload("/images/bg1.png");

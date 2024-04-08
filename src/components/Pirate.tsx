import { Cylinder, useTexture } from "@react-three/drei";
import {
  CylinderCollider,
  RigidBody,
  CollisionTarget,
} from "@react-three/rapier";
import {
  Pirate as IPirate,
  screen,
  useGameEngine,
} from "../hooks/useGameEngine";
import { Texture } from "three";
// import { FakeGlowMaterial } from "./three/FakeGlowMaterial";

export const Pirate = () => {
  const { pirates, drownedPirate, removePirate, addScore, screenState } =
    useGameEngine();

  const handleCollisionEnter = (
    { other }: { other: CollisionTarget },
    index: number,
    point: number
  ) => {
    if (!other.rigidBodyObject || screenState !== screen.GAME) return;

    if (other.rigidBodyObject.name === "floor") {
      // TODO: play drowning sound
      drownedPirate(index);
    }

    if (other.rigidBodyObject.name === "ship") {
      removePirate(index);
      if (pirates[index].drowned) return;
      addScore(point);
    }
  };

  return (
    <group>
      {pirates?.map((pirate: IPirate, index: number) => (
        <group key={pirate.name + JSON.stringify(pirate.position)}>
          <RigidBody
            restitution={0.5}
            colliders={false}
            onCollisionEnter={(e) =>
              handleCollisionEnter(e, index, pirate.point)
            }
            onIntersectionEnter={({ other }) => {
              if (!other.rigidBodyObject) return;
              if (other.rigidBodyObject.name === "void") {
                removePirate(index);
              }
            }}
            position={pirate.position}
            rotation={[Math.PI / 2, 0, 0]}
            gravityScale={0.3}
          >
            <CylinderCollider args={[0.25 / 2, 0.5]} />
            <TexturedCylinder img={pirate.img} />
            {/* <Text rotation={[Math.PI / 2, Math.PI, Math.PI]} anchorY={-1.5}>
              {pirate.drowned ? "💀" : pirate.point}
            </Text> */}
          </RigidBody>
        </group>
      ))}
    </group>
  );
};

const TexturedCylinder = ({ img }: { img: string }) => {
  const texture = useTexture(img) as Texture;

  return (
    <Cylinder scale={[0.5, 0, 0.5]} rotation={[0, Math.PI / 2, 0]}>
      {/* <mesh position={[0, 2, -0.5]}>
        <sphereGeometry args={[10, 2, 0]} />
        <FakeGlowMaterial glowColor={"0xffffff"} />
      </mesh> */}
      <meshBasicMaterial map={texture} transparent />
    </Cylinder>
  );
};

useTexture.preload("/images/p1.png");
useTexture.preload("/images/p2.png");
useTexture.preload("/images/p3.png");
useTexture.preload("/images/p4.png");
useTexture.preload("/images/e1.png");
useTexture.preload("/images/e2.png");

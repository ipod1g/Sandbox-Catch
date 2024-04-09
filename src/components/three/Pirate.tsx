import { Cylinder, useTexture } from "@react-three/drei";
import { CylinderCollider, RigidBody } from "@react-three/rapier";

import { screen } from "@/config/game";
import useGameStore, { useGameActions } from "@/store/game";

import type { Pirate as TPirate } from "@/types";
import type { CollisionTarget } from "@react-three/rapier";

export const Pirate = () => {
  const pirates = useGameStore((state) => state.pirates);
  const screenState = useGameStore((state) => state.screenState);
  const { addScore, drownedPirate, removePirate } = useGameActions();

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
      {pirates?.map((pirate: TPirate, index: number) => (
        <group key={pirate.name + JSON.stringify(pirate.position)}>
          <RigidBody
            colliders={false}
            gravityScale={0.25}
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
            restitution={0.5}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <CylinderCollider args={[0.25 / 2, 0.5]} />
            <TexturedCylinder img={pirate.img} points={pirate.point} />
          </RigidBody>
        </group>
      ))}
    </group>
  );
};

const TexturedCylinder = ({ img, points }: { img: string; points: number }) => {
  const texture = useTexture(img);

  const outlineColor = points > 0 ? "lightgreen" : "red";

  return (
    <>
      {/* Faux Outline */}
      <Cylinder rotation={[0, Math.PI / 2, 0]} scale={[0.5, 0, 0.5]}>
        <meshBasicMaterial attach="material" color={outlineColor} />
      </Cylinder>

      {/* Main Textured Cylinder */}
      <Cylinder rotation={[0, Math.PI / 2, 0]} scale={[0.5, 0.05, 0.5]}>
        <meshBasicMaterial map={texture} transparent />
      </Cylinder>
    </>
  );
};

useTexture.preload("/images/p1.png");
useTexture.preload("/images/p2.png");
useTexture.preload("/images/p3.png");
useTexture.preload("/images/p4.png");
useTexture.preload("/images/e1.png");
useTexture.preload("/images/e2.png");

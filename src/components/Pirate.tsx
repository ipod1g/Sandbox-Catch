import * as THREE from "three";
import { Center, Cylinder, Text3D, useTexture } from "@react-three/drei";
// @ts-expect-error -- TODO: fix this
import { CylinderCollider, RigidBody } from "@react-three/rapier";
import { useGameEngine } from "../hooks/useGameEngine";

export const Pirate = () => {
  const { pirates, removePirates, addScore } = useGameEngine();

  const handleCollisionEnter = ({ other }, point) => {
    if (other.rigidBodyObject.name === "ship") {
      addScore(point);
    }
    if (other.rigidBodyObject.name === "floor") {
      setTimeout(() => {
        // removePirates();
      }, 300);
    }
    // removePirates();
  };

  return (
    <group>
      {pirates?.map((pirate, index) => (
        <group key={pirate.position + index}>
          <RigidBody
            restitution={0.6}
            colliders={false}
            onCollisionEnter={(e) => handleCollisionEnter(e, pirate.point)}
            key={pirate.position}
            position={pirate.position}
            rotation={[Math.PI / 2, 0, 0]}
            gravityScale={0.3}
          >
            <CylinderCollider args={[0.25 / 2, 0.5]} />
            <TexturedCylinder img={pirate.img} />
          </RigidBody>

          {/* <Center position-y={0.8}>
            <Text3D font={"./fonts/Noto"} size={0.82}>
              ら
              <meshNormalMaterial />
            </Text3D>
          </Center> */}
        </group>
      ))}
    </group>
  );
};

const TexturedCylinder = ({ img }) => {
  const texture = useTexture(img);

  return (
    <Cylinder scale={[0.5, 0, 0.5]} rotation={[0, Math.PI / 2, 0]}>
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

import { Billboard, useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useRef } from "react";

import { Controls } from "@/App";
import { SHIP_MAX_VEL, SHIP_MOVEMENT_SPEED, screen } from "@/config/game";
import useGameStore from "@/store/game";

import ScoreText from "./ScoreText";
import Ship from "./Ship";

import type { RapierRigidBody } from "@react-three/rapier";
import type { Group, Object3DEventMap } from "three";

export const ShipController = () => {
  const leftPressed = useKeyboardControls((state) => state[Controls.left]);
  const rightPressed = useKeyboardControls((state) => state[Controls.right]);
  const mobileLeftPressed = useGameStore(
    (state) => state.mobileButton.leftPressed
  );
  const mobileRightPressed = useGameStore(
    (state) => state.mobileButton.rightPressed
  );

  const rigidbody = useRef<RapierRigidBody>(null);
  const ship = useRef<Group<Object3DEventMap>>(null);
  const isOnFloor = useRef(true);
  const screenState = useGameStore((state) => state.screenState);
  const scoreUpdateCounter = useGameStore((state) => state.scoreUpdateCounter);

  useFrame(() => {
    if (screenState !== screen.GAME) return;
    if (!rigidbody.current || !ship.current) return;

    const impulse = { x: 0, y: 0, z: 0 };

    if (rigidbody.current === undefined) return;
    const linvel = rigidbody.current.linvel();
    let changeRotation = false;
    if ((rightPressed || mobileRightPressed) && linvel.x < SHIP_MAX_VEL) {
      impulse.x += SHIP_MOVEMENT_SPEED * Math.abs(impulse.x) + 0.1;
      changeRotation = true;
    }
    if ((leftPressed || mobileLeftPressed) && linvel.x > -SHIP_MAX_VEL) {
      impulse.x -= SHIP_MOVEMENT_SPEED * Math.abs(impulse.x) + 0.1;
      changeRotation = true;
    }

    rigidbody.current.applyImpulse(impulse, true);
    if (changeRotation) {
      const angle = Math.atan2(linvel.x, linvel.z);
      ship.current.rotation.y = angle + Math.PI / 2;
    }
  });

  useFrame((state) => {
    if (!ship.current) return;

    const elapsedTime = state.clock.elapsedTime;

    ship.current.position.y = Math.sin(elapsedTime) * 0.5;
    ship.current.rotation.z = Math.sin(elapsedTime * 2) * 0.15;
  });

  return (
    <group>
      <RigidBody
        colliders={false}
        dominanceGroup={10}
        lockRotations
        name="ship"
        onCollisionEnter={() => {
          isOnFloor.current = true;
        }}
        ref={rigidbody}
        scale={[0.5, 0.5, 0.5]}
      >
        <CuboidCollider
          args={[4.5, 2, 1.5]}
          density={0.02}
          position={[0, 2, 0]}
        />
        <group ref={ship}>
          <Ship />
        </group>
        <Billboard
          follow={true}
          lockX={false}
          lockY={false}
          lockZ={false}
          position={[0, 9, 3]}
        >
          <ScoreText key={scoreUpdateCounter} />
        </Billboard>
      </RigidBody>
    </group>
  );
};

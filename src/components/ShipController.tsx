import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  CuboidCollider,
  RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";
import { useRef } from "react";
import { Controls } from "../App";
import Ship from "./Ship";
import { useGameEngine, screen } from "../hooks/useGameEngine";
import { Group, Object3DEventMap } from "three";

const MOVEMENT_SPEED = 0.8;
const MAX_VEL = 15;

export const ShipController = () => {
  const leftPressed = useKeyboardControls((state) => state[Controls.left]);
  const rightPressed = useKeyboardControls((state) => state[Controls.right]);
  const rigidbody = useRef<RapierRigidBody>(null);
  const ship = useRef<Group<Object3DEventMap>>(null);
  const isOnFloor = useRef(true);
  const { screenState } = useGameEngine();

  useFrame(() => {
    if (screenState !== screen.GAME) return;
    if (!rigidbody.current || !ship.current) return;

    const impulse = { x: 0, y: 0, z: 0 };

    if (rigidbody.current === undefined) return;
    const linvel = rigidbody.current.linvel();
    let changeRotation = false;
    if (rightPressed && linvel.x < MAX_VEL) {
      impulse.x += MOVEMENT_SPEED * Math.abs(impulse.x) + 0.1;
      changeRotation = true;
    }
    if (leftPressed && linvel.x > -MAX_VEL) {
      impulse.x -= MOVEMENT_SPEED * Math.abs(impulse.x) + 0.1;
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
        name="ship"
        ref={rigidbody}
        colliders={false}
        scale={[0.5, 0.5, 0.5]}
        onCollisionEnter={() => {
          isOnFloor.current = true;
        }}
        dominanceGroup={10}
        lockRotations
      >
        <CuboidCollider
          args={[4.5, 2, 1.5]}
          position={[0, 2, 0]}
          density={0.02}
        />
        <group ref={ship}>
          <Ship />
        </group>
      </RigidBody>
    </group>
  );
};

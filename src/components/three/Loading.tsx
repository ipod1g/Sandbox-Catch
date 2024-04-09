import { useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";

import type { Group, Object3DEventMap } from "three";

export const Loading = () => {
  const { viewport } = useThree();
  const groupRef = useRef<Group<Object3DEventMap> | null>(null);

  useEffect(() => {
    const { width, height } = viewport;
    groupRef.current?.scale.set(width, height, 1);
  }, [viewport]);

  return (
    <group ref={groupRef}>
      <mesh>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={useTexture("/images/bg2.png")} />
      </mesh>
    </group>
  );
};

useTexture.preload("/images/bg2.png");

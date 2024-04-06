import { useGLTF } from "@react-three/drei";
import { useRef } from "react";
import type { GroupProps } from "@react-three/fiber";
import type { Group, Object3DEventMap } from "three";

export default function Ship(props: GroupProps) {
  const group = useRef<Group<Object3DEventMap>>(null);
  const { scene } = useGLTF("./models/Ship_Large.gltf");

  return (
    <group ref={group} {...props}>
      <group scale={0.64} position={[0, 3.5, 0]}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

useGLTF.preload("./models/Ship_Large.gltf");

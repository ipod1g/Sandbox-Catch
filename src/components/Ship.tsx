import { useGLTF } from "@react-three/drei";
import { useRef } from "react";

// @ts-expect-error -- TODO: fix this
export default function Ship(props) {
  const group = useRef();
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

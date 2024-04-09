import { useTexture } from "@react-three/drei";

export default function BackgroundPanel({
  children,
}: {
  children?: React.ReactNode;
}) {
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

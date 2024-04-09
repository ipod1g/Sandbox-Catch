import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import { RepeatWrapping, PlaneGeometry, Vector3 } from "three";
import { Water } from "three-stdlib";

export default function Ocean() {
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

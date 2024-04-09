import { Canvas } from "@react-three/fiber";
import { Experience } from "@/components/three/Experience";
import { UIManager } from "@/components/ui";
import { KeyboardControls, Stats } from "@react-three/drei";
import { Suspense, useMemo } from "react";
import { Physics } from "@react-three/rapier";
import { Leva } from "leva";
import CameraPositionLogger from "@/helper/CameraPositionLogger";
import { Loading } from "@/components/three/Loading";
import { DEBUG } from "@/config/game";

// eslint-disable-next-line react-refresh/only-export-components
export const Controls = {
  left: "left",
  right: "right",
};

function App() {
  const keyMap = useMemo(
    () => [
      { name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
      { name: Controls.right, keys: ["ArrowRight", "KeyD"] },
    ],
    []
  );

  return (
    <>
      <Leva hidden={!DEBUG} collapsed />
      <KeyboardControls map={keyMap}>
        <Canvas
          shadows
          camera={{
            position: [0, 0, 20],
            fov: 40,
            near: 0.1,
            far: 1000,
          }}
        >
          {DEBUG ? (
            <>
              <CameraPositionLogger event="mousedown" />
              <Stats />
            </>
          ) : undefined}
          <color attach="background" args={["#ececec"]} />
          {/* <fog attach="fog" args={["#2fa7af", 10, 80]} /> */}
          <Suspense fallback={<Loading />}>
            <Physics debug={DEBUG}>
              <Experience />
            </Physics>
          </Suspense>
        </Canvas>
        <UIManager />
      </KeyboardControls>
    </>
  );
}

export default App;

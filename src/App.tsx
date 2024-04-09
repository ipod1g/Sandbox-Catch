import { KeyboardControls, Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Leva } from "leva";
import { Suspense, useMemo } from "react";

import { Experience } from "@/components/three/Experience";
import { Loading } from "@/components/three/Loading";
import { UIManager } from "@/components/ui";
import { DEBUG } from "@/config/game";
import CameraPositionLogger from "@/helper/CameraPositionLogger";

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
      <Leva collapsed hidden={!DEBUG} />
      <KeyboardControls map={keyMap}>
        <Canvas
          camera={{
            position: [0, 0, 20],
            fov: 40,
            near: 0.1,
            far: 1000,
          }}
          shadows
        >
          {DEBUG ? (
            <>
              <CameraPositionLogger event="mousedown" />
              <Stats />
            </>
          ) : undefined}
          <color args={["#ececec"]} attach="background" />
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

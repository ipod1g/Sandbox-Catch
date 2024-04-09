import { useRef, useEffect } from "react";
import { useThree } from "@react-three/fiber";

function CameraPositionLogger({ event }: { event: string }) {
  const { camera } = useThree();
  const cameraRef = useRef(camera);

  useEffect(() => {
    const logCameraPosition = () => {
      const { x, y, z } = cameraRef.current.position;
      const roundedX = Math.round(x * 100) / 100;
      const roundedY = Math.round(y * 100) / 100;
      const roundedZ = Math.round(z * 100) / 100;
      console.debug(
        `Camera position: x: ${roundedX}, y: ${roundedY}, z: ${roundedZ}`
      );
    };

    cameraRef.current = camera;
    window.addEventListener(event, logCameraPosition);
    return () => {
      window.removeEventListener(event, logCameraPosition);
    };
  }, [event, camera]);

  return null;
}

export default CameraPositionLogger;

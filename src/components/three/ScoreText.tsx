import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";

import useGameStore from "@/store/game";

const FADE_DURATION = 1; // Duration of the fade effect in seconds

const ScoreText = () => {
  const scoreMessage = useGameStore((state) => state.scoreMessage);
  const [opacity, setOpacity] = useState(0);
  const fadeStartTime = useRef(0);

  // Trigger the fade effect when scoreMessage updates
  useEffect(() => {
    fadeStartTime.current = performance.now();
    setOpacity(1);
  }, [scoreMessage]);

  // Handle the fade effect
  useFrame((state) => {
    const currentTime = state.clock.elapsedTime;
    const fadeElapsed =
      (currentTime - fadeStartTime.current / 1000) / FADE_DURATION;

    if (fadeElapsed < 1) {
      setOpacity(1 - fadeElapsed);
    } else if (opacity !== 0) {
      setOpacity(0);
    }
  });

  return (
    <Text
      anchorX="center"
      anchorY="middle"
      color={scoreMessage.includes("-") ? "red" : "yellow"}
      fillOpacity={opacity}
      font="/fonts/NEXTGAMES.ttf"
      fontSize={1.5}
      fontWeight="bold"
    >
      {scoreMessage}
    </Text>
  );
};

export default ScoreText;

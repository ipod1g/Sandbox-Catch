import { Leaderboard } from "./Leaderboard";
import { MainMenu } from "./MainMenu";
import { GameOverlay } from "./GameOverlay";
import { GameOver } from "./GameOver";
import { FinalLeaderboard } from "./FinalLeaderboard";

import { screen } from "@/config/game";
import useGameStore, { useGameActions } from "@/store/game";
import { usePageVisibility } from "@/hooks/usePageVisibility";
import { useEffect } from "react";

export const UIManager = () => {
  const screenState = useGameStore((state) => state.screenState);
  const isVisible = usePageVisibility();
  const { pauseGame, resumeGame } = useGameActions();

  useEffect(() => {
    if (isVisible) {
      resumeGame();
      console.log("Game resumed");
    } else {
      pauseGame();
      console.log("Game paused");
    }
  }, [isVisible, pauseGame, resumeGame]);

  switch (screenState) {
    case screen.MENU:
      return <MainMenu />;
    case screen.LEADERBOARD:
      return <Leaderboard />;
    case screen.GAME:
      return <GameOverlay />;
    case screen.GAMEOVER:
      return <GameOver />;
    case screen.FINAL_LEADERBOARD:
      return <FinalLeaderboard />;

    default:
      return <MainMenu />;
  }
};

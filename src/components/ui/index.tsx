import { useEffect } from "react";

import { screen } from "@/config/game";
import { usePageVisibility } from "@/hooks/usePageVisibility";
import useGameStore, { useGameActions } from "@/store/game";

import { GameOver } from "./GameOver";
import { GameOverlay } from "./GameOverlay";
import { GameOverLeaderboard } from "./GameOverLeaderboard";
import { MainMenu } from "./MainMenu";
import { RealtimeLeaderboard } from "./RealtimeLeaderboard";

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
      return <RealtimeLeaderboard />;
    case screen.GAME:
      return <GameOverlay />;
    case screen.GAMEOVER:
      return <GameOver />;
    case screen.FINAL_LEADERBOARD:
      return <GameOverLeaderboard />;
    // TODO: add one for the pause screen

    default:
      return <MainMenu />;
  }
};

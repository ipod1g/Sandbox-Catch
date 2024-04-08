import { Leaderboard } from "./Leaderboard";
import { MainMenu } from "./MainMenu";
import { GameOverlay } from "./GameOverlay";
import { GameOver } from "./GameOver";
import { FinalLeaderboard } from "./FinalLeaderboard";

import { screen } from "@/config/game";
import useGameStore from "@/store/game";

export const UI = () => {
  const screenState = useGameStore((state) => state.screenState);

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

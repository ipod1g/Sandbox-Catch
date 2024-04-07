import { useGameEngine, screen } from "@/hooks/useGameEngine";
import { Leaderboard } from "./Leaderboard";
import { MainMenu } from "./MainMenu";
import { GameOverlay } from "./GameOverlay";
import { GameOver } from "./GameOver";
import { FinalLeaderboard } from "./FinalLeaderboard";

export const UI = () => {
  const { screenState } = useGameEngine();

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

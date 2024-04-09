import { Button } from "@/components/common/Button";
import { screen } from "@/config/game";
import { useGameActions } from "@/store/game";

import IconGithub from "../common/IconGithub";

export const MainMenu = () => {
  const { startGame, setScreenState } = useGameActions();

  return (
    <div className="fixed inset-0 text-white text-xl font-bold font-nextgames flex flex-col justify-end items-start pb-24 px-[8vw] gap-16">
      <h1 className="text-yellow-300 text-clamp leading-clamp uppercase">
        Sandbox <br />
        Catch
      </h1>
      <ul className="flex flex-col gap-8">
        <li>
          <Button onClick={startGame} size="lg" variant="inverse">
            Start Game
          </Button>
        </li>
        <li>
          <Button
            onClick={() => setScreenState(screen.LEADERBOARD)}
            size="lg"
            variant="inverse"
          >
            LeaderBoard
          </Button>
        </li>
      </ul>
      <a
        className="text-sm text-gray-300 flex items-center gap-2 uppercase hover:text-yellow-300 transition-colors"
        href="https://github.com/ipod1g"
        rel="noreferrer noopener"
        target="_blank"
      >
        {" "}
        <IconGithub className="w-6 h-6" />
        {new Date().getFullYear()} Ku Bon Kwan (Bono){" "}
      </a>
      <div
        className="fixed inset-0 -z-10 pointer-events-none bg-gradient-to-tr from-black via-black/20 to-transparent"
        id="backdrop"
      />
    </div>
  );
};

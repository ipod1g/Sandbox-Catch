import { useGameActions } from "@/store/game";
import { Button } from "@/components/common/Button";
import { screen } from "@/config/game";
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
          <Button size="lg" variant="inverse" onClick={startGame}>
            Start Game
          </Button>
        </li>
        <li>
          <Button
            size="lg"
            variant="inverse"
            onClick={() => setScreenState(screen.LEADERBOARD)}
          >
            LeaderBoard
          </Button>
        </li>
      </ul>
      <a
        href="https://github.com/ipod1g"
        target="_blank"
        rel="noreferrer noopener"
        className="text-sm text-gray-300 flex items-center gap-2 uppercase hover:text-yellow-300 transition-colors"
      >
        {" "}
        <IconGithub className="w-6 h-6" />
        {new Date().getFullYear()} Ku Bon Kwan (Bono){" "}
      </a>
      <div
        id="backdrop"
        className="fixed inset-0 -z-10 pointer-events-none bg-gradient-to-tr from-black via-black/20 to-transparent"
      />
    </div>
  );
};

import { useGameEngine, screen } from "../../hooks/useGameEngine";

export const MainMenu = () => {
  const { startGame, setScreenState } = useGameEngine();

  return (
    <div className="fixed inset-0 text-white text-xl font-bold font-nextgames flex flex-col justify-end items-start pb-24 px-[8vw] gap-16">
      <h1 className="text-yellow-300 text-clamp leading-clamp uppercase">
        Sandbox <br />
        Catch
      </h1>
      <ul className="flex flex-col gap-8">
        <li>
          <button
            className="px-4 py-2 border-2 border-white text-white rounded-md shadow-md hover:border-yellow-300 hover:text-yellow-200 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50 uppercase"
            onClick={startGame}
          >
            Start Game
          </button>
        </li>
        <li>
          <button
            onClick={() => setScreenState(screen.LEADERBOARD)}
            className="px-4 py-2 border-2 border-white text-white rounded-md shadow-md hover:border-yellow-300 hover:text-yellow-200 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50 uppercase"
          >
            LeaderBoard
          </button>
        </li>
      </ul>
      <div
        id="backdrop"
        className="fixed inset-0 -z-10 pointer-events-none bg-gradient-to-tr from-black via-black/20 to-transparent"
      />
    </div>
  );
};

import { FormEvent, useRef } from "react";
import { useGameEngine, screen } from "@/hooks/useGameEngine";
import { usePost } from "@/lib/react-query";

export const GameOver = () => {
  const { score, setScreenState, setMyCtx } = useGameEngine();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const mutationPost = usePost(
    "/api/v1/leaderboard",
    undefined,
    (_, newData) => [newData]
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await mutationPost
        .mutateAsync({
          player: (e.target as HTMLFormElement)["playerName"].value,
          score: score,
        })
        .then((res: unknown) => {
          // @ts-expect-error -- unknown
          setMyCtx(res.data[0]);
          setScreenState(screen.FINAL_LEADERBOARD);
        });
    } catch (error) {
      alert(`Failed to send to backend: ${error}`);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center">
      <div className="w-3/4 relative">
        <div className="bg-gray-800 bg-clip-padding backdrop-blur-md bg-opacity-90 h-[90vh] w-full p-8 rounded-lg overflow-hidden">
          <div className="flex mb-4 justify-between items-center">
            <button
              onClick={() => setScreenState(screen.MENU)}
              className="bg-gray-800 px-4 py-2 rounded-lg border-2 border-gray-600 shadow-lg"
            >
              Go Back
            </button>
            <h2 className="font-medium text-lg md:text-2xl">
              All Time High Scores
            </h2>
          </div>
          <form
            onSubmit={handleSubmit}
            className="relative w-full h-full px-4 pb-20 flex flex-col items-center justify-center gap-12"
          >
            <h2 className="text-[56px] text-yellow-300 font-nextgames">
              {score}
            </h2>
            <label className="flex flex-col items-center gap-4 text-xl">
              Enter your name for this score
              <input
                name="playerName"
                ref={inputRef}
                type="text"
                placeholder="Player Name"
                className="bg-white/10 text-white rounded-md px-4 py-2"
              />
            </label>
          </form>
        </div>
      </div>
    </div>
  );
};

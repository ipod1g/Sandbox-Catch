import { useGameEngine } from "@/hooks/useGameEngine";

export const GameOverlay = () => {
  const { score, timer } = useGameEngine();

  return (
    <div className="fixed bottom-0 right-0 mr-10 mb-10 font-nextgames text-gray-400 uppercase text-xl">
      <div className="bg-gray-800 px-4 py-2 rounded-xl border-2 border-gray-600 shadow-lg">
        <div className="flex gap-8 items-end">
          <p>
            Score:{" "}
            <span className="tracking-wider text-yellow-300 text-[28px]">
              {score}
            </span>
          </p>
          <p>
            Time:{" "}
            <span className="tracking-wider text-yellow-300 text-[28px]">
              {timer}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

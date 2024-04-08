// import useDeviceDetection from "@/hooks/useDeviceDetection";
import { useGameEngine } from "@/hooks/useGameEngine";

export const GameOverlay = () => {
  const { score, timer } = useGameEngine();
  // const device = useDeviceDetection();

  return (
    <div className="fixed bottom-0 md:right-0 md:mr-10 mb-10 font-nextgames text-gray-400 uppercase md:text-xl">
      <div className="bg-gray-800 px-4 py-2 rounded-xl border-2 border-gray-600 shadow-lg">
        <div className="flex gap-8 items-end">
          <p>
            Score:{" "}
            <span className="tracking-wider text-yellow-300 text-base md:text-[28px]">
              {score}
            </span>
          </p>
          <p>
            Time:{" "}
            <span className="tracking-wider text-yellow-300 text-base md:text-[28px]">
              {timer}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

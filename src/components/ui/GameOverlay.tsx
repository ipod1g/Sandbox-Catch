import useDeviceDetection from "@/hooks/useDeviceDetection";
import useGameStore, { useGameActions } from "@/store/game";
import { TouchDirectionButton } from "@/components/common/TouchDirectionButton";

export const GameOverlay = () => {
  const score = useGameStore((state) => state.score);
  const timer = useGameStore((state) => state.timer);
  const device = useDeviceDetection();
  const { setMobileButton } = useGameActions();

  return (
    <>
      <div className="fixed bottom-0 ml-4 md:right-0 md:mr-10 mb-6 font-nextgames text-gray-400 uppercase md:text-xl">
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
      {device !== "Desktop" ? (
        <div className="fixed bottom-24 w-full flex justify-around">
          <TouchDirectionButton
            rotation="left"
            onTouchStart={() => setMobileButton("left", true)}
            onTouchEnd={() => setMobileButton("left", false)}
          >
            Left
          </TouchDirectionButton>
          <TouchDirectionButton
            rotation="right"
            onTouchStart={() => setMobileButton("right", true)}
            onTouchEnd={() => setMobileButton("right", false)}
          >
            Right
          </TouchDirectionButton>
        </div>
      ) : undefined}
    </>
  );
};

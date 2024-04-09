import { TouchDirectionButton } from "@/components/common/TouchDirectionButton";
import useDetectMobile from "@/hooks/useDetectMobile";
import useGameStore, { useGameActions } from "@/store/game";

import ScoreDisplay from "../overlay/ScoreDisplay";

export const GameOverlay = () => {
  const score = useGameStore((state) => state.score);
  const timer = useGameStore((state) => state.timer);
  const { isMobile } = useDetectMobile();
  const { setMobileButton } = useGameActions();

  return (
    <>
      <div className="fixed bottom-0 ml-4 md:right-0 md:mr-10 mb-4 font-nextgames text-gray-400 uppercase md:text-xl pointer-events-none">
        <ScoreDisplay score={score} timer={timer} />
      </div>
      {isMobile ? (
        <div className="fixed bottom-24 w-full flex justify-around">
          <TouchDirectionButton
            onTouchEnd={() => setMobileButton("left", false)}
            onTouchStart={() => setMobileButton("left", true)}
            rotation="left"
          >
            Left
          </TouchDirectionButton>
          <TouchDirectionButton
            onTouchEnd={() => setMobileButton("right", false)}
            onTouchStart={() => setMobileButton("right", true)}
            rotation="right"
          >
            Right
          </TouchDirectionButton>
        </div>
      ) : null}
    </>
  );
};

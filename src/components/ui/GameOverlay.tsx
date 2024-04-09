import useDetectMobile from "@/hooks/useDetectMobile";
import useGameStore, { useGameActions } from "@/store/game";
import { TouchDirectionButton } from "@/components/common/TouchDirectionButton";
import ScoreDisplay from "../overlay/ScoreDisplay";

export const GameOverlay = () => {
  const score = useGameStore((state) => state.score);
  const timer = useGameStore((state) => state.timer);
  const { isMobile } = useDetectMobile();
  const { setMobileButton } = useGameActions();

  return (
    <>
      <div className="fixed bottom-0 ml-4 md:right-0 md:mr-10 mb-4 font-nextgames text-gray-400 uppercase md:text-xl pointer-events-none">
        <ScoreDisplay timer={timer} score={score} />
      </div>
      {isMobile ? (
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
      ) : null}
    </>
  );
};

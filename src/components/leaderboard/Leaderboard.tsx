import { ReactNode } from "react";
import IconTopRanks from "@/components/leaderboard/IconTopRanks";
import { Button } from "@/components/common/Button";
import { Container } from "@/components/common/Container";
import useGameStore, { useGameActions } from "@/store/game";
import { screen } from "@/config/game";
import { cn } from "@/utils";
import { LeaderboardData } from "@/types";

const LeaderboardContainer = ({
  children,
  cover,
}: {
  children: ReactNode;
  cover?: boolean;
}) => {
  const { setScreenState } = useGameActions();

  return (
    <div
      className={`flex justify-center items-center ${cover ? "h-full" : null}`}
    >
      <Container>
        <div className="flex mb-4 gap-3 md:gap-6 items-center">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setScreenState(screen.MENU)}
          >
            Back
          </Button>
          <h2 className="font-medium text-lg md:text-2xl font-nextgames uppercase text-balance text-white">
            Top 100 High Scores
          </h2>
        </div>
        <div className="relative">
          <div className="ml-4">
            <div className="relative w-full h-16 flex mb-2 items-center justify-between text-md md:text-lg font-nextgames uppercase">
              <div className="relative z-10 flex-1">
                <p className="text-gray-300 uppercase md:pr-10">Rank</p>
              </div>
              <div className="relative z-10 flex-1">
                <p className="text-gray-300 uppercase md:pr-10 pl-2">Player</p>
              </div>
              <div className="relative z-10 flex-1 flex justify-end mr-2">
                <p className="text-gray-300 uppercase md:pr-10">Score</p>
              </div>
            </div>
          </div>
          <div className="relative h-[55vh] overflow-y-scroll pb-12">
            {children}
          </div>
        </div>
      </Container>
    </div>
  );
};
LeaderboardContainer.displayName = "LeaderboardContainer";

const LeaderboardRow = ({ data }: { data: LeaderboardData }) => {
  const newTop100 = useGameStore((state) => state.newTop100);

  return (
    <div
      className={cn(
        "font-medium overflow-hidden rounded-md mb-2 flex items-center justify-between w-full hover:opacity-70 text-md md:text-lg transition-all duration-300",
        data.rank > 3
          ? " h-16"
          : "h-20 bg-[#21213d] border border-gray-700 shadow-md",
        newTop100?.id === data.id
          ? "bg-blue-950 border-gray-700 shadow-md"
          : null
      )}
    >
      <div className="relative flex-1">
        {data.rank > 3 ? (
          <p className="pr-1 md:pr-10 ml-6">#{data.rank}</p>
        ) : (
          <>
            <IconTopRanks rank={data.rank}>
              <p className="pr-1 md:pr-10 ml-6">#{data.rank}</p>
            </IconTopRanks>
          </>
        )}
      </div>
      <div className="relative flex-1">
        <p className="pr-1 md:pr-10 ml-6 text-white">{data.player}</p>
      </div>
      <div className="relative flex-1 flex justify-end">
        <p className="pr-3 md:pr-10 ml-6 text-right">{data.score}</p>
      </div>
    </div>
  );
};
LeaderboardRow.displayName = "LeaderboardRow";

export { LeaderboardContainer, LeaderboardRow };

import { ReactNode, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useFetch } from "@/lib/react-query";
import TopRankIcon from "@/components/leaderboard/TopRankIcon";
import Spinner from "@/components/common/Spinner";
import { Button } from "@/components/common/Button";
import { Container } from "@/components/common/Container";
import useGameStore, { useGameActions } from "@/store/game";
import { screen } from "@/config/game";
import { cn } from "@/utils";
import { LeaderboardData } from "@/types";
import { useQueryClient } from "react-query";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export const Leaderboard = () => {
  return (
    <div className="fixed inset-0">
      <LeaderboardContainer cover>
        <LeaderBoardTable />
      </LeaderboardContainer>
    </div>
  );
};

export const LeaderboardContainer = ({
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

const LeaderboardContent = ({
  leaderboardData,
}: {
  leaderboardData: LeaderboardData[];
}) => {
  const newTop100 = useGameStore((state) => state.newTop100);
  const { setNewTop100 } = useGameActions();
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("leaderboard")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "leaderboard" },
        (payload) => {
          const { updatedLeaderboard, newTop100 } = updateRealtimeLeaderboard(
            leaderboardData,
            payload.new as Omit<LeaderboardData, "rank">
          );
          queryClient.setQueryData(
            ["/api/v1/leaderboard", null],
            updatedLeaderboard
          );
          setNewTop100(newTop100);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [leaderboardData, queryClient, setNewTop100]);

  useEffect(() => {
    if (newTop100) {
      const timeout = setTimeout(() => {
        setNewTop100(null);
      }, 8000);

      return () => clearTimeout(timeout);
    }
  }, [newTop100, setNewTop100]);

  return (
    <>
      <div
        className={cn(
          "fixed top-2 right-2 z-10 bg-orange-200 rounded-md px-2 border-2 border-red-400 transition-opacity duration-300",
          newTop100 ? "opacity-100" : "opacity-0"
        )}
      >
        <span className="font-nextgames uppercase text-red-400">
          ! New Top 100 !
        </span>
        <div className="h-[28px]">
          {newTop100 && (
            <p className="text-red-600 font-medium mb-1 text-lg">
              #{newTop100?.rank} {newTop100?.player}
            </p>
          )}
        </div>
      </div>
      {leaderboardData.map((data) => (
        <LeaderboardRow key={data.id} data={data} />
      ))}
    </>
  );
};

const LeaderBoardTable = () => {
  const leaderboardQuery = useFetch<LeaderboardData[]>("/api/v1/leaderboard");

  if (leaderboardQuery.isLoading || !leaderboardQuery.data) {
    return <Spinner />;
  }

  if (leaderboardQuery.isError) {
    return <div>Error connecting to backend</div>;
  }

  return (
    <LeaderboardContent
      key={JSON.stringify(leaderboardQuery.data)}
      leaderboardData={leaderboardQuery.data}
    />
  );
};

export const LeaderboardRow = ({ data }: { data: LeaderboardData }) => {
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
            <TopRankIcon rank={data.rank}>
              <p className="pr-1 md:pr-10 ml-6">#{data.rank}</p>
            </TopRankIcon>
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

function updateRealtimeLeaderboard(
  currentLeaderboard: LeaderboardData[],
  newPayload: Omit<LeaderboardData, "rank">
) {
  const updatedLeaderboard = [...currentLeaderboard];
  let insertIndex = -1;

  for (let i = 0; i < updatedLeaderboard.length; i++) {
    const currentData = updatedLeaderboard[i];
    const currentScore = currentData.score;

    if (newPayload.score >= currentScore) {
      insertIndex = i;
      break;
    }
  }

  if (insertIndex === -1) {
    return {
      updatedLeaderboard,
      newTop100: null,
    };
  }

  updatedLeaderboard.splice(insertIndex, 0, {
    rank: insertIndex + 1,
    ...newPayload,
  });

  for (let i = insertIndex + 1; i < updatedLeaderboard.length; i++) {
    updatedLeaderboard[i].rank += 1;
  }

  if (updatedLeaderboard.length > 100) {
    updatedLeaderboard.pop();
  }

  return {
    updatedLeaderboard,
    newTop100:
      insertIndex < 100
        ? {
            id: newPayload.id,
            rank: insertIndex + 1, // Adjust rank to be 1-based for display.
            player: newPayload.player,
            score: newPayload.score,
            createdTime: newPayload.createdTime,
          }
        : null,
  };
}

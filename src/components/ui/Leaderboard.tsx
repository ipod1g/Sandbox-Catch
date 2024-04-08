import { ReactNode, useEffect, useState } from "react";
import { useGameEngine, screen } from "../../hooks/useGameEngine";
import { createClient } from "@supabase/supabase-js";
import { useFetch } from "@/lib/react-query";
import TopRankIcon from "../leaderboard/TopRankIcon";
import Spinner from "../common/Spinner";

type LeaderboardData = {
  id: number;
  player: string;
  score: number;
  createdTime: Date;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export const LeaderboardContainer = ({ children }: { children: ReactNode }) => {
  const { setScreenState } = useGameEngine();

  return (
    <div className="flex justify-center items-center h-full">
      <div className="w-3/4 relative">
        <div className="bg-gray-800 bg-clip-padding backdrop-blur-md bg-opacity-90 h-[90vh] w-full py-8 pl-8 pr-6 rounded-lg overflow-hidden">
          <div className="flex mb-4 gap-12 items-center">
            <button
              onClick={() => setScreenState(screen.MENU)}
              className="bg-gray-800 px-4 py-2 border-2 border-gray-600 font-nextgames text-white rounded-md shadow-md hover:border-yellow-300 hover:text-yellow-200 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50 uppercase"
            >
              Go Back
            </button>
            <h2 className="font-medium text-lg md:text-2xl font-nextgames uppercase">
              All Time High Scores
            </h2>
          </div>
          <div className="relative">
            <div className="ml-4">
              <div className="relative w-full h-16 flex mb-2 items-center justify-between text-md md:text-lg font-nextgames uppercase">
                <div className="relative z-10 flex-1">
                  <p className="text-gray-300 uppercase pr-10">Rank</p>
                </div>
                <div className="relative z-10 flex-1">
                  <p className="text-gray-300 uppercase pr-10 pl-2">Player</p>
                </div>
                <div className="relative z-10 flex-1 flex justify-end mr-2">
                  <p className="text-gray-300 uppercase pr-10">Score</p>
                </div>
              </div>
            </div>
            <div className="relative h-[70vh] overflow-y-scroll pb-10">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LeaderBoardTable = () => {
  // TODO: control re-render
  const [leaderboard, setLeaderboard] = useState<LeaderboardData[]>([]);

  const leaderboardQuery = useFetch<LeaderboardData[]>(
    "/api/v1/leaderboard",
    undefined,
    {
      onSuccess: (data) => {
        setLeaderboard(data);
      },
    }
  );

  useEffect(() => {
    const channel = supabase
      .channel("leaderboard")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "leaderboard" },
        (payload) => {
          // update only this 1 new record
          setLeaderboard((prev) => {
            const updatedLeaderboard = compareLeaderboard(
              prev,
              payload.new as LeaderboardData
            );
            console.log("Leaderboard updated with", payload.new);
            return updatedLeaderboard;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (!leaderboard || leaderboardQuery.isLoading || !leaderboardQuery.data) {
    return <Spinner />;
  }

  if (leaderboardQuery.isError) {
    return <div>Error connecting to backend</div>;
  }

  return (
    <>
      {leaderboard.map((data, idx) => (
        <LeaderboardRow key={JSON.stringify(data)} data={data} rank={idx + 1} />
      ))}
    </>
  );
};

export const LeaderboardRow = ({
  data,
  rank,
}: {
  data: LeaderboardData;
  rank: number;
}) => {
  return (
    <div
      className={`${
        rank > 3 ? "h-16" : "h-20 bg-[#21213d] border border-gray-700 shadow-md"
      } font-medium overflow-hidden rounded-md mb-2 flex items-center justify-between w-full hover:opacity-70 transition-opacity text-md md:text-lg`}
    >
      <div className="relative flex-1">
        {rank > 3 ? (
          <p className="pr-1 md:pr-10 text-gray-300 ml-6">#{rank}</p>
        ) : (
          <>
            <TopRankIcon rank={rank}>
              <p className="pr-1 md:pr-10 text-white ml-6">#{rank}</p>
            </TopRankIcon>
          </>
        )}
      </div>
      <div className="relative flex-1">
        <p className="pr-1 md:pr-10 text-white ml-6">{data.player}</p>
      </div>
      <div className="relative flex-1 flex justify-end">
        <p className="pr-3 md:pr-10 text-white ml-6 text-right">{data.score}</p>
      </div>
    </div>
  );
};

function compareLeaderboard(
  currentLeaderboard: LeaderboardData[],
  newPayload: LeaderboardData
) {
  const updatedLeaderboard = [...currentLeaderboard];

  for (let i = 0; i < updatedLeaderboard.length; i++) {
    const currentScore = updatedLeaderboard[i].score;
    if (newPayload.score > currentScore) {
      updatedLeaderboard.splice(i, 0, newPayload);
      if (updatedLeaderboard.length > 100) updatedLeaderboard.pop();
      break;
    }
  }

  return updatedLeaderboard;
}

export const Leaderboard = () => {
  return (
    <div className="fixed inset-0">
      <LeaderboardContainer>
        <LeaderBoardTable />
      </LeaderboardContainer>
    </div>
  );
};

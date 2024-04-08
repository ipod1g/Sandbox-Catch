import { useGameEngine } from "../../hooks/useGameEngine";
import { useFetch } from "@/lib/react-query";
import Spinner from "../common/Spinner";
import TopRankIcon from "../leaderboard/TopRankIcon";
import { LeaderboardContainer, LeaderboardRow } from "./Leaderboard";

type LeaderboardData = {
  id: number;
  player: string;
  score: number;
  createdTime: Date;
  rank: number;
};

// TODO: componentize
export const FinalLeaderboard = () => {
  return (
    <div className="fixed inset-0 flex flex-col">
      <LeaderboardContainer>
        <FinalLeaderboardTable />
      </LeaderboardContainer>
      <FinalLeaderboardUserRank />
    </div>
  );
};

const FinalLeaderboardTable = () => {
  const { myCtx } = useGameEngine();
  const rankQuery = useFetch<LeaderboardData>("/api/v1/leaderboard/rank", {
    player: myCtx.player,
    score: myCtx.score,
  });
  const leaderboardQuery = useFetch<LeaderboardData[]>(
    "/api/v1/leaderboard",
    {
      range: 100,
    },
    {
      enabled: rankQuery.isSuccess,
    }
  );

  if (leaderboardQuery.isLoading) {
    return <Spinner />;
  }

  if (leaderboardQuery.isError) {
    return <div>Error connecting to backend</div>;
  }

  if (!leaderboardQuery.data || leaderboardQuery.data.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <>
      {leaderboardQuery.data.map((data, idx) => (
        <LeaderboardRow
          key={data.player + data.score}
          data={data}
          rank={idx + 1}
        />
      ))}
    </>
  );
};

const FinalLeaderboardUserRank = () => {
  const { myCtx } = useGameEngine();
  const rankQuery = useFetch<LeaderboardData>("/api/v1/leaderboard/rank", {
    player: myCtx.player,
    score: myCtx.score,
  });

  if (rankQuery.isLoading) {
    return <Spinner />;
  }
  if (rankQuery.isError) {
    return <div>Error connecting to backend</div>;
  }
  if (!rankQuery.data) {
    return <div>No data available</div>;
  }

  return (
    <div className="w-3/4 px-2 flex-shrink-0 mx-auto -mt-4 z-20 shadow-lg">
      <div className="h-20 bg-blue-950 border border-gray-700 shadow-md font-medium overflow-hidden rounded-md mb-2 flex items-center justify-between w-full text-white hover:text-yellow-500 transition-colors text-md md:text-lg">
        <div className="relative flex-1">
          {rankQuery.data.rank > 3 ? (
            <p className="pr-1 md:pr-10 text-gray-300 ml-6">
              #{rankQuery.data.rank + 1}
            </p>
          ) : (
            <>
              <TopRankIcon rank={rankQuery.data.rank}>
                <p className="pr-1 md:pr-10 text-gray-300 ml-6">
                  #{rankQuery.data.rank + 1}
                </p>
              </TopRankIcon>
            </>
          )}
        </div>
        <div className="relative flex-1">
          <p className="pr-1 md:pr-10 ml-6">
            {rankQuery.data.player}{" "}
            <span className="text-yellow-300">(YOU)</span>
          </p>
        </div>
        <div className="relative flex-1 flex justify-end">
          <p className="pr-3 md:pr-10 text-white ml-6 text-right">
            {rankQuery.data.score}
          </p>
        </div>
      </div>
    </div>
  );
};

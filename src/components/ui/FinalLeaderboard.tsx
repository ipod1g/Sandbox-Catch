import { useFetch } from "@/lib/react-query";
import Spinner from "../common/Spinner";
import TopRankIcon from "../leaderboard/TopRankIcon";
import { LeaderboardContainer, LeaderboardRow } from "./Leaderboard";
import useGameStore from "@/store/game";

type LeaderboardData = {
  id: number;
  player: string;
  score: number;
  createdTime: Date;
  rank: number;
};

export const FinalLeaderboard = () => {
  return (
    <div className="fixed inset-0 flex flex-col">
      <LeaderboardContainer>
        <FinalLeaderboardTable />
      </LeaderboardContainer>
      <div className="-mt-8 px-8 md:px-2 md:mx-auto w-full md:w-3/4 max-w-screen-lg z-20">
        <div className="px-4 h-20 bg-blue-950 border border-gray-700 shadow-md font-medium overflow-hidden rounded-md flex items-center justify-between w-full text-white hover:text-yellow-500 transition-colors text-md md:text-lg">
          <FinalLeaderboardUserRank />
        </div>
      </div>
    </div>
  );
};

const FinalLeaderboardTable = () => {
  const myCtx = useGameStore((state) => state.myCtx);

  const rankQuery = useFetch<LeaderboardData>("/api/v1/leaderboard/rank", {
    id: myCtx.id,
  });

  const leaderboardQuery = useFetch<LeaderboardData[]>(
    "/api/v1/leaderboard",
    {
      range: 100,
    },
    {
      enabled: !!rankQuery.data,
    }
  );

  if (leaderboardQuery.isLoading) {
    return <Spinner />;
  }
  if (leaderboardQuery.isError) {
    return <div>Error connecting to backend</div>;
  }
  if (!leaderboardQuery.data || leaderboardQuery.data.length === 0) {
    return <Spinner />;
  }

  return (
    <>
      {leaderboardQuery.data.map((data) => (
        <LeaderboardRow key={data.id} data={data} />
      ))}
    </>
  );
};

const FinalLeaderboardUserRank = () => {
  const myCtx = useGameStore((state) => state.myCtx);

  const rankQuery = useFetch<LeaderboardData>("/api/v1/leaderboard/rank", {
    id: myCtx.id,
  });

  if (rankQuery.isLoading) {
    return <Spinner />;
  }
  if (rankQuery.isError) {
    return <div>Error connecting to backend</div>;
  }
  if (!rankQuery.data) {
    return <Spinner />;
  }

  return (
    <>
      <div className="relative flex-1">
        {rankQuery.data.rank > 3 ? (
          <p className="pr-1 md:pr-10 text-gray-300 ml-6">
            #{rankQuery.data.rank}
          </p>
        ) : (
          <>
            <TopRankIcon rank={rankQuery.data.rank}>
              <p className="pr-1 md:pr-10 text-gray-300 ml-6">
                #{rankQuery.data.rank}
              </p>
            </TopRankIcon>
          </>
        )}
      </div>
      <div className="relative flex-1">
        <p className="pr-1 md:pr-10 ml-6">
          {myCtx.player} <span className="text-yellow-300">(YOU)</span>
        </p>
      </div>
      <div className="relative flex-1 flex justify-end">
        <p className="pr-3 md:pr-10 text-white ml-6 text-right">
          {myCtx.score}
        </p>
      </div>
    </>
  );
};

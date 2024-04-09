import IconTopRanks from "@/components/leaderboard/IconTopRanks";

const PlayerRankDisplay = ({
  rank,
  player,
  score,
}: {
  rank: number;
  player: string;
  score: number;
}) => {
  return (
    <>
      <div className="relative flex-1">
        {rank > 3 ? (
          <p className="pr-1 md:pr-10 text-gray-300 ml-6">#{rank}</p>
        ) : (
          <>
            <IconTopRanks rank={rank}>
              <p className="pr-1 md:pr-10 text-gray-300 ml-6">#{rank}</p>
            </IconTopRanks>
          </>
        )}
      </div>
      <div className="relative flex-1">
        <p className="pr-1 md:pr-10 ml-6">
          {player} <span className="text-yellow-300">(YOU)</span>
        </p>
      </div>
      <div className="relative flex-1 flex justify-end">
        <p className="pr-3 md:pr-10 text-white ml-6 text-right">{score}</p>
      </div>
    </>
  );
};

export default PlayerRankDisplay;

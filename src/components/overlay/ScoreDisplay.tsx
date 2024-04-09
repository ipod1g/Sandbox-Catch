const ScoreDisplay = ({ timer, score }: { timer: number; score: number }) => {
  return (
    <div className="bg-gray-800 px-4 py-2 rounded-xl border-2 border-gray-600 shadow-lg">
      <div className="flex gap-8 items-end">
        <p className="select-none">
          Score:{" "}
          <span className="tracking-wider text-yellow-300 text-base md:text-[28px]">
            {score}
          </span>
        </p>
        <p className="select-none">
          Time:{" "}
          <span className="tracking-wider text-yellow-300 text-base md:text-[28px]">
            {timer}
          </span>
        </p>
      </div>
    </div>
  );
};

export default ScoreDisplay;

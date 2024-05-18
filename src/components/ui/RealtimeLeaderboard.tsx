import { createClient } from "@supabase/supabase-js";
import { useEffect } from "react";
import { useQueryClient } from "react-query";

import Spinner from "@/components/common/Spinner";
import { updateRealtimeLeaderboard } from "@/components/leaderboard/functions";
import {
  LeaderboardContainer,
  LeaderboardRow,
} from "@/components/leaderboard/Leaderboard";
import { useFetch } from "@/lib/react-query";
import useGameStore, { useGameActions } from "@/store/game";
import { cn } from "@/utils";

import type { LeaderboardData } from "@/types";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export const RealtimeLeaderboard = () => {
  return (
    <div className="fixed inset-0">
      <LeaderboardContainer cover>
        <LeaderboardTable />
      </LeaderboardContainer>
    </div>
  );
};

const LeaderboardTable = () => {
  const leaderboardQuery = useFetch<LeaderboardData[]>("/api/v1/leaderboard");

  if (leaderboardQuery.isLoading || !leaderboardQuery.data) {
    return <Spinner />;
  }

  if (leaderboardQuery.isError) {
    return <div>Error connecting to backend</div>;
  }

  return <LeaderboardContent leaderboardData={leaderboardQuery.data} />;
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
        <LeaderboardRow data={data} key={data.id} />
      ))}
    </>
  );
};

import type { LeaderboardData } from "@/types";

export function updateRealtimeLeaderboard(
  currentLeaderboard: LeaderboardData[],
  newPayload: Omit<LeaderboardData, "rank">
) {
  const updatedLeaderboard = [...currentLeaderboard];
  let insertIndex = -1;

  for (let i = 0; i < updatedLeaderboard.length; i++) {
    const currentData = updatedLeaderboard[i];
    const currentScore = currentData.score;

    // // NOTE: this puts at the top of identical scores
    if (newPayload.score > currentScore) {
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

  const newEntry = {
    rank: insertIndex + 1,
    ...newPayload,
  };

  updatedLeaderboard.splice(insertIndex, 0, newEntry);

  // update leaderboard with new rank
  for (let i = insertIndex + 1; i < updatedLeaderboard.length; i++) {
    updatedLeaderboard[i].rank += 1;
  }
  // remove any exceeding leaderboard rank row
  if (updatedLeaderboard.length > 100) {
    updatedLeaderboard.pop();
  }

  return {
    updatedLeaderboard,
    newTop100: insertIndex < 100 ? newEntry : null,
  };
}

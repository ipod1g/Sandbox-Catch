import { LeaderboardData } from "@/types";

export function updateRealtimeLeaderboard(
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

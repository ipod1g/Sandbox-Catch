import type { Vector3 } from "three";
import type { screen } from "@/config/game";

export type Pirate = {
  name: string;
  img: string;
  point: number;
  position: Vector3;
  drowned: boolean;
};
export interface Ctx {
  id?: number;
  player?: string;
  score?: number;
  createdTime?: Date;
}

export type GameContext = {
  timer: number;
  score: number;
  screenState: screen;
  pirates: Pirate[];
  myCtx: Ctx;
};

export type LeaderboardData = {
  id: number;
  rank: number;
  player: string;
  score: number;
  createdTime: Date;
};

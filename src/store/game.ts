import { create } from "zustand";
import { Vector3 } from "three";

import {
  GAME_ROUND_TIME,
  PIRATE_SPAWN_TIME,
  initialGameState,
  piratesList,
  screen,
} from "@/config/game";
import { Ctx, LeaderboardData, Pirate } from "@/types";

interface StoreModel {
  timer: number;
  score: number;
  scoreMessage: string;
  scoreUpdateCounter: number;
  screenState: screen;
  pirates: Pirate[];
  mobileButton: {
    leftPressed: boolean;
    rightPressed: boolean;
  };
  myCtx: Ctx;
  newTop100: LeaderboardData | null;
  actions: {
    startGame: () => void;
    addScore: (point: number) => void;
    removePirate: (idx: number) => void;
    drownedPirate: (idx: number) => void;
    setScreenState: (state: screen) => void;
    setMyCtx: (ctx: Ctx) => void;
    setMobileButton: (button: "left" | "right", pressed: boolean) => void;
    setNewTop100: (data: LeaderboardData | null) => void;
    resumeGame: () => void;
    pauseGame: () => void;
  };
}

let gameInterval: ReturnType<typeof setInterval> | null = null;

const useGameStore = create<StoreModel>()((set, get) => ({
  ...initialGameState,
  actions: {
    startGame: () => {
      set({
        timer: GAME_ROUND_TIME,
        score: 0,
        screenState: screen.GAME,
        pirates: [],
      });
      manageGameInterval(set, get);
    },
    pauseGame: () => {
      if (gameInterval !== null) {
        clearInterval(gameInterval);
        gameInterval = null;
      }
      set({ screenState: screen.PAUSE });
    },
    resumeGame: () => {
      const { screenState, timer } = get();
      // Ensure we don't resume a finished or non-paused game
      if (screenState !== screen.PAUSE || timer === 0) return;

      set({ screenState: screen.GAME });
      manageGameInterval(set, get);
    },
    addScore: (points) =>
      set((state) => ({
        score: state.score + points,
        scoreMessage: points > 0 ? `✨${points}` : `💀${points}`,
        scoreUpdateCounter: state.scoreUpdateCounter + 1,
      })),
    removePirate: (idx) => {
      set((state) => {
        const pirates = [...state.pirates];
        pirates.splice(idx, 1);
        return { pirates };
      });
    },
    drownedPirate: (idx) => {
      set((state) => {
        const pirates = [...state.pirates];
        pirates[idx].drowned = true;
        return { pirates };
      });
    },
    setScreenState: (state) => {
      set({ screenState: state });
    },
    setMyCtx: (ctx) => {
      set({ myCtx: ctx });
    },
    setMobileButton(button, pressed) {
      set((state) => {
        const mobileButton = {
          ...state.mobileButton,
          [`${button}Pressed`]: pressed,
        };
        return { mobileButton };
      });
    },
    setNewTop100: (data) => {
      set({ newTop100: data });
    },
  },
}));

export default useGameStore;

export const useGameActions = () => useGameStore((state) => state.actions);

function getRandomPirate() {
  return {
    ...piratesList[Math.floor(Math.random() * piratesList.length)],
    // NOTE: the x is from spawn zone value aligned with camera fit
    // TODO: extract to be from single source
    position: new Vector3(Math.random() * 16 - 8, 21, 0),
    drowned: false,
  };
}

type SetStateFunction = (
  partial: Partial<StoreModel> | ((state: StoreModel) => Partial<StoreModel>),
  replace?: boolean
) => void;

type GetStateFunction = () => StoreModel;

function manageGameInterval(set: SetStateFunction, get: GetStateFunction) {
  if (gameInterval) clearInterval(gameInterval); // Ensure no duplicate intervals

  gameInterval = setInterval(() => {
    const { timer, pirates } = get();
    if (timer <= 0) {
      clearInterval(gameInterval as NodeJS.Timeout);
      gameInterval = null;
      set({ screenState: screen.GAMEOVER });
      return;
    }

    const updatedPirates =
      timer % PIRATE_SPAWN_TIME === 0
        ? [...pirates, getRandomPirate()]
        : pirates;
    set({ timer: timer - 1, pirates: updatedPirates });
  }, 1000);
}

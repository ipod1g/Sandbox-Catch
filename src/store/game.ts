import { create } from "zustand";
import { Vector3 } from "three";

import {
  GAME_ROUND_TIME,
  PIRATE_SPAWN_TIME,
  initialGameState,
  piratesList,
  screen,
} from "@/config/game";
import { Ctx, Pirate } from "@/types";

interface StoreModel {
  timer: number;
  score: number;
  screenState: screen;
  pirates: Pirate[];
  mobileButton: {
    leftPressed: boolean;
    rightPressed: boolean;
  };
  myCtx: Ctx;
  actions: {
    startGame: () => void;
    addScore: (point: number) => void;
    removePirate: (idx: number) => void;
    drownedPirate: (idx: number) => void;
    setScreenState: (state: screen) => void;
    setMyCtx: (ctx: Ctx) => void;
    setMobileButton: (button: "left" | "right", pressed: boolean) => void;
  };
}

function getRandomPirate() {
  return {
    ...piratesList[Math.floor(Math.random() * piratesList.length)],
    // NOTE: the x is from spawn zone value aligned with camera fit
    // TODO: extract to be from single source
    position: new Vector3(Math.random() * 16 - 8, 21, 0),
    drowned: false,
  };
}

const useGameStore = create<StoreModel>()((set) => ({
  ...initialGameState,
  actions: {
    startGame: () => {
      set({
        timer: GAME_ROUND_TIME,
        score: 0,
        screenState: screen.GAME,
      });
      const timerInterval = setInterval(() => {
        set((state) => {
          if (state.timer === 0) {
            clearInterval(timerInterval);
            return { screenState: screen.GAMEOVER };
          }
          const pirates = [...state.pirates];
          if (state.timer % PIRATE_SPAWN_TIME === 0) {
            pirates.push(getRandomPirate());
          }
          return { timer: state.timer - 1, pirates };
        });
      }, 1000);
    },
    addScore: (point) => {
      set((state) => ({ score: state.score + point }));
    },
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
  },
}));

export default useGameStore;

export const useGameActions = () => useGameStore((state) => state.actions);

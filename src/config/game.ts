export const DEBUG = import.meta.env.PROD ? false : true;
export const GAME_ROUND_TIME = 60; // in seconds
export const PIRATE_SPAWN_TIME = 2; // every n seconds

// Ship variables
export const SHIP_MOVEMENT_SPEED = 0.8;
export const SHIP_MAX_VEL = 15;

export enum screen {
  MENU = "MENU",
  LEADERBOARD = "LEADERBOARD",
  GAME = "GAME",
  GAMEOVER = "GAMEOVER",
  PAUSE = "PAUSE",
  FINAL_LEADERBOARD = "FINAL_LEADERBOARD",
}

export const initialGameState = {
  timer: 0,
  score: 0,
  scoreMessage: "",
  scoreUpdateCounter: 0,
  screenState: screen.MENU,
  pirates: [],
  mobileButton: {
    leftPressed: false,
    rightPressed: false,
  },
  myCtx: {},
  newTop100: null,
};

export const piratesList = [
  { name: "p1", img: "/images/p1.png", point: 50 },
  { name: "p2", img: "/images/p2.png", point: 50 },
  { name: "p3", img: "/images/p3.png", point: 50 },
  { name: "p4", img: "/images/p4.png", point: 50 },
  { name: "e1", img: "/images/e1.png", point: -100 },
  { name: "e2", img: "/images/e2.png", point: -100 },
];

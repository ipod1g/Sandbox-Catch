export const DEBUG = true;
export const GAME_TIME_ROUND = 4000;

export enum screen {
  MENU = "MENU",
  LEADERBOARD = "LEADERBOARD",
  GAME = "GAME",
  GAMEOVER = "GAMEOVER",
  FINAL_LEADERBOARD = "FINAL_LEADERBOARD",
}

export const initialGameState = {
  timer: 0,
  score: 0,
  screenState: screen.MENU,
  pirates: [],
  mobileButton: {
    leftPressed: false,
    rightPressed: false,
  },
  myCtx: {},
};

export const piratesList = [
  { name: "p1", img: "/images/p1.png", point: 50 },
  { name: "p2", img: "/images/p2.png", point: 50 },
  { name: "p3", img: "/images/p3.png", point: 50 },
  { name: "p4", img: "/images/p4.png", point: 50 },
  { name: "e1", img: "/images/e1.png", point: -100 },
  { name: "e2", img: "/images/e2.png", point: -100 },
];

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import * as THREE from "three";

const TIME_GAME_ROUND = 60;

type GameContext = {
  timer: number;
  score: number;
  screenState: screen;
  pirates: Pirate[];
  myCtx: Ctx;
  startGame: () => void;
  addScore: (point: number) => void;
  removePirate: (idx: number) => void;
  drownedPirate: (idx: number) => void;
  setScreenState: (state: screen) => void;
  setMyCtx: (ctx: Ctx) => void;
};

// eslint-disable-next-line react-refresh/only-export-components
export enum screen {
  MENU = "MENU",
  LEADERBOARD = "LEADERBOARD",
  GAME = "GAME",
  GAMEOVER = "GAMEOVER",
  FINAL_LEADERBOARD = "FINAL_LEADERBOARD",
}

export interface Pirate {
  name: string;
  img: string;
  point: number;
  position: THREE.Vector3;
  drowned: boolean;
}

interface Ctx {
  id?: number;
  player?: string;
  score?: number;
  createdTime?: Date;
}

const piratesList = [
  { name: "p1", img: "/images/p1.png", point: 50 },
  { name: "p2", img: "/images/p2.png", point: 50 },
  { name: "p3", img: "/images/p3.png", point: 50 },
  { name: "p4", img: "/images/p4.png", point: 50 },
  { name: "e1", img: "/images/e1.png", point: -100 },
  { name: "e2", img: "/images/e2.png", point: -100 },
];

const GameEngineContext = createContext<GameContext | null>(null);

export const GameEngineProvider = ({ children }: { children: ReactNode }) => {
  const [timer, setTimer] = useState(0);
  const [score, setScore] = useState(0);
  const [screenState, setScreenState] = useState(screen.MENU);
  const [pirates, setPirates] = useState<Pirate[]>([]);
  const [myCtx, setMyCtx] = useState({});
  const timerInterval = useRef<NodeJS.Timeout | undefined>(undefined);

  const gameState = {
    timer,
    score,
    screenState,
    pirates,
    myCtx,
  };

  useEffect(() => {
    const generatePirate = () => {
      // Makes sure it is not generating equally
      const randomPirate = {
        ...piratesList[Math.floor(Math.random() * 10)],
        // NOTE: the x is from spawn zone value aligned with camera fit
        // TODO: extract to be from single source
        // position: new THREE.Vector3(Math.random() * 20 - 10, 21, 0),
        position: new THREE.Vector3(Math.random() * 16 - 8, 21, 0),
        drowned: false,
      };
      if (randomPirate.name === undefined) return;
      setPirates((prevPirates) => [...prevPirates, randomPirate]);
    };

    const runTimer = () => {
      timerInterval.current = setInterval(() => {
        setTimer((prev) => {
          return prev - 1;
        });
        generatePirate();
      }, 1000);
    };
    const clearTimer = () => {
      clearInterval(timerInterval.current);
    };

    if (screenState === screen.GAME) {
      runTimer();
    }
    if (timer === 0 && screenState === screen.GAME) {
      clearTimer();
      setScreenState(screen.GAMEOVER);
    }

    return clearTimer;
  }, [timer, screenState, pirates]);

  const startGame = () => {
    setScreenState(screen.GAME);
    setScore(0);
    setTimer(TIME_GAME_ROUND);
  };

  const drownedPirate = (idx: number) => {
    setPirates((prevPirates) => {
      const newPirates = [...prevPirates];
      newPirates[idx].drowned = true;
      return newPirates;
    });
  };

  const removePirate = (idx: number) => {
    setPirates((prevPirates) => {
      const newPirates = [...prevPirates];
      newPirates.splice(idx, 1);
      return newPirates;
    });
  };

  const addScore = (point: number) => {
    setScore((prev) => prev + point);
  };

  return (
    <GameEngineContext.Provider
      value={{
        ...gameState,
        addScore,
        startGame,
        drownedPirate,
        removePirate,
        setScreenState,
        setMyCtx,
      }}
    >
      {children}
    </GameEngineContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useGameEngine = () => {
  const context = useContext(GameEngineContext);
  if (context === undefined || context === null) {
    throw new Error("useGameEngine must be used within a GameEngineProvider");
  }
  return context;
};

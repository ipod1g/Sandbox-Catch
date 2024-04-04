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
  startGame: () => void;
  addScore: (point: number) => void;
  removePirates: () => void;
};

export enum screen {
  MENU = "MENU",
  GAME = "GAME",
  GAME_OVER = "GAME_OVER",
  LEADER_BOARD = "LEADER_BOARD",
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
  const [pirates, setPirates] = useState([]);
  const [screenState, setScreenState] = useState(screen.GAME);

  const gameState = {
    timer,
    score,
    screenState,
    pirates,
  };

  const timerInterval = useRef<number | undefined>(undefined);

  useEffect(() => {
    const generatePirate = () => {
      // Makes sure it is not generating equally
      const randomPirate = {
        ...piratesList[Math.floor(Math.random() * 10)],
        // TODO; need to use viewport position for x
        position: new THREE.Vector3(
          Math.random() * 10,
          Math.random() * 5 + 20,
          0
        ),
      };
      if (randomPirate.name === undefined) return;
      setPirates((prevPirates) => [...prevPirates, randomPirate]);
      Math.random() * 10;
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
    return clearTimer;
  }, [timer, screenState, pirates]);

  const startGame = () => {
    setScreenState(screen.GAME);
    setScore(0);
    setTimer(TIME_GAME_ROUND);
  };

  const removePirates = () => {
    setPirates((prevPirates) => {
      const newPirates = [...prevPirates];
      newPirates.splice(0, 1);
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
        removePirates,
      }}
    >
      {children}
    </GameEngineContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useGameEngine = () => {
  const context = useContext(GameEngineContext);
  if (context === undefined) {
    throw new Error("useGameEngine must be used within a GameEngineProvider");
  }
  return context;
};

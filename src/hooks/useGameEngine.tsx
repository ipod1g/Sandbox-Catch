import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const TIME_GAME_ROUND = 60;

type GameContext = {
  timer: number;
  score: number;
  startGame: () => void;
};

export const gameStates = {
  MENU: "MENU",
  GAME: "GAME",
  GAME_OVER: "GAME_OVER",
  LEADER_BOARD: "LEADER_BOARD",
};

const GameEngineContext = createContext<GameContext | null>(null);

export const GameEngineProvider = ({ children }: { children: ReactNode }) => {
  const [timer, setTimer] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const gameState = {
    timer,
    score,
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setTimer(TIME_GAME_ROUND);
  };

  const timerInterval = useRef<number | undefined>(undefined);

  useEffect(() => {
    const runTimer = () => {
      timerInterval.current = setInterval(() => {
        setTimer((prev) => {
          return prev - 1;
        });
      }, 1000);
      console.log(timer);
    };
    const clearTimer = () => {
      clearInterval(timerInterval.current);
    };

    if (gameStarted) {
      runTimer();
    }
    return clearTimer;
  }, [timer, gameStarted]);

  return (
    <GameEngineContext.Provider
      value={{
        ...gameState,
        startGame,
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

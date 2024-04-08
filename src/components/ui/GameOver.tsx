import { FormEvent, useRef } from "react";
import { usePost } from "@/lib/react-query";
import { Button } from "../common/Button";
import { Container } from "../common/Container";
import useGameStore, { useGameActions } from "@/store/game";
import { screen } from "@/config/game";

export const GameOver = () => {
  const score = useGameStore((state) => state.score);
  const { setScreenState, setMyCtx } = useGameActions();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const mutationPost = usePost(
    "/api/v1/leaderboard",
    undefined,
    (_, newData) => [newData]
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await mutationPost
        .mutateAsync({
          player: (e.target as HTMLFormElement)["playerName"].value,
          score: score,
        })
        .then((res: unknown) => {
          // @ts-expect-error -- unknown
          setMyCtx(res.data[0]);
          setScreenState(screen.FINAL_LEADERBOARD);
        });
    } catch (error) {
      alert(`Failed to send to backend: ${error}`);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center">
      <Container>
        <form
          onSubmit={handleSubmit}
          className="relative w-full h-full px-4 flex flex-col items-center justify-between"
        >
          <div className="flex flex-col items-center justify-center md:my-auto">
            <h2 className="font-medium text-lg md:text-2xl font-nextgames uppercase text-balance text-white mx-auto w-fit mt-6">
              Your Score
            </h2>
            <h2 className="text-[56px] text-yellow-300 font-nextgames">
              {score}
            </h2>
            <label className="flex flex-col items-center gap-4 text-xl">
              Enter name for this score
              <input
                name="playerName"
                ref={inputRef}
                type="text"
                placeholder="Player Name"
                className="bg-white/10 text-white rounded-md px-4 py-2"
              />
            </label>
            <p className="font-light mx-2 my-6">
              You can make new names for your new attempts
            </p>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </div>
          <p className="text-yellow-300 font-nextgames uppercase">
            Sandbox Catch
          </p>
        </form>
      </Container>
    </div>
  );
};

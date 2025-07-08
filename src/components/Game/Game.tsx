import { useEffect, useState } from "react";
import clsx from "clsx";
import { gestures, Gesture } from "@/constants/gestures";
import GameStatus from "@/constants/gameStatus";
import Hand from "@/components/Hand";
import pickRandomElement from "@/utils/pickRandomElement";
import "./Game.scss";

interface Results {
  player: number;
  bot: number;
}

export default function Game() {
  const [opponentChoice, setOpponentChoice] = useState<null | Gesture>(null);
  const [playerChoice, setPlayerChoice] = useState<null | Gesture>(null);
  const [gameStatus, setGameStatus] = useState<null | GameStatus>(null);
  const [results, setResults] = useState<Results>({ player: 0, bot: 0 });

  useEffect(() => {
    const savedResults = localStorage.getItem("results");
    if (savedResults) {
      const parsedSavedResults = JSON.parse(savedResults);
      setResults(parsedSavedResults);
    }
  }, []);

  const isGameFinished = !!gameStatus;

  const handleSelectGesture = (gesture: Gesture) => {
    const { id } = pickRandomElement(gestures);

    setPlayerChoice(gesture);
    setOpponentChoice(id);

    if (gesture === id) {
      setGameStatus(GameStatus.DRAW);
    } else if (
      (gesture === Gesture.ROCK && id === Gesture.SCISSORS) ||
      (gesture === Gesture.PAPER && id === Gesture.ROCK) ||
      (gesture === Gesture.SCISSORS && id === Gesture.PAPER)
    ) {
      setGameStatus(GameStatus.WIN);
      setResults((prev) => {
        const updated = { ...prev, player: (prev.player ?? 0) + 1 };
        localStorage.setItem("results", JSON.stringify(updated));
        return updated;
      });
    } else {
      setGameStatus(GameStatus.LOSE);
      setResults((prev) => {
        const updated = { ...prev, bot: (prev.bot ?? 0) + 1 };
        localStorage.setItem("results", JSON.stringify(updated));
        return updated;
      });
    }
  };

  const handleResetChoice = () => {
    setOpponentChoice(null);
    setPlayerChoice(null);
    setGameStatus(null);
  };

  return (
    <div className="container">
      <h2 className="title-text">Good Luck!</h2>
      <h1 className="title">ROCK PAPER SCISSORS</h1>
      <div className="hands">
        <div>
          <p className="results">Bot</p>
          <p className="results">{results.bot}</p>
          <div className="opponent-hand-wrap">
            <Hand
              className={clsx(
                "opponent-hand",
                isGameFinished && "no-animation",
                opponentChoice
              )}
            />
          </div>
        </div>
        <div>
          <p className="results">You</p>
          <p className="results">{results.player}</p>
          <div className="player-hand-wrap">
            <Hand
              className={clsx(
                "player-hand",
                isGameFinished && "no-animation",
                playerChoice
              )}
            />
          </div>
        </div>
      </div>
      {!!gameStatus && (
        <div className="game-status">
          {gameStatus === GameStatus.WIN && (
            <span className="win-status">You Win!</span>
          )}
          {gameStatus === GameStatus.LOSE && (
            <span className="lose-status">You Lose!</span>
          )}
          {gameStatus === GameStatus.DRAW && (
            <span className="draw-status">It's a Draw!</span>
          )}
        </div>
      )}
      <div className="gestures">
        {gestures.map(({ id, icon }) => (
          <button
            className="select-gesture"
            disabled={isGameFinished}
            key={id}
            onClick={() => handleSelectGesture(id)}
            type="button"
          >
            {icon}
          </button>
        ))}
      </div>
      <button
        className="reset-button"
        type="button"
        onClick={handleResetChoice}
        disabled={!isGameFinished}
      >
        Restart Game
      </button>
    </div>
  );
}

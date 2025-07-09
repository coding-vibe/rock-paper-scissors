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
const INITIAL_RESULTS = { player: 0, bot: 0 };

const LOCAL_STORAGE_KEY = "results";

const DELAY = 500;

export default function Game() {
  const [opponentChoice, setOpponentChoice] = useState<null | Gesture>(null);
  const [playerChoice, setPlayerChoice] = useState<null | Gesture>(null);
  const [gameStatus, setGameStatus] = useState<null | GameStatus>(null);
  const [results, setResults] = useState<Results>(INITIAL_RESULTS);

  useEffect(() => {
    const savedResults = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedResults) {
      const parsedSavedResults = JSON.parse(savedResults);
      setResults(parsedSavedResults);
    }
  }, []);

  const isGameFinished = !!gameStatus;

  const handleSelectGesture = (gesture: Gesture) => {
    const { id: opponent } = pickRandomElement(gestures);

    setPlayerChoice(gesture);
    setOpponentChoice(opponent);
    setGameStatus(null);

    setTimeout(() => {
      if (gesture === opponent) {
        setGameStatus(GameStatus.DRAW);
      } else if (
        (gesture === Gesture.ROCK && opponent === Gesture.SCISSORS) ||
        (gesture === Gesture.PAPER && opponent === Gesture.ROCK) ||
        (gesture === Gesture.SCISSORS && opponent === Gesture.PAPER)
      ) {
        setGameStatus(GameStatus.WIN);
        setResults((prev) => {
          const updated = { ...prev, player: (prev.player ?? 0) + 1 };
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
          return updated;
        });
      } else {
        setGameStatus(GameStatus.LOSE);
        setResults((prev) => {
          const updated = { ...prev, bot: (prev.bot ?? 0) + 1 };
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
          return updated;
        });
      }
    }, DELAY);
  };

  const handleNextRound = () => {
    setOpponentChoice(null);
    setPlayerChoice(null);
    setGameStatus(null);
  };

  const handleRestartGame = () => {
    setOpponentChoice(null);
    setPlayerChoice(null);
    setGameStatus(null);
    setResults(INITIAL_RESULTS);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  return (
    <div className="container">
      <h2 className="title-text">Good Luck!</h2>
      <h1 className="title">ROCK PAPER SCISSORS</h1>
      <div className="hands">
        <div>
          <div className="results">
            <p>Bot</p>
            <p>{results.bot}</p>
          </div>
          <div className="opponent-hand-wrap">
            <Hand
              className={clsx(
                "hand",
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
                "hand",
                isGameFinished && "no-animation",
                playerChoice
              )}
            />
          </div>
        </div>
      </div>
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
      <div className="buttons-wrap">
        <button
          className="next-round-button game-button"
          type="button"
          onClick={handleNextRound}
          disabled={!isGameFinished}
        >
          Next Round
        </button>
        <button
          className="game-button"
          type="button"
          onClick={handleRestartGame}
        >
          Restart Game
        </button>
      </div>
    </div>
  );
}

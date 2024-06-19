import { useState } from "react";

import Cell from "../Cell/Cell";
import Player from "../Player/Player";

export default function Board() {
  const cells = [];
  for (let row = 9; row >= 0; row--) {
    for (let col = 0; col < 10; col++) {
      const index = row % 2 === 0 ? row * 10 + col + 1 : (row + 1) * 10 - col;
      cells.push(index);
    }
  }
  const [position, setPosition] = useState(0);

  const rollDice = () => {
    const diceRoll = Math.floor(Math.random() * 6) + 1;
    movePlayer(diceRoll);
  };

  const movePlayer = (steps) => {
    const newPosition = position + steps;
    if (newPosition < 100) {
      setPosition(newPosition);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center">
        <div className="grid grid-cols-10 gap-2">
          {cells.map((cellNumber, index) => (
            <Cell key={index} number={cellNumber}>
              {position === index && <Player />}
            </Cell>
          ))}
        </div>
        <button
          onClick={rollDice}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Roll Dice
        </button>
      </div>
    </>
  );
}

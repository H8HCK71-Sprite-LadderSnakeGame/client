import { useState, useEffect } from "react";
import { useSocket } from "./utils/socket";

function App() {
  const [board, setBoard] = useState([]);
  const [players, setPlayers] = useState([]);
  const [dadu, setDadu] = useState(0);
  const [turn, setTurn] = useState(0);
  const [error, setError] = useState("");
  const [player, setPlayer] = useState(null);

  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;
    console.log(socket);

    socket.on("generated-board", (board) => setBoard(board));
    socket.on("players-position", setPlayers);
    socket.on("dice/number", (dice) => {
      setDadu(dice);
      setTimeout(() => {
        socket.emit("maen", dice);
      }, 3000);
    });
    socket.on("resetGame/position", setPlayers);
    socket.on("current-turn", setTurn);
    socket.on("error", (errorMessage) => setError(errorMessage));
    socket.on("player-info", (playerInfo) => setPlayer(playerInfo));
  }, [socket]);

  const maen = () => {
    setError("");
    socket.emit("dice");
  };

  const generateBoard = () => {
    setError("");
    socket.emit("generateBoard");
  };

  const resetGame = () => {
    setError("");
    socket.emit("resetGame");
  };

  const disconnectAll = () => {
    socket.emit("disconnect-all");
  };

  const currentPlayer = players[turn]?.name;
  const isCurrentPlayerTurn = player && players[turn] && player.id === players[turn].id;

  return (
    <>
      <button onClick={generateBoard}>Generate Board</button>
      <button onClick={maen} disabled={!isCurrentPlayerTurn}>
        Maen
      </button>
      <button onClick={resetGame}>Reset Game</button>
      <button onClick={disconnectAll}>Disconnect All Users</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {board.length > 0 &&
        board.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: "flex" }}>
            {row.map((col) => (
              <div key={col} style={{ backgroundColor: "green", border: "1px solid black", width: 50, height: 50, padding: 5 }}>
                <span>{col}</span>
                {players
                  .filter((p) => p.position === col)
                  .map((p) => (
                    <span key={p.id} style={{ color: p.color }}>
                      O
                    </span>
                  ))}
              </div>
            ))}
          </div>
        ))}
      <p>Current Player: {currentPlayer}</p>
      {player && (
        <p>
          Your Info: Name - {player.name}, Position - {player.position}
        </p>
      )}
    </>
  );
}

export default App;

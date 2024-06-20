import { useState, useEffect, useContext } from "react";
import Chat from "../Chat";
import { useSocket } from "../utils/socket";
import "../App.css";
import ThemeContext from "../contexts/ThemeContext";

const socket = io("http://localhost:3000", {
  auth: {
    token: localStorage.getItem("token"),
  },
});

function App() {
  const [board, setBoard] = useState([]);
  const [players, setPlayers] = useState([]);
  const [dadu, setDadu] = useState(0);
  const [turn, setTurn] = useState(0);
  const [error, setError] = useState("");
  const [player, setPlayer] = useState(null);
  const [winner, setWinner] = useState(false);
  const { theme, setTheme, themes } = useContext(ThemeContext);
  const activeTheme = themes[theme];

  //Ka lili
  const [username, setUsername] = useState("x");
  const [room, setRoom] = useState("1");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  // const socket = useSocket();

  useEffect(() => {
    if (!socket) return;
    console.log(socket, "---");

    socket.emit("game:join");

    socket.on("generated-board", (board) => setBoard(board));
    socket.on("players-position", setPlayers);
    // socket.on("dice/number", (dice) => {
    //   setDadu(dice);
    //   setTimeout(() => {
    //     socket.emit("maen", dice);
    //   }, 3000);
    // });
    socket.on("resetGame/position", setPlayers);
    socket.on("current-turn", setTurn);
    socket.on("error", (errorMessage) => setError(errorMessage));
    socket.on("player-info", (playerInfo) => setPlayer(playerInfo));
  }, []);

  const maen = () => {
    socket.emit("dice", (dadu) => {
      setDadu(dadu);
      setTimeout(() => {
        socket.emit("maen", dadu);
      }, 3000);
    });
    const winner = socket.on("winner", (winner) => setWinner(winner));
  };

  const generateBoard = () => {
    socket.emit("generateBoard");
  };

  const resetGame = () => {
    socket.emit("resetGame");
  };

  const disconnectAll = () => {
    socket.emit("disconnect-all");
  };

  const currentPlayer = players[turn]?.name;
  const isCurrentPlayerTurn =
    player && players[turn] && player.id === players[turn].id;

  return (
    <>
      <div>
        <div>
          {console.log(winner)}
          <button onClick={generateBoard}>Generate Board</button>
          <button onClick={maen} disabled={!isCurrentPlayerTurn}>
            Maen
          </button>
          <button onClick={resetGame}>Reset Game</button>
          <button onClick={disconnectAll}>Disconnect All Users</button>
          <button
            onClick={() => {
              setTheme(theme === "green" ? "black" : "green");
            }}
          >
            Ganti Warna
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {board.length > 0 &&
            board.map((row, rowIndex) => (
              <div key={rowIndex} style={{ display: "flex" }}>
                {row.map((col) => (
                  <div
                    key={col}
                    style={{
                      backgroundColor: `${activeTheme.bg}`,
                      border: `1px solid ${activeTheme.text}`,
                      width: 50,
                      height: 50,
                      padding: 5,
                    }}
                  >
                    <span style={{color: `${activeTheme.text}`}}>{col}</span>
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
        </div>
        <div>
          <div className="App">
            {!showChat ? (
              <div className="joinChatContainer">
                <h3>Join A Chat</h3>
                <input
                  type="text"
                  placeholder="John..."
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                />
                <input
                  type="text"
                  placeholder="Room ID..."
                  value={room}
                  onChange={(event) => setRoom(event.target.value)}
                />
                <button onClick={joinRoom}>Join A Room</button>
              </div>
            ) : (
              <Chat socket={socket} username={username} room={room} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;

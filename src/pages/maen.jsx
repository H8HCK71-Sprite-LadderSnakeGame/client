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
  const [username, setUsername] = useState("player1");
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
  const isCurrentPlayerTurn = player && players[turn] && player.id === players[turn].id;
  console.log(player);

  return (
    <>
      <div>
        <div className="App bg-blue-900 h-screen flex justify-center items-center vh-100">
          {/* <div
            style={{
              backgroundColor: "#E1EFFE",
              height: "100vh",
              width: "30vw",
              marginRight: "100px",
              color: "black",
            }}
          >
            section kiri, di section ini atau section kanan bakal di taro chat,
            atau hiasan lain
          </div> */}
          {console.log(winner)}
          {error && <p style={{ color: "red" }}>{error}</p>}
          <div className="flex flex-col items-center">
            {board.length > 0 &&
              board.map((row, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-10">
                  {row.map((col) => (
                    // <div
                    //   key={col}
                    //   style={{
                    //     backgroundColor: `${activeTheme.bg}`,
                    //     border: `1px solid ${activeTheme.text}`,
                    //     width: 50,
                    //     height: 50,
                    //     padding: 5,
                    //   }}
                    // >
                    <div className="cell bg-blue-700 border flex items-center justify-center h-12 w-12 relative">
                      <span style={{ color: `${activeTheme.text}` }}>{col}</span>
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
            <div className="flex w-full">
              <ul className="w-full">
                <li>
                  <button
                    onClick={generateBoard}
                    className="mt-4 w-full text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Generate Board
                  </button>
                </li>
                <li>
                  {!isCurrentPlayerTurn ? (
                    <button
                      onClick={maen}
                      style={{ cursor: "not-allowed" }}
                      disabled
                      className="mt-4 w-full text-white bg-red-500 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:focus:ring-blue-800"
                    >
                      STOP
                    </button>
                  ) : (
                    <button
                      onClick={maen}
                      // className="w-full"
                      className="mt-4 w-full text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      MAEN
                    </button>
                  )}
                </li>
                <li>
                  <button
                    onClick={resetGame}
                    className="mt-4 w-full text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Reset Game
                  </button>
                </li>
                <li>
                  <button
                    onClick={disconnectAll}
                    className="mt-4 w-full text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Leave Game
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setTheme(theme === "green" ? "black" : "green");
                    }}
                    className="mt-4 w-full text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Ganti Warna
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div>
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
                  <input type="text" placeholder="John..." value={player && player.name} onChange={(event) => setUsername(event.target.value)} />
                  <input type="text" placeholder="Room ID..." value={room} onChange={(event) => setRoom(event.target.value)} />
                  <button onClick={joinRoom}>Join A Room</button>
                </div>
              ) : (
                <Chat socket={socket} username={username} room={room} />
              )}
            </div>
          </div>

          {/* <div
            style={{
              backgroundColor: "#E1EFFE",
              height: "100vh",
              width: "30vw",
              marginLeft: "100px",
              color: "black",
            }}
          >
            section kanan
          </div> */}
        </div>
      </div>
    </>
  );
}

export default App;

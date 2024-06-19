// import './App.css'
import { useState, useEffect } from "react";
import { useSocket } from "./utils/socket";

function App() {
  const [board, setBoard] = useState([]);
  const [players, setPlayers] = useState([]);
  const [dadu, setDadu] = useState(0);

  const socket = useSocket();
  useEffect(() => {
    console.log({ socket });
    // 4. message nya di terima di kedua client
    // optional chaining
    socket?.on("messages", (data) => {
      setMessages(data);
    });
    socket?.on("generated-board", (board) => setBoard(board));
    socket?.on("playes-position", setPlayers);
    socket?.on("dice/number", (dice) => {
      console.log({ dice });
      setDadu(dice);

      setTimeout(() => {
        socket.emit("maen", dice);
      }, 3000);
    });
  }, [socket]);

  const maen = () => {
    socket.emit("dice");
    // console.log(dadu);
  };

  const tes = () => {
    console.log(socket);
    socket?.emit("generateBoard");
  };
  console.log(board);

  return (
    <>
      <div>
        {/* <p>{board}</p> */}
        <div className="App bg-blue-900 h-screen flex justify-center items-center vh-100">
          <div
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
          </div>
          <div className="flex flex-col items-center">
            {board.length &&
              board.map((row) => {
                return (
                  // <div style={{ display: "flex" }}>
                  <div className="grid grid-cols-10">
                    {row.map((col) => (
                      // <div
                      //   style={{
                      //     backgroundColor: "green",
                      //     border: "1px solid black",
                      //     width: 50,
                      //     height: 50,
                      //     padding: 5,
                      //   }}
                      // >
                      <div className="cell bg-blue-700 border flex items-center justify-center h-12 w-12 relative">
                        <span>{col}</span>
                        {players
                          .filter((p) => p.position == col)
                          .map((p) => (
                            <span style={{ color: p.color }}>0</span>
                          ))}
                      </div>
                    ))}
                  </div>
                );
              })}
            <div className="flex w-full">
              <ul className="w-full">
                <li>
                  <button
                    onClick={tes}
                    className="mt-4 w-full text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Board
                  </button>
                </li>
                <li>
                  <button
                    onClick={maen}
                    className="mt-4 w-full text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Roll Dice
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div
            style={{
              backgroundColor: "#E1EFFE",
              height: "100vh",
              width: "30vw",
              marginLeft: "100px",
              color: "black",
            }}
          >
            section kanan
          </div>
        </div>
      </div>
    </>
  );
}

export default App;

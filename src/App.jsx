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
      <p>{board}</p>
      <button onClick={tes}>P firu</button>
      <button onClick={maen}>Maen</button>
      {board.length &&
        board.map((row) => {
          return (
            <div style={{ display: "flex" }}>
              {row.map((col) => (
                <div style={{ backgroundColor: "green", border: "1px solid black", width: 50, height: 50, padding: 5 }}>
                  <span>{col}</span>
                  {players
                    .filter((p) => p.position == col)
                    .map((p) => (
                      <span style={{ color: p.color }}>O</span>
                    ))}
                </div>
              ))}
            </div>
          );
        })}
    </>
  );
}

export default App;

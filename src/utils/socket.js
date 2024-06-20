import { useEffect, useState } from "react";
import { io } from "socket.io-client";

// create useSocket to create and remove socket connection
export const useSocket = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    console.log("000");
    const newSocket = io("http://localhost:3000", {
      auth: {
        token: localStorage.getItem("token"),
      },
    });
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  return socket;
};

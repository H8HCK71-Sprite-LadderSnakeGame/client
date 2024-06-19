import { createBrowserRouter } from "react-router-dom";
import Homepage from "../pages/Homepage/Homepage";
import GamePage from "../pages/GamePage/GamePage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Homepage />
    },
    {
        path: "/game",
        element: <GamePage />
    },
])

export default router;  
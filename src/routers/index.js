import { createBrowserRouter, redirect } from "react-router-dom";
import Homepage from "../pages/Homepage/Homepage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Homepage />
    },
])

export default router;  
import { createRoot } from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import RootLayout from "@/layouts/RootLayout";
import Home from "@/pages/Home";
import SuggestionLayout from "./layouts/SuggestionLayout";

const router = createHashRouter([
  {
    path: "",
    element: <RootLayout />,
    children: [
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "suggestion",
        element: <SuggestionLayout />,
      },
    ],
  },
]);

const root = createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);

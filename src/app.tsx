import { createRoot } from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import RootLayout from "@/layouts/RootLayout";
import Home from "@/pages/Home";
import SuggestionsLayout from "./layouts/SuggestionsLayout";
import Get from "./pages/suggestions/Get";

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
        path: "suggestions",
        element: <SuggestionsLayout />,
        children: [
          {
            path: "get",
            element: <Get />,
          },
        ],
      },
    ],
  },
]);

const root = createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);

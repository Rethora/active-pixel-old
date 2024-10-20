import { createRoot } from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import RootLayout from "@/layouts/RootLayout";
import Home from "@/pages/Home";
import SuggestionsLayout from "./layouts/SuggestionsLayout";
import Get from "@/pages/suggestions/Get";
import Settings from "@/pages/Settings";

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
        path: "settings",
        element: <Settings />,
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

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<RouterProvider router={router} />);
} else {
  console.error("Root container not found");
}

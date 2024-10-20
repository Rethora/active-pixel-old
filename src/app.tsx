import { createRoot } from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import RootLayout, { rootLoader } from "@/layouts/RootLayout";
import Home from "@/pages/Home";
import SuggestionsLayout from "./layouts/SuggestionsLayout";
import Get from "@/pages/suggestions/Get";
import SettingsPage from "@/pages/Settings";
import { Settings } from "@/utils/store";

const router = createHashRouter([
  {
    id: "root",
    path: "",
    loader: rootLoader,
    element: <RootLayout />,
    children: [
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
        action: async ({ request }) => {
          if (request.method === "PUT") {
            const formData = await request.formData();
            const formDataEntries = Object.fromEntries(formData.entries());
            const settings: Settings = {
              displayUnproductiveNotifications:
                formDataEntries["displayUnproductiveNotifications"] === "on",
              productivityThresholdPercentage: Number(
                formDataEntries["productivityThresholdPercentage"]
              ),
              productivityCheckInterval:
                Number(formDataEntries["productivityCheckInterval"]) * 60000,
            };
            await window.electronAPI.setStoreValue("settings", settings);
          }
          return null;
        },
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

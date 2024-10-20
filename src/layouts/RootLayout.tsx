import { useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { makeLoader } from "react-router-typesafe";

export const rootLoader = makeLoader(() => ({
  settingsPromise: window.electronAPI.getStoreValue("settings"),
}));

const RootLayout = () => {
  useEffect(() => {
    window.electronAPI.onUnproductivePeriod((activePercentage) => {
      console.log("Active Percentage this period:", activePercentage);
      // TODO: check user settings to see what kind of notification to show
      // TODO: route to the appropriate page
    });
  }, []);

  return (
    <div>
      <div>
        <ul>
          <li>
            <Link to="home">Home</Link>
            <Link to="suggestions/get">Get a Suggestion</Link>
            <Link to="settings">Settings</Link>
          </li>
        </ul>
      </div>
      <Outlet />
    </div>
  );
};

export default RootLayout;

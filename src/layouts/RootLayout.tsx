import { useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { makeLoader } from "react-router-typesafe";

export const rootLoader = makeLoader(() => ({
  settingsPromise: window.electronAPI.getStoreValue("settings"),
}));

const RootLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.electronAPI.onUnproductivePeriod((activePercentage) => {
      console.log("Unproductive period! Active Percentage:", activePercentage);
      navigate("suggestions/random/stretch");
    });
  }, []);

  return (
    <div>
      <div>
        <ul>
          <li>
            <Link to="home">Home</Link>
          </li>
          <li>
            <Link to="notfound">Not Found</Link>
          </li>
          <li>
            <Link to="settings">Settings</Link>
          </li>
        </ul>
      </div>
      <Outlet />
    </div>
  );
};

export default RootLayout;

import RootContext from "@/contexts/RootContext";
import useRoot from "@/hooks/useRoot";
import { useEffect } from "react";
import { Link, Outlet } from "react-router-dom";

const RootLayout = () => {
  const root = useRoot();

  // useEffect(() => {
  //   setTimeout(() => {
  //     window.electronAPI.displayNotification();
  //   }, 1000);
  // }, []);

  return (
    <RootContext.Provider value={root}>
      <div>
        <div>
          <ul>
            <li>
              <Link to="home">Home</Link>
              <Link to="suggestions/get">Get a Suggestion</Link>
            </li>
          </ul>
        </div>
        <Outlet />
      </div>
    </RootContext.Provider>
  );
};

export default RootLayout;

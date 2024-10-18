import { Link, Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div>
      <div>
        <ul>
          <li>
            <Link to="home">Home</Link>
          </li>
        </ul>
      </div>
      <Outlet />
    </div>
  );
};

export default RootLayout;

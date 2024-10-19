import { useRootContext } from "@/hooks/useRoot";

const Home = () => {
  const { test } = useRootContext();

  return (
    <div>
      <h1>Home</h1>
    </div>
  );
};

export default Home;

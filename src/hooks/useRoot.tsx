import RootContext from "@/contexts/RootContext";
import { useContext } from "react";

const useRoot = () => {
  return {
    test: "test",
  };
};

export default useRoot;

export type RootHook = ReturnType<typeof useRoot>;

export const useRootContext = () => useContext(RootContext);

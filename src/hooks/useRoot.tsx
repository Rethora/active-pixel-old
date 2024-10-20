import RootContext from "@/contexts/RootContext";
import { useContext, useEffect } from "react";

const useRoot = () => {
  useEffect(() => {
    window.electronAPI.onUnproductivePeriod((activePercentage) => {
      console.log("Unproductive Period:", activePercentage);
      // TODO: check user settings to see what kind of notification to show
      // TODO: route to the appropriate page
    });
  }, []);

  return {
    test: "test",
  };
};

export default useRoot;

export type RootHook = ReturnType<typeof useRoot>;

export const useRootContext = () => useContext(RootContext);

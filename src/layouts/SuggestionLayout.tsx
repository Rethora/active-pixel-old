import SuggestionContext from "@/contexts/SuggestionContext";
import useSuggestion from "@/hooks/useSuggestion";
import { Outlet } from "react-router-dom";

const SuggestionLayout = () => {
  const suggestion = useSuggestion();

  return (
    <SuggestionContext.Provider value={suggestion}>
      <Outlet />
    </SuggestionContext.Provider>
  );
};

export default SuggestionLayout;

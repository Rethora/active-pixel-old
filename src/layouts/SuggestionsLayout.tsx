import SuggestionsContext from "@/contexts/SuggestionsContext";
import useSuggestions from "@/hooks/useSuggestions";
import { Outlet } from "react-router-dom";

const SuggestionLayout = () => {
  const suggestion = useSuggestions();

  return (
    <SuggestionsContext.Provider value={suggestion}>
      <Outlet />
    </SuggestionsContext.Provider>
  );
};

export default SuggestionLayout;

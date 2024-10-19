import SuggestionsContext from "@/contexts/SuggestionsContext";
import { useContext } from "react";

const useSuggestions = () => {
  return {};
};

export default useSuggestions;

export type SuggestionsHook = ReturnType<typeof useSuggestions>;

export const useSuggestionsContext = () => useContext(SuggestionsContext);

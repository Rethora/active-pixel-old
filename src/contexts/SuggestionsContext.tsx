import { SuggestionsHook } from "@/hooks/useSuggestions";
import { createContext } from "react";

const SuggestionsContext = createContext<SuggestionsHook>(
  {} as SuggestionsHook
);

export default SuggestionsContext;

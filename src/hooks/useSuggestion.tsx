import SuggestionContext from "@/contexts/SuggestionContext";
import { useContext } from "react";

const useSuggestion = () => {
  return {};
};

export default useSuggestion;

export type SuggestionHook = ReturnType<typeof useSuggestion>;

export const useSuggestionContext = () => useContext(SuggestionContext);

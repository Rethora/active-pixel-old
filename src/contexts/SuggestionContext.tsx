import { SuggestionHook } from "@/hooks/useSuggestion";
import { createContext } from "react";

const SuggestionContext = createContext<SuggestionHook>({} as SuggestionHook);

export default SuggestionContext;

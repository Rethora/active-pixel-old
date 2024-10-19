import { RootHook } from "@/hooks/useRoot";
import { createContext } from "react";

const RootContext = createContext<RootHook>({} as RootHook);

export default RootContext;

import { createContext, useContext } from "react";

export type Screen = {
  id: string;
};

export const ScreenStackContext = createContext<{
  stack: Screen[];
  push: (screen: Screen) => void;
  pop: () => void;
}>({
  stack: [],
  push: () => {},
  pop: () => {},
});

export const useScreenStack = () => useContext(ScreenStackContext);

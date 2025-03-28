import { useState } from "react";
import { Screen, ScreenStackContext } from "./context";

export const ScreenStackProvider = ({ children }: { children: React.ReactNode }) => {
    const [stack, setStack] = useState<Screen[]>([]);

    const push = (screen: Screen) => setStack((s) => [...s, screen]);
    const pop = () => setStack((s) => s.slice(0, -1));

    return (
        <ScreenStackContext.Provider value={{ stack, push, pop }}>
            {stack.length > 0 ? stack[stack.length - 1].element : children}
        </ScreenStackContext.Provider>
    );
};

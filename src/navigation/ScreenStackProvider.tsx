import { useEffect, useState } from "react";
import { Screen, ScreenStackContext } from "./context";
import { getScreenById } from "./screenRegistry";
import AppLayoutWithTabs from "@/layout/AppLayoutWithTabs";

export const ScreenStackProvider = ({ children }: { children: React.ReactNode }) => {
    const [stack, setStack] = useState<Screen[]>([]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const stackParam = params.get("stack");

        if (stackParam) {
            const ids = stackParam.split(",");
            const screens: Screen[] = ids
                .map((id) => {
                    const component = getScreenById(id);
                    if (!component) {
                        console.warn(`Unknown screen id: ${id}`);
                        return null;
                    }
                    return { id };
                })
                .filter(Boolean) as Screen[];

            setStack(screens);
        }
    }, []);

    const push = (screen: Screen) => setStack((s) => [...s, screen]);
    const pop = () => setStack((s) => s.slice(0, -1));

    return (
        <ScreenStackContext.Provider value={{ stack, push, pop }}>
            {stack.length > 0 ? (
                <AppLayoutWithTabs activeTab="advanced" showTabs={false}>
                    {{
                        clear: null,
                        advanced: getScreenById(stack[stack.length - 1].id),
                    }}
                </AppLayoutWithTabs>
            ) : (
                children
            )}
        </ScreenStackContext.Provider>
    );
};

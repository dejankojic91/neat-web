
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

import CommonSettings from "../settings/CommonSettings";
import DataToRemove from "../settings/DataToRemove";
import AutoRemove from "../settings/AutoRemove";
import { useScreenStack } from "@/navigation/context";
import {TooltipProvider } from "@/components/ui/tooltip";

const AdvancedScreen = () => {
    const { push } = useScreenStack();

    const items = [
        { title: "Common Settings", screen: <CommonSettings /> },
        { title: "Data to Remove", screen: <DataToRemove /> },
        { title: "Auto-remove Settings", screen: <AutoRemove /> },
    ];

    return (
        <TooltipProvider>
            <div className="space-y-3">
                {items.map((item, id) => (
                    <Button
                        key={id}
                        type="button"
                        variant="outline"
                        className="w-full justify-between"
                        onClick={() => push({ name: item.title, element: item.screen })}
                    >
                        {item.title}
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                ))}
            </div>
        </TooltipProvider>
    );
};

export default AdvancedScreen;

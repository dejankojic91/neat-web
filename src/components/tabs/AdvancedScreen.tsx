
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useScreenStack } from "@/navigation/context";
import { TooltipProvider } from "@/components/ui/tooltip";

const AdvancedScreen = () => {
    const { push } = useScreenStack();

    const items = [
        { id: "common-settings", title: "Common Settings" },
        { id: "data-to-remove", title: "Data to Remove" },
        { id: "auto-remove", title: "Auto-remove Settings" },
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
                        onClick={() => push({ id: item.id })}
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

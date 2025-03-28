import { useScreenStack } from "@/navigation/context";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";

const CommonSettings = () => {
    const { pop } = useScreenStack();
    const [platform, setPlatform] = useState("other");

    useEffect(() => {
        const p = navigator.platform.toLowerCase();
        if (p.includes("mac")) setPlatform("mac");
        else if (p.includes("win")) setPlatform("win");
    }, []);

    // Individual toggle states
    const [toggles, setToggles] = useState({
        reloadTab: false,
        playAudio: true,
        enableShortcut: true,
    });

    // Labels & bindings
    const settings = [
        {
            key: "reloadTab",
            label: "Auto-reload tab",
        },
        {
            key: "playAudio",
            label: "Play sound on clean",
        },
        {
            key: "enableShortcut",
            label: `Enable shortcut (${platform === "mac" ? "⌥ + C" : "Alt + C"})`,
        },
    ];

    const updateToggle = (key: keyof typeof toggles, value: boolean) => {
        setToggles((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Button type="button" variant="ghost" size="icon" onClick={pop}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h2 className="text-lg font-semibold">Common Settings</h2>
            </div>

            <div className="space-y-3">
                {settings.map((item) => (
                    <div key={item.key} className="flex justify-between items-center">
                        <Label htmlFor={item.key} className="cursor-pointer">{item.label}</Label>
                        <Switch
                            id={item.key}
                            checked={toggles[item.key as keyof typeof toggles]}
                            onCheckedChange={(val) =>
                                updateToggle(item.key as keyof typeof toggles, val as boolean)
                            }
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommonSettings;

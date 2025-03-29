import { useScreenStack } from "@/navigation/context";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { getSettings, saveSettings } from "@/utils/storage";
import type { CommonSettings as SettingsType } from "@/types/settings";

const defaultToggles: SettingsType = {
    reloadTab: false,
    playAudio: true,
    enableShortcut: true,
};

const CommonSettings = () => {
    const { pop } = useScreenStack();
    const [platform, setPlatform] = useState("other");
    const [toggles, setToggles] = useState<SettingsType>(defaultToggles);

    useEffect(() => {
        const p = navigator.platform.toLowerCase();
        if (p.includes("mac")) setPlatform("mac");
        else if (p.includes("win")) setPlatform("win");

        getSettings<SettingsType>("commonSettings").then((stored) => {
            if (stored) {
                setToggles({ ...defaultToggles, ...stored });
            }
        });
    }, []);

    const updateToggle = (key: keyof SettingsType, value: boolean) => {
        const updated = { ...toggles, [key]: value };
        setToggles(updated);
        saveSettings("commonSettings", updated);
    };

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

    return (

        <div className="space-y-4">

            <div className="flex items-center gap-2">
                <Button type="button" variant="ghost" size="icon" onClick={pop}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h2 className="text-lg font-semibold">Common Settings</h2>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        const allTrue = {
                            reloadTab: true,
                            playAudio: true,
                            enableShortcut: true,
                        };
                        setToggles(allTrue);
                        saveSettings("commonSettings", allTrue);
                    }}
                >
                    Select All
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        const allFalse = {
                            reloadTab: false,
                            playAudio: false,
                            enableShortcut: false,
                        };
                        setToggles(allFalse);
                        saveSettings("commonSettings", allFalse);
                    }}
                >
                    Unselect All
                </Button>
            </div>

            <div className="space-y-3">
                {settings.map((item) => (
                    <div key={item.key} className="flex justify-between items-center">
                        <Label htmlFor={item.key} className="cursor-pointer">
                            {item.label}
                        </Label>
                        <Switch
                            id={item.key}
                            checked={toggles[item.key as keyof SettingsType]}
                            onCheckedChange={(val) =>
                                updateToggle(item.key as keyof SettingsType, val as boolean)
                            }
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommonSettings;

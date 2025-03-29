import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useScreenStack } from "@/navigation/context";
import { ArrowLeft, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import CookieOptions from "./CookieOptions";
import { Label } from "@/components/ui/label"
import type { DataSelection, DataTypeKey, PopupSettings } from "@/types/settings";
import { getSettings, saveSettings } from "@/utils/storage";



const dataItems: { key: DataTypeKey; label: string; info: string }[] = [
    { key: "cache", label: "Cached Images and Files", info: "Browser cache (images, scripts, etc)." },
    { key: "cookies", label: "Cookies", info: "Stored login sessions, preferences, etc." },
    { key: "downloads", label: "Downloads", info: "Files listed in the download history." },
    { key: "fileSystems", label: "File Systems", info: "Storage used by web apps." },
    { key: "formData", label: "Form Data", info: "Form inputs and autofill history." },
    { key: "history", label: "History", info: "Browsing history of visited pages." },
    { key: "indexedDB", label: "Indexed DB", info: "Database used by some apps/sites." },
    { key: "localStorage", label: "Local Storage", info: "Stored values like settings or tokens." },
    { key: "pluginData", label: "Plugin Data", info: "Flash/other plugin-related data." },
    { key: "passwords", label: "Passwords", info: "Saved logins and credentials." },
    { key: "webSQL", label: "WebSQL", info: "Deprecated DB format still used by some sites." },
];

const recommendedKeys: DataTypeKey[] = ["cache", "cookies", "history", "localStorage"];


const DataToRemove = () => {
    const { pop } = useScreenStack();
    const [showCookieOptions, setShowCookieOptions] = useState(false);

    const [selected, setSelected] = useState<DataSelection>(
        Object.fromEntries(dataItems.map((item) => [item.key, false])) as DataSelection
    );

    useEffect(() => {
        getSettings<PopupSettings>("popupSettings").then((stored) => {
            if (stored?.dataToRemove) {
                setSelected(stored.dataToRemove);
            }
        });
    }, []);

    const updateAll = (value: boolean) => {
        const updated: DataSelection = Object.fromEntries(
            dataItems.map((item) => [item.key, value])
        ) as DataSelection;

        setSelected(updated);
        saveSettings("popupSettings", { dataToRemove: updated });
    };

    const selectRecommended = () => {
        const updated: DataSelection = Object.fromEntries(
            dataItems.map((item) => [item.key, recommendedKeys.includes(item.key as DataTypeKey)])
        ) as DataSelection;

        setSelected(updated);
        saveSettings("popupSettings", { dataToRemove: updated });
    };

    const toggleItem = (key: DataTypeKey, value: boolean) => {
        const updated = { ...selected, [key]: value };
        setSelected(updated);
        saveSettings("popupSettings", { dataToRemove: updated });
    };


    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Button type="button" variant="ghost" size="icon" onClick={pop}>
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <h2 className="text-lg font-semibold">Data to Remove</h2>
            </div>

            <div className="flex flex-wrap gap-1">
                <Button variant="outline" size="sm" onClick={() => updateAll(true)}>
                    Select All
                </Button>
                <Button variant="outline" size="sm" onClick={selectRecommended}>
                    Recommended
                </Button>
                <Button variant="outline" size="sm" onClick={() => updateAll(false)}>
                    Unselect All
                </Button>
            </div>

            <div className="space-y-3">
                {dataItems.map((item) => (
                    <div key={item.key} className="space-y-2">
                        <div className="flex justify-between items-center px-2 py-2 rounded-md hover:bg-muted/50">
                            <div className="flex items-center gap-1 text-sm">
                                <Label htmlFor={item.key} className="cursor-pointer">{item.label}</Label>
                                {item.key === "cookies" && (
                                    <button
                                        type="button"
                                        className="ml-1 text-xs text-primary underline hover:text-primary/80 cursor-pointer"
                                        onClick={() => setShowCookieOptions((prev) => !prev)}
                                    >
                                        (options)
                                    </button>
                                )}
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent side="right">
                                        <p className="max-w-xs text-xs">{item.info}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                            <Switch
                                id={item.key}
                                checked={selected[item.key]}
                                onCheckedChange={(value) => toggleItem(item.key, value as boolean)}
                            />
                        </div>

                        {item.key === "cookies" && showCookieOptions && (
                            <CookieOptions />
                        )}
                    </div>

                ))}
            </div>
        </div>
    );
};

export default DataToRemove;

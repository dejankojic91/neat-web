import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useScreenStack } from "@/navigation/context";
import { ArrowLeft, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";
import CookieOptions from "./CookieOptions";
import { Label } from "@/components/ui/label"


const dataItems = [
    { key: "appCache", label: "App Cache", info: "Temporary data stored by installed apps." },
    { key: "cache", label: "Cache", info: "Browser cache (images, scripts, etc)." },
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

const recommendedKeys = ["cache", "cookies", "history", "localStorage"];

const DataToRemove = () => {
    const { pop } = useScreenStack();
    const [showCookieOptions, setShowCookieOptions] = useState(false);


    const [selected, setSelected] = useState<Record<string, boolean>>(
        Object.fromEntries(dataItems.map((item) => [item.key, false]))
    );

    const updateAll = (state: boolean) => {
        const newState = Object.fromEntries(dataItems.map((item) => [item.key, state]));
        setSelected(newState);
    };

    const selectRecommended = () => {
        const newState = Object.fromEntries(
            dataItems.map((item) => [item.key, recommendedKeys.includes(item.key)])
        );
        setSelected(newState);
    };

    const toggleItem = (key: string, value: boolean) => {
        setSelected((prev) => ({ ...prev, [key]: value }));
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

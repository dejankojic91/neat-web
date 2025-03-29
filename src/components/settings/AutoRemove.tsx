import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useScreenStack } from "@/navigation/context";
import { AutoCleanInterval, AutoCleanSettings } from "@/types/settings";
import { getSettings, saveSettings } from "@/utils/storage";

const options = [
    { label: "Off", value: "off" },
    { label: "Every 15 minutes", value: "15m" },
    { label: "Every 30 minutes", value: "30m" },
    { label: "Every hour", value: "1h" },
    { label: "Every 2 hours", value: "2h" },
    { label: "Daily", value: "24h" },
    { label: "When Chrome starts", value: "on_start" },
    { label: "When a tab is closed", value: "on_tab_close" },
];


const AutoRemove = () => {

    const { pop } = useScreenStack();
    const [selected, setSelected] = useState<AutoCleanInterval>("off");

    useEffect(() => {
        getSettings<AutoCleanSettings>("autoClean").then((stored) => {
            if (stored?.interval) {
                setSelected(stored.interval);
            }
        });
    }, []);

    const handleChange = async (value: AutoCleanInterval) => {
        setSelected(value);
        await saveSettings("autoClean", { interval: value });

        chrome.runtime.sendMessage({ action: "reinitAutoClean" });
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Button type="button" variant="ghost" size="icon" onClick={pop}>
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <h2 className="text-lg font-semibold">Automatic Data Remove</h2>
            </div>

            <RadioGroup value={selected} onValueChange={(val) => handleChange(val as AutoCleanInterval)}
                className="space-y-2 pl-1">
                {options.map((opt) => (
                    <div key={opt.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={opt.value} id={opt.value} />
                        <Label htmlFor={opt.value} className="cursor-pointer">
                            {opt.label}
                        </Label>
                    </div>
                ))}
            </RadioGroup>
        </div>
    );
};

export default AutoRemove;

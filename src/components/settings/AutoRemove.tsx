import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useScreenStack } from "@/navigation/context";

const options = [
    { label: "Off", value: "off" },
    { label: "15 minutes", value: "15m" },
    { label: "30 minutes", value: "30m" },
    { label: "1 hour", value: "1h" },
    { label: "2 hours", value: "2h" },
    { label: "Clear When Chrome Start", value: "on_start" },
];

const AutoRemove = () => {
    const { pop } = useScreenStack();
    const [selected, setSelected] = useState("off");

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Button type="button" variant="ghost" size="icon" onClick={pop}>
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <h2 className="text-lg font-semibold">Automatic Data Remove</h2>
            </div>

            <RadioGroup value={selected} onValueChange={setSelected} className="space-y-2 pl-1">
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
